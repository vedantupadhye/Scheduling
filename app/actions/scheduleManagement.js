"use server";

const { prisma } = require("@/lib/prisma");

// Fetch all schedules and their summaries
async function getSchedules() {
  try {
    if (!prisma) throw new Error("Prisma client is not initialized");

    const schedules = await prisma.scheduleSummary.findMany({
      select: {
        id: true,
        scheduleNo: true,
        status: true,
        totalMaterialNumber: true,
        totalMatWeight: true,
        totalRollingLength: true,
        estimatedTime: true,
        madeBy: true,
        createdDate: true,
      },
    });

    return { success: true, data: schedules };
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return { success: false, error: error.message };
  }
}

// Fetch materials for specific schedules
async function getMaterialsByScheduleNos(scheduleNos) {
  try {
    if (!prisma) throw new Error("Prisma client is not initialized");

    const materials = await prisma.scheduleConfirmation.findMany({
      where: { scheduleNo: { in: scheduleNos } },
      orderBy: { sequenceNo: "asc" },
    });

    return { success: true, data: materials };
  } catch (error) {
    console.error("Error fetching materials:", error);
    return { success: false, error: error.message };
  }
}

// Change sequence of materials within a schedule
async function changeSequence(scheduleNo, materialIds, newPosition, mode, referencePosition) {
  try {
    if (!prisma) throw new Error("Prisma client is not initialized");

    const materials = await prisma.scheduleConfirmation.findMany({
      where: { scheduleNo },
      orderBy: { sequenceNo: "asc" },
    });

    const toMove = materials.filter((m) => materialIds.includes(m.id));
    const remaining = materials.filter((m) => !materialIds.includes(m.id));

    let insertionIndex;
    if (mode === "start") {
      insertionIndex = parseInt(newPosition) - 1;
      if (insertionIndex < 0) insertionIndex = 0;
      if (insertionIndex > remaining.length) insertionIndex = remaining.length;
    } else if (mode === "after" && referencePosition) {
      const refIndex = remaining.findIndex((m) => m.sequenceNo === referencePosition);
      insertionIndex = refIndex === -1 ? remaining.length : refIndex + 1;
    } else if (mode === "before" && referencePosition) {
      const refIndex = remaining.findIndex((m) => m.sequenceNo === referencePosition);
      insertionIndex = refIndex === -1 ? 0 : refIndex;
    } else {
      throw new Error("Invalid sequence change parameters");
    }

    const reordered = [
      ...remaining.slice(0, insertionIndex),
      ...toMove,
      ...remaining.slice(insertionIndex),
    ];

    // Update sequence numbers
    await prisma.$transaction(
      reordered.map((material, index) =>
        prisma.scheduleConfirmation.update({
          where: { id: material.id },
          data: { sequenceNo: String(index + 1).padStart(3, "0") },
        })
      )
    );

    return { success: true };
  } catch (error) {
    console.error("Error changing sequence:", error);
    return { success: false, error: error.message };
  }
}

// Swap materials within a schedule
async function swapMaterials(scheduleNo, selectedIds, swapStartPosition) {
  try {
    if (!prisma) throw new Error("Prisma client is not initialized");

    const materials = await prisma.scheduleConfirmation.findMany({
      where: { scheduleNo },
      orderBy: { sequenceNo: "asc" },
    });

    const selectedIndices = selectedIds
      .map((id) => materials.findIndex((m) => m.id === id))
      .sort((a, b) => a - b);
    const swapStartIndex = parseInt(swapStartPosition) - 1;

    if (swapStartIndex < 0 || swapStartIndex >= materials.length) {
      throw new Error("Invalid swap position");
    }
    if (swapStartIndex + selectedIds.length > materials.length) {
      throw new Error("Swap range exceeds available materials");
    }
    if (
      selectedIndices.some(
        (idx) => idx >= swapStartIndex && idx < swapStartIndex + selectedIds.length
      )
    ) {
      throw new Error("Cannot swap with overlapping positions");
    }

    const selectedItems = selectedIndices.map((idx) => materials[idx]);
    const swapItems = materials.slice(
      swapStartIndex,
      swapStartIndex + selectedIds.length
    );

    const updates = [];
    selectedIndices.forEach((idx, i) => {
      updates.push(
        prisma.scheduleConfirmation.update({
          where: { id: selectedItems[i].id },
          data: { sequenceNo: swapItems[i].sequenceNo },
        })
      );
    });
    swapItems.forEach((item, i) => {
      updates.push(
        prisma.scheduleConfirmation.update({
          where: { id: item.id },
          data: { sequenceNo: selectedItems[i].sequenceNo },
        })
      );
    });

    await prisma.$transaction(updates);
    return { success: true };
  } catch (error) {
    console.error("Error swapping materials:", error);
    return { success: false, error: error.message };
  }
}

// Split a schedule into multiple schedules
async function splitSchedule(scheduleId, divisions) {
  try {
    if (!prisma) throw new Error("Prisma client is not initialized");

    const schedule = await prisma.scheduleSummary.findUnique({
      where: { id: scheduleId },
      include: { materials: true },
    });
    if (!schedule || schedule.status !== "Pending") {
      throw new Error("Can only split Pending schedules");
    }

    const materials = schedule.materials;
    const itemsPerDivision = Math.ceil(materials.length / divisions);
    const currentDate = new Date().toISOString().split("T")[0];
    const newSchedules = [];

    await prisma.$transaction(async (tx) => {
      // Delete original schedule
      await tx.scheduleSummary.delete({ where: { id: scheduleId } });

      for (let i = 0; i < divisions; i++) {
        const startIdx = i * itemsPerDivision;
        const endIdx = Math.min((i + 1) * itemsPerDivision, materials.length);
        const subMaterials = materials.slice(startIdx, endIdx);

        const newScheduleNo = `${schedule.scheduleNo}-${String(i + 1).padStart(2, "0")}`;
        const totalMatWeight = subMaterials.reduce(
          (sum, m) => sum + (m.inactualWeight || 0),
          0
        );

        const newSchedule = await tx.scheduleSummary.create({
          data: {
            scheduleNo: newScheduleNo,
            status: "Pending",
            totalMaterialNumber: subMaterials.length,
            totalMatWeight,
            totalRollingLength:
              (schedule.totalRollingLength * subMaterials.length) /
              schedule.totalMaterialNumber,
            estimatedTime: `${Math.round(
              (parseInt(schedule.estimatedTime) * subMaterials.length) /
                schedule.totalMaterialNumber
            )}h`,
            madeBy: schedule.madeBy,
            createdDate: currentDate,
          },
        });

        await tx.scheduleConfirmation.updateMany({
          where: { id: { in: subMaterials.map((m) => m.id) } },
          data: {
            scheduleNo: newScheduleNo,
            sequenceNo: {
              set: subMaterials.map((_, idx) => String(idx + 1).padStart(3, "0")),
            },
          },
        });

        newSchedules.push(newSchedule);
      }
    });

    return { success: true, newSchedules };
  } catch (error) {
    console.error("Error splitting schedule:", error);
    return { success: false, error: error.message };
  }
}

// Update a schedule (placeholder for now)
async function updateSchedule(scheduleId, updates) {
  try {
    if (!prisma) throw new Error("Prisma client is not initialized");

    await prisma.scheduleSummary.update({
      where: { id: scheduleId },
      data: updates,
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating schedule:", error);
    return { success: false, error: error.message };
  }
}

// Delete materials from a schedule
async function deleteMaterials(materialIds) {
  try {
    if (!prisma) throw new Error("Prisma client is not initialized");

    await prisma.$transaction(async (tx) => {
      const deletedMaterials = await tx.scheduleConfirmation.deleteMany({
        where: { id: { in: materialIds } },
      });

      const affectedScheduleNos = [
        ...new Set(
          (
            await tx.scheduleConfirmation.findMany({
              where: { id: { in: materialIds } },
              select: { scheduleNo: true },
            })
          ).map((m) => m.scheduleNo)
        ),
      ];

      for (const scheduleNo of affectedScheduleNos) {
        const materials = await tx.scheduleConfirmation.findMany({
          where: { scheduleNo },
        });
        if (materials.length === 0) {
          await tx.scheduleSummary.delete({ where: { scheduleNo } });
        } else {
          await tx.scheduleSummary.update({
            where: { scheduleNo },
            data: {
              totalMaterialNumber: materials.length,
              totalMatWeight: materials.reduce(
                (sum, m) => sum + (m.inactualWeight || 0),
              ),
              totalRollingLength: (materials.length / materials.length) * materials[0].totalRollingLength, // Simplified
              estimatedTime: `${Math.round((parseInt(materials[0].estimatedTime) * materials.length) / materials.length)}h`, // Simplified
            },
          });
        }
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting materials:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  getSchedules,
  getMaterialsByScheduleNos,
  changeSequence,
  swapMaterials,
  splitSchedule,
  updateSchedule,
  deleteMaterials,
};