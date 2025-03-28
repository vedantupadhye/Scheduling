"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch all schedules
export async function getSchedules() {
  try {
    const schedules = await prisma.schedule.findMany({
      orderBy: { createdDate: "desc" },
    });
    return schedules;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw new Error("Failed to fetch schedules");
  } finally {
    await prisma.$disconnect();
  }
}

// Fetch materials for specific schedules
export async function getMaterialsByScheduleIds(scheduleIds) {
  try {
    const schedules = await prisma.schedule.findMany({
      where: { id: { in: scheduleIds } },
      select: { scheduleNo: true },
    });
    const scheduleNos = schedules.map((s) => s.scheduleNo);

    const materials = await prisma.material.findMany({
      where: { scheduleNo: { in: scheduleNos } },
      orderBy: { sequenceNo: "asc" },
    });
    return materials;
  } catch (error) {
    console.error("Error fetching materials:", error);
    throw new Error("Failed to fetch materials");
  } finally {
    await prisma.$disconnect();
  }
}

// Update a schedule
export async function updateSchedule(scheduleId, data) {
  try {
    const updatedSchedule = await prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        status: data.status,
        totalMaterialNumber: data.totalMaterialNumber,
        totalMatWeight: data.totalMatWeight,
        totalRollingLength: data.totalRollingLength,
        estimatedTime: data.estimatedTime,
        madeBy: data.madeBy,
      },
    });
    return updatedSchedule;
  } catch (error) {
    console.error("Error updating schedule:", error);
    throw new Error("Failed to update schedule");
  } finally {
    await prisma.$disconnect();
  }
}

// Delete materials and update schedule
export async function deleteMaterials(materialIds) {
  try {
    const materials = await prisma.material.findMany({
      where: { id: { in: materialIds } },
      select: { scheduleNo: true, outActualWeight: true },
    });

    await prisma.material.deleteMany({
      where: { id: { in: materialIds } },
    });

    const scheduleNos = [...new Set(materials.map((m) => m.scheduleNo))];
    for (const scheduleNo of scheduleNos) {
      const remainingMaterials = await prisma.material.findMany({
        where: { scheduleNo },
      });
      const totalMatWeight = remainingMaterials.reduce(
        (sum, m) => sum + m.outActualWeight,
        0
      );
      const totalMaterialNumber = remainingMaterials.length;

      if (totalMaterialNumber === 0) {
        await prisma.schedule.delete({ where: { scheduleNo } });
      } else {
        const schedule = await prisma.schedule.findUnique({
          where: { scheduleNo },
        });
        await prisma.schedule.update({
          where: { scheduleNo },
          data: {
            totalMaterialNumber,
            totalMatWeight,
            totalRollingLength:
              (schedule.totalRollingLength * totalMaterialNumber) /
              schedule.totalMaterialNumber,
            estimatedTime: `${Math.round(
              (parseInt(schedule.estimatedTime) * totalMaterialNumber) /
                schedule.totalMaterialNumber
            )}h`,
          },
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting materials:", error);
    throw new Error("Failed to delete materials");
  } finally {
    await prisma.$disconnect();
  }
}

// Change sequence of materials within a schedule
export async function changeMaterialSequence(scheduleId, materialIds, positionData) {
  try {
    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: { materials: { orderBy: { sequenceNo: "asc" } } },
    });
    if (!schedule) throw new Error("Schedule not found");

    const materials = schedule.materials;
    const materialsToMove = materials.filter((m) => materialIds.includes(m.id));
    const remainingMaterials = materials.filter((m) => !materialIds.includes(m.id));

    let insertionIndex;
    if (positionData.mode === "start") {
      insertionIndex = Math.max(0, Math.min(parseInt(positionData.value) - 1, remainingMaterials.length));
    } else {
      const refMaterial = remainingMaterials.find((m) => m.sequenceNo === positionData.reference);
      const refIndex = refMaterial ? remainingMaterials.indexOf(refMaterial) : -1;
      insertionIndex =
        positionData.mode === "after"
          ? refIndex === -1
            ? remainingMaterials.length
            : refIndex + 1
          : refIndex === -1
          ? 0
          : refIndex;
    }

    const reorderedMaterials = [
      ...remainingMaterials.slice(0, insertionIndex),
      ...materialsToMove,
      ...remainingMaterials.slice(insertionIndex),
    ];

    // Update sequence numbers
    await Promise.all(
      reorderedMaterials.map((material, index) =>
        prisma.material.update({
          where: { id: material.id },
          data: { sequenceNo: (index + 1).toString().padStart(3, "0") },
        })
      )
    );

    return { success: true };
  } catch (error) {
    console.error("Error changing sequence:", error);
    throw new Error("Failed to change sequence");
  } finally {
    await prisma.$disconnect();
  }
}

// Swap materials within a schedule
export async function swapMaterials(scheduleId, materialIds, swapStartPosition) {
  try {
    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: { materials: { orderBy: { sequenceNo: "asc" } } },
    });
    if (!schedule) throw new Error("Schedule not found");

    const materials = schedule.materials;
    const selectedIndices = materialIds
      .map((id) => materials.findIndex((m) => m.id === id))
      .sort((a, b) => a - b);
    const swapStartIndex = parseInt(swapStartPosition) - 1;

    if (
      swapStartIndex < 0 ||
      swapStartIndex + materialIds.length > materials.length ||
      selectedIndices.some(
        (idx) => idx >= swapStartIndex && idx < swapStartIndex + materialIds.length
      )
    ) {
      throw new Error("Invalid swap position or overlap detected");
    }

    const selectedItems = selectedIndices.map((idx) => materials[idx]);
    const swapItems = Array.from(
      { length: materialIds.length },
      (_, i) => materials[swapStartIndex + i]
    );

    await Promise.all([
      ...selectedIndices.map((idx, i) =>
        prisma.material.update({
          where: { id: materials[idx].id },
          data: { sequenceNo: swapItems[i].sequenceNo },
        })
      ),
      ...swapItems.map((item, i) =>
        prisma.material.update({
          where: { id: item.id },
          data: { sequenceNo: selectedItems[i].sequenceNo },
        })
      ),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Error swapping materials:", error);
    throw new Error("Failed to swap materials");
  } finally {
    await prisma.$disconnect();
  }
}

// Split a schedule
export async function splitSchedule(scheduleId, divisions) {
  try {
    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: { materials: { orderBy: { sequenceNo: "asc" } } },
    });
    if (!schedule || schedule.status !== "Pending") {
      throw new Error("Schedule not found or not in Pending status");
    }

    const materials = schedule.materials;
    const itemsPerDivision = Math.ceil(materials.length / divisions);
    const currentDate = new Date().toISOString().split("T")[0];

    const splitSchedules = [];
    for (let i = 0; i < divisions; i++) {
      const startIdx = i * itemsPerDivision;
      const endIdx = Math.min((i + 1) * itemsPerDivision, materials.length);
      const subMaterials = materials.slice(startIdx, endIdx);

      const newScheduleNo = `${schedule.scheduleNo}-${(i + 1).toString().padStart(2, "0")}`;
      const totalMatWeight = subMaterials.reduce((sum, m) => sum + m.outActualWeight, 0);
      const totalMaterialNumber = subMaterials.length;

      const newSchedule = await prisma.schedule.create({
        data: {
          scheduleNo: newScheduleNo,
          status: schedule.status,
          totalMaterialNumber,
          totalMatWeight,
          totalRollingLength:
            (schedule.totalRollingLength * totalMaterialNumber) / schedule.totalMaterialNumber,
          estimatedTime: `${Math.round(
            (parseInt(schedule.estimatedTime) * totalMaterialNumber) /
              schedule.totalMaterialNumber
          )}h`,
          madeBy: schedule.madeBy,
          createdDate,
        },
      });

      await prisma.material.updateMany({
        where: { id: { in: subMaterials.map((m) => m.id) } },
        data: { scheduleNo: newScheduleNo },
      });

      await Promise.all(
        subMaterials.map((material, index) =>
          prisma.material.update({
            where: { id: material.id },
            data: { sequenceNo: (index + 1).toString().padStart(3, "0") },
          })
        )
      );

      splitSchedules.push(newSchedule);
    }

    await prisma.schedule.delete({ where: { id: scheduleId } });

    return splitSchedules;
  } catch (error) {
    console.error("Error splitting schedule:", error);
    throw new Error("Failed to split schedule");
  } finally {
    await prisma.$disconnect();
  }
}

// Seed initial data (optional, run once)
export async function seedInitialData() {
  try {
    await prisma.schedule.createMany({
      data: [
        { id: '1', scheduleNo: 'SCH001', status: 'In Progress', totalMaterialNumber: 9, totalMatWeight: 2700, totalRollingLength: 900, estimatedTime: '3h', madeBy: 'John', createdDate: new Date('2025-03-24') },
        { id: '2', scheduleNo: 'SCH002', status: 'Completed', totalMaterialNumber: 9, totalMatWeight: 2700, totalRollingLength: 900, estimatedTime: '3h', madeBy: 'Jane', createdDate: new Date('2025-03-23') },
        { id: '3', scheduleNo: 'SCH003', status: 'Pending', totalMaterialNumber: 9, totalMatWeight: 2700, totalRollingLength: 900, estimatedTime: '3h', madeBy: 'Mike', createdDate: new Date('2025-03-25') },
      ],
      skipDuplicates: true,
    });

    await prisma.material.createMany({
      data: [
        // SCH001 materials
        { id: 'm1', scheduleNo: 'SCH001', sequenceNo: '001', outMatMo: 'MAT1', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 1', inMatNo: 'IN1', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
        { id: 'm2', scheduleNo: 'SCH001', sequenceNo: '002', outMatMo: 'MAT2', outThickness: 2, outWidth: 1000, outGrade: 'A', outCoilWeight: 300, outActualWeight: 300, materialSummary: 'Summary 2', inMatNo: 'IN2', inThickness: 2.1, inWidth: 1000, grade: 'A', actualWeight: 300 },
        // Add remaining materials similarly (up to m27 as in your initial data)
      ],
      skipDuplicates: true,
    });

    return { success: true };
  } catch (error) {
    console.error("Error seeding data:", error);
    throw new Error("Failed to seed initial data");
  } finally {
    await prisma.$disconnect();
  }
}