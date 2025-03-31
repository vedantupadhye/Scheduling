// "use server";

// const { prisma } = require("@/lib/prisma");

// // Fetch all schedules and their summaries
// async function getSchedules() {
//   try {
//     if (!prisma) throw new Error("Prisma client is not initialized");

//     const schedules = await prisma.scheduleSummary.findMany({
//       select: {
//         id: true,
//         scheduleNo: true,
//         status: true,
//         totalMaterialNumber: true,
//         totalMatWeight: true,
//         totalRollingLength: true,
//         estimatedTime: true,
//         madeBy: true,
//         createdDate: true,
//       },
//     });

//     return { success: true, data: schedules };
//   } catch (error) {
//     console.error("Error fetching schedules:", error);
//     return { success: false, error: error.message };
//   }
// }

// // Fetch materials for specific schedules
// async function getMaterialsByScheduleNos(scheduleNos) {
//   try {
//     if (!prisma) throw new Error("Prisma client is not initialized");

//     const materials = await prisma.scheduleConfirmation.findMany({
//       where: { scheduleNo: { in: scheduleNos } },
//       orderBy: { sequenceNo: "asc" },
//     });

//     return { success: true, data: materials };
//   } catch (error) {
//     console.error("Error fetching materials:", error);
//     return { success: false, error: error.message };
//   }
// }

// // Change sequence of materials within a schedule
// async function changeSequence(scheduleNo, materialIds, newPosition, mode, referencePosition) {
//   try {
//     if (!prisma) throw new Error("Prisma client is not initialized");

//     const materials = await prisma.scheduleConfirmation.findMany({
//       where: { scheduleNo },
//       orderBy: { sequenceNo: "asc" },
//     });

//     const toMove = materials.filter((m) => materialIds.includes(m.id));
//     const remaining = materials.filter((m) => !materialIds.includes(m.id));

//     let insertionIndex;
//     if (mode === "start") {
//       insertionIndex = parseInt(newPosition) - 1;
//       if (insertionIndex < 0) insertionIndex = 0;
//       if (insertionIndex > remaining.length) insertionIndex = remaining.length;
//     } else if (mode === "after" && referencePosition) {
//       const refIndex = remaining.findIndex((m) => m.sequenceNo === referencePosition);
//       insertionIndex = refIndex === -1 ? remaining.length : refIndex + 1;
//     } else if (mode === "before" && referencePosition) {
//       const refIndex = remaining.findIndex((m) => m.sequenceNo === referencePosition);
//       insertionIndex = refIndex === -1 ? 0 : refIndex;
//     } else {
//       throw new Error("Invalid sequence change parameters");
//     }

//     const reordered = [
//       ...remaining.slice(0, insertionIndex),
//       ...toMove,
//       ...remaining.slice(insertionIndex),
//     ];

//     // Update sequence numbers
//     await prisma.$transaction(
//       reordered.map((material, index) =>
//         prisma.scheduleConfirmation.update({
//           where: { id: material.id },
//           data: { sequenceNo: String(index + 1).padStart(3, "0") },
//         })
//       )
//     );

//     return { success: true };
//   } catch (error) {
//     console.error("Error changing sequence:", error);
//     return { success: false, error: error.message };
//   }
// }

// // Swap materials within a schedule
// async function swapMaterials(scheduleNo, selectedIds, swapStartPosition) {
//   try {
//     if (!prisma) throw new Error("Prisma client is not initialized");

//     const materials = await prisma.scheduleConfirmation.findMany({
//       where: { scheduleNo },
//       orderBy: { sequenceNo: "asc" },
//     });

//     const selectedIndices = selectedIds
//       .map((id) => materials.findIndex((m) => m.id === id))
//       .sort((a, b) => a - b);
//     const swapStartIndex = parseInt(swapStartPosition) - 1;

//     if (swapStartIndex < 0 || swapStartIndex >= materials.length) {
//       throw new Error("Invalid swap position");
//     }
//     if (swapStartIndex + selectedIds.length > materials.length) {
//       throw new Error("Swap range exceeds available materials");
//     }
//     if (
//       selectedIndices.some(
//         (idx) => idx >= swapStartIndex && idx < swapStartIndex + selectedIds.length
//       )
//     ) {
//       throw new Error("Cannot swap with overlapping positions");
//     }

//     const selectedItems = selectedIndices.map((idx) => materials[idx]);
//     const swapItems = materials.slice(
//       swapStartIndex,
//       swapStartIndex + selectedIds.length
//     );

//     const updates = [];
//     selectedIndices.forEach((idx, i) => {
//       updates.push(
//         prisma.scheduleConfirmation.update({
//           where: { id: selectedItems[i].id },
//           data: { sequenceNo: swapItems[i].sequenceNo },
//         })
//       );
//     });
//     swapItems.forEach((item, i) => {
//       updates.push(
//         prisma.scheduleConfirmation.update({
//           where: { id: item.id },
//           data: { sequenceNo: selectedItems[i].sequenceNo },
//         })
//       );
//     });

//     await prisma.$transaction(updates);
//     return { success: true };
//   } catch (error) {
//     console.error("Error swapping materials:", error);
//     return { success: false, error: error.message };
//   }
// }

// // Split a schedule into multiple schedules
// async function splitSchedule(scheduleId, divisions) {
//   try {
//     if (!prisma) throw new Error("Prisma client is not initialized");

//     const schedule = await prisma.scheduleSummary.findUnique({
//       where: { id: scheduleId },
//       include: { materials: true },
//     });
//     if (!schedule || schedule.status !== "Pending") {
//       throw new Error("Can only split Pending schedules");
//     }

//     const materials = schedule.materials;
//     const itemsPerDivision = Math.ceil(materials.length / divisions);
//     const currentDate = new Date().toISOString().split("T")[0];
//     const newSchedules = [];

//     await prisma.$transaction(async (tx) => {
//       // Delete original schedule
//       await tx.scheduleSummary.delete({ where: { id: scheduleId } });

//       for (let i = 0; i < divisions; i++) {
//         const startIdx = i * itemsPerDivision;
//         const endIdx = Math.min((i + 1) * itemsPerDivision, materials.length);
//         const subMaterials = materials.slice(startIdx, endIdx);

//         const newScheduleNo = `${schedule.scheduleNo}-${String(i + 1).padStart(2, "0")}`;
//         const totalMatWeight = subMaterials.reduce(
//           (sum, m) => sum + (m.inactualWeight || 0),
//           0
//         );

//         const newSchedule = await tx.scheduleSummary.create({
//           data: {
//             scheduleNo: newScheduleNo,
//             status: "Pending",
//             totalMaterialNumber: subMaterials.length,
//             totalMatWeight,
//             totalRollingLength:
//               (schedule.totalRollingLength * subMaterials.length) /
//               schedule.totalMaterialNumber,
//             estimatedTime: `${Math.round(
//               (parseInt(schedule.estimatedTime) * subMaterials.length) /
//                 schedule.totalMaterialNumber
//             )}h`,
//             madeBy: schedule.madeBy,
//             createdDate: currentDate,
//           },
//         });

//         await tx.scheduleConfirmation.updateMany({
//           where: { id: { in: subMaterials.map((m) => m.id) } },
//           data: {
//             scheduleNo: newScheduleNo,
//             sequenceNo: {
//               set: subMaterials.map((_, idx) => String(idx + 1).padStart(3, "0")),
//             },
//           },
//         });

//         newSchedules.push(newSchedule);
//       }
//     });

//     return { success: true, newSchedules };
//   } catch (error) {
//     console.error("Error splitting schedule:", error);
//     return { success: false, error: error.message };
//   }
// }

// // Update a schedule (placeholder for now)
// async function updateSchedule(scheduleId, updates) {
//   try {
//     if (!prisma) throw new Error("Prisma client is not initialized");

//     await prisma.scheduleSummary.update({
//       where: { id: scheduleId },
//       data: updates,
//     });

//     return { success: true };
//   } catch (error) {
//     console.error("Error updating schedule:", error);
//     return { success: false, error: error.message };
//   }
// }

// // Delete materials from a schedule
// async function deleteMaterials(materialIds) {
//   try {
//     if (!prisma) throw new Error("Prisma client is not initialized");

//     await prisma.$transaction(async (tx) => {
//       const deletedMaterials = await tx.scheduleConfirmation.deleteMany({
//         where: { id: { in: materialIds } },
//       });

//       const affectedScheduleNos = [
//         ...new Set(
//           (
//             await tx.scheduleConfirmation.findMany({
//               where: { id: { in: materialIds } },
//               select: { scheduleNo: true },
//             })
//           ).map((m) => m.scheduleNo)
//         ),
//       ];

//       for (const scheduleNo of affectedScheduleNos) {
//         const materials = await tx.scheduleConfirmation.findMany({
//           where: { scheduleNo },
//         });
//         if (materials.length === 0) {
//           await tx.scheduleSummary.delete({ where: { scheduleNo } });
//         } else {
//           await tx.scheduleSummary.update({
//             where: { scheduleNo },
//             data: {
//               totalMaterialNumber: materials.length,
//               totalMatWeight: materials.reduce(
//                 (sum, m) => sum + (m.inactualWeight || 0),
//               ),
//               totalRollingLength: (materials.length / materials.length) * materials[0].totalRollingLength, // Simplified
//               estimatedTime: `${Math.round((parseInt(materials[0].estimatedTime) * materials.length) / materials.length)}h`, // Simplified
//             },
//           });
//         }
//       }
//     });

//     return { success: true };
//   } catch (error) {
//     console.error("Error deleting materials:", error);
//     return { success: false, error: error.message };
//   }
// }

// module.exports = {
//   getSchedules,
//   getMaterialsByScheduleNos,
//   changeSequence,
//   swapMaterials,
//   splitSchedule,
//   updateSchedule,
//   deleteMaterials,
// };





// "use server";

// import { prisma } from "@/lib/prisma";

// // Helper function to get current date in YYYY-MM-DD format
// const getCurrentDate = () => new Date().toISOString().split('T')[0];

// // Get all schedules with their summary data
// export async function getSchedulesSummary() {
//   try {
//     if (!prisma) throw new Error("Prisma client is not initialized");

//     // Get all unique schedule numbers with their aggregated data
//     const schedules = await prisma.scheduleConfirmation.groupBy({
//       by: ['scheduleNo'],
//       _count: {
//         id: true,
//       },
//       _sum: {
//         outCoilWeight: true,
//         inactualWeight: true,
//       },
//       _max: {
//         createdAt: true,
//       },
//     });

//     // Get additional details for each schedule
//     const scheduleDetails = await prisma.scheduleConfirmation.findMany({
//       select: {
//         scheduleNo: true,
//         createdAt: true,
//       },
//       distinct: ['scheduleNo'],
//     });

//     const formattedSchedules = await Promise.all(schedules.map(async (schedule) => {
//       const firstItem = await prisma.scheduleConfirmation.findFirst({
//         where: { scheduleNo: schedule.scheduleNo },
//         select: {
//           id: true,
//           createdAt: true,
//         },
//       });

//       return {
//         id: firstItem.id.toString(),
//         scheduleNo: schedule.scheduleNo,
//         status: 'Pending', // You might want to add a status field to your schema
//         totalMaterialNumber: schedule._count.id,
//         totalMatWeight: schedule._sum.outCoilWeight || schedule._sum.inactualWeight || 0,
//         totalRollingLength: 900, // This seems to be hardcoded in your frontend
//         EstimatedTime: '3h', // This seems to be hardcoded in your frontend
//         madeBy: 'System', // Add this to your schema if needed
//         createdDate: firstItem.createdAt.toISOString().split('T')[0],
//       };
//     }));

//     return { success: true, data: formattedSchedules };
//   } catch (error) {
//     console.error("Error fetching schedules summary:", error);
//     return { success: false, error: error.message };
//   }
// }

// // Get materials for specific schedules
// // export async function getScheduleMaterials(scheduleIds) {
// //   try {
// //     if (!prisma) throw new Error("Prisma client is not initialized");

// //     const schedules = await prisma.scheduleConfirmation.findMany({
// //       where: {
// //         id: {
// //           in: scheduleIds.map(id => parseInt(id)),
// //         },
// //       },
// //       orderBy: {
// //         id: 'asc',
// //       },
// //     });

// //     const materials = schedules.map((item, index) => ({
// //       id: item.id.toString(),
// //       scheduleNo: item.scheduleNo,
// //       sequenceNo: (index + 1).toString().padStart(3, '0'),
// //       outMatMo: item.outMaterialNo,
// //       outThickness: item.outThickness,
// //       outWidth: item.outWidth,
// //       outGrade: item.outGrade,
// //       outCoilWeight: item.outCoilWeight,
// //       outActualWeight: item.outCoilWeight, // Using same value as coil weight
// //       materialSummary: `Material ${item.outMaterialNo}`, // Customize as needed
// //       inMatNo: item.inMatNo,
// //       inThickness: item.inThickness,
// //       inWidth: item.inWidth,
// //       grade: item.inGrade,
// //       actualWeight: item.inactualWeight,
// //     }));

// //     return { success: true, data: materials };
// //   } catch (error) {
// //     console.error("Error fetching schedule materials:", error);
// //     return { success: false, error: error.message };
// //   }
// // }


// // Get materials for specific schedules
// export async function getScheduleMaterials(scheduleIds) {
//   try {
//     if (!prisma) throw new Error("Prisma client is not initialized");

//     // Get the scheduleNos corresponding to the selected scheduleIds
//     const selectedSchedules = await prisma.scheduleConfirmation.findMany({
//       where: {
//         id: {
//           in: scheduleIds.map(id => parseInt(id)),
//         },
//       },
//       select: {
//         scheduleNo: true,
//       },
//       distinct: ['scheduleNo'], // Ensure unique scheduleNos
//     });

//     const scheduleNos = selectedSchedules.map(s => s.scheduleNo);

//     // Fetch all materials for the selected scheduleNos
//     const materials = await prisma.scheduleConfirmation.findMany({
//       where: {
//         scheduleNo: {
//           in: scheduleNos,
//         },
//       },
//       orderBy: {
//         id: 'asc',
//       },
//     });

//     // Transform the data to match the frontend structure
//     const formattedMaterials = materials.map((item, index) => ({
//       id: item.id.toString(),
//       scheduleNo: item.scheduleNo,
//       sequenceNo: (index + 1).toString().padStart(3, '0'), // This could be improved with a proper sequence field
//       outMatMo: item.outMaterialNo,
//       outThickness: item.outThickness,
//       outWidth: item.outWidth,
//       outGrade: item.outGrade,
//       outCoilWeight: item.outCoilWeight,
//       outActualWeight: item.outCoilWeight, // Using same value as coil weight
//       materialSummary: `Material ${item.outMaterialNo}`, // Customize as needed
//       inMatNo: item.inMatNo,
//       inThickness: item.inThickness,
//       inWidth: item.inWidth,
//       grade: item.inGrade,
//       actualWeight: item.inactualWeight,
//     }));

//     return { success: true, data: formattedMaterials };
//   } catch (error) {
//     console.error("Error fetching schedule materials:", error);
//     return { success: false, error: error.message };
//   }
// }

// // Change sequence of materials
// export async function changeSequence(scheduleId, materialIds, position, mode, referenceId) {
//   try {
//     if (!prisma) throw new Error("Prisma client is not initialized");

//     const materials = await prisma.scheduleConfirmation.findMany({
//       where: {
//         id: {
//           in: materialIds.map(id => parseInt(id)),
//         },
//       },
//     });

//     // For simplicity, we'll delete and recreate with new order
//     await prisma.scheduleConfirmation.deleteMany({
//       where: {
//         id: {
//           in: materialIds.map(id => parseInt(id)),
//         },
//       },
//     });

//     const allMaterials = await prisma.scheduleConfirmation.findMany({
//       where: {
//         scheduleNo: materials[0].scheduleNo,
//       },
//       orderBy: {
//         id: 'asc',
//       },
//     });

//     const remainingMaterials = allMaterials.filter(m => !materialIds.includes(m.id.toString()));
//     const movingMaterials = materials;

//     let newOrder;
//     if (mode === 'start') {
//       const pos = parseInt(position) - 1;
//       newOrder = [
//         ...remainingMaterials.slice(0, pos),
//         ...movingMaterials,
//         ...remainingMaterials.slice(pos),
//       ];
//     } else {
//       const refIndex = remainingMaterials.findIndex(m => m.id.toString() === referenceId);
//       const insertIndex = mode === 'before' ? refIndex : refIndex + 1;
//       newOrder = [
//         ...remainingMaterials.slice(0, insertIndex),
//         ...movingMaterials,
//         ...remainingMaterials.slice(insertIndex),
//       ];
//     }

//     await prisma.scheduleConfirmation.createMany({
//       data: newOrder,
//     });

//     return { success: true };
//   } catch (error) {
//     console.error("Error changing sequence:", error);
//     return { success: false, error: error.message };
//   }
// }

// // Swap materials
// export async function swapMaterials(scheduleId, selectedIds, swapPosition) {
//   try {
//     if (!prisma) throw new Error("Prisma client is not initialized");

//     const scheduleMaterials = await prisma.scheduleConfirmation.findMany({
//       where: {
//         scheduleNo: (await prisma.scheduleConfirmation.findFirst({ where: { id: parseInt(scheduleId) } })).scheduleNo,
//       },
//       orderBy: {
//         id: 'asc',
//       },
//     });

//     const selectedIndices = selectedIds.map(id => 
//       scheduleMaterials.findIndex(m => m.id.toString() === id)
//     ).sort((a, b) => a - b);

//     const swapStartIndex = parseInt(swapPosition) - 1;

//     if (swapStartIndex + selectedIds.length > scheduleMaterials.length) {
//       throw new Error("Swap position exceeds available materials");
//     }

//     const selectedItems = selectedIndices.map(i => scheduleMaterials[i]);
//     const swapItems = Array.from(
//       { length: selectedIds.length },
//       (_, i) => scheduleMaterials[swapStartIndex + i]
//     );

//     const updatedMaterials = [...scheduleMaterials];
//     selectedIndices.forEach((index, i) => {
//       updatedMaterials[index] = swapItems[i];
//     });
//     swapItems.forEach((item, i) => {
//       updatedMaterials[swapStartIndex + i] = selectedItems[i];
//     });

//     await prisma.scheduleConfirmation.deleteMany({
//       where: {
//         scheduleNo: scheduleMaterials[0].scheduleNo,
//       },
//     });

//     await prisma.scheduleConfirmation.createMany({
//       data: updatedMaterials,
//     });

//     return { success: true };
//   } catch (error) {
//     console.error("Error swapping materials:", error);
//     return { success: false, error: error.message };
//   }
// }

// // Split schedule
// export async function splitSchedule(scheduleId, divisions) {
//   try {
//     if (!prisma) throw new Error("Prisma client is not initialized");

//     const scheduleMaterials = await prisma.scheduleConfirmation.findMany({
//       where: {
//         scheduleNo: (await prisma.scheduleConfirmation.findFirst({ where: { id: parseInt(scheduleId) } })).scheduleNo,
//       },
//       orderBy: {
//         id: 'asc',
//       },
//     });

//     const itemsPerDivision = Math.ceil(scheduleMaterials.length / divisions);
//     const originalScheduleNo = scheduleMaterials[0].scheduleNo;

//     await prisma.scheduleConfirmation.deleteMany({
//       where: { scheduleNo: originalScheduleNo },
//     });

//     const newSchedules = [];
//     for (let i = 0; i < divisions; i++) {
//       const startIndex = i * itemsPerDivision;
//       const endIndex = Math.min((i + 1) * itemsPerDivision, scheduleMaterials.length);
//       const subScheduleItems = scheduleMaterials.slice(startIndex, endIndex);

//       const newScheduleNo = `${originalScheduleNo}-${(i + 1).toString().padStart(2, '0')}`;
//       newSchedules.push({
//         scheduleNo: newScheduleNo,
//         items: subScheduleItems.map((item, index) => ({
//           ...item,
//           scheduleNo: newScheduleNo,
//           id: undefined, // Remove old ID to create new record
//         })),
//       });
//     }

//     for (const schedule of newSchedules) {
//       await prisma.scheduleConfirmation.createMany({
//         data: schedule.items,
//       });
//     }

//     return { success: true };
//   } catch (error) {
//     console.error("Error splitting schedule:", error);
//     return { success: false, error: error.message };
//   }
// }

// // Delete materials
// export async function deleteMaterials(materialIds) {
//   try {
//     if (!prisma) throw new Error("Prisma client is not initialized");

//     await prisma.scheduleConfirmation.deleteMany({
//       where: {
//         id: {
//           in: materialIds.map(id => parseInt(id)),
//         },
//       },
//     });

//     return { success: true };
//   } catch (error) {
//     console.error("Error deleting materials:", error);
//     return { success: false, error: error.message };
//   }
// }

// // Update materials (placeholder - implement according to your needs)
// export async function updateMaterials(materialData) {
//   try {
//     if (!prisma) throw new Error("Prisma client is not initialized");

//     // Implement update logic based on your specific requirements
//     // This is a placeholder as your frontend shows it as not implemented
//     return { success: true, message: "Update functionality not implemented yet" };
//   } catch (error) {
//     console.error("Error updating materials:", error);
//     return { success: false, error: error.message };
//   }
// }

"use server";

import { prisma } from "@/lib/prisma";

// Helper function to get current date in YYYY-MM-DD format
const getCurrentDate = () => new Date().toISOString().split('T')[0];

// Get all schedules with their summary data
export async function getSchedulesSummary() {
  try {
    if (!prisma) throw new Error("Prisma client is not initialized");

    const schedules = await prisma.scheduleConfirmation.groupBy({
      by: ['scheduleNo'],
      _count: {
        id: true,
      },
      _sum: {
        outCoilWeight: true,
        inactualWeight: true,
      },
      _max: {
        createdAt: true,
      },
    });

    const formattedSchedules = await Promise.all(schedules.map(async (schedule) => {
      const firstItem = await prisma.scheduleConfirmation.findFirst({
        where: { scheduleNo: schedule.scheduleNo },
        select: {
          id: true,
          createdAt: true,
        },
      });

      return {
        id: firstItem.id.toString(),
        scheduleNo: schedule.scheduleNo,
        status: 'Pending',
        totalMaterialNumber: schedule._count.id,
        totalMatWeight: schedule._sum.outCoilWeight || schedule._sum.inactualWeight || 0,
        totalRollingLength: 900,
        EstimatedTime: '3h',
        madeBy: 'System',
        createdDate: firstItem.createdAt.toISOString().split('T')[0],
      };
    }));

    return { success: true, data: formattedSchedules };
  } catch (error) {
    console.error("Error fetching schedules summary:", error);
    return { success: false, error: error.message };
  }
}

// Get materials for specific schedules
export async function getScheduleMaterials(scheduleIds) {
  try {
    if (!prisma) throw new Error("Prisma client is not initialized");

    // Fetch scheduleNos based on provided IDs from scheduleData-like logic
    const selectedSchedules = await prisma.scheduleConfirmation.findMany({
      where: {
        id: {
          in: scheduleIds.map(id => parseInt(id)),
        },
      },
      select: {
        scheduleNo: true,
      },
      distinct: ['scheduleNo'],
    });

    const scheduleNos = selectedSchedules.map(s => s.scheduleNo);
    console.log("Fetching materials for scheduleNos:", scheduleNos);

    if (scheduleNos.length === 0) {
      // If no schedules are found with the given IDs, it might be because IDs changed
      // Fallback: Use the first scheduleNo from the database if IDs are stale
      const firstSchedule = await prisma.scheduleConfirmation.findFirst({
        select: { scheduleNo: true },
      });
      if (!firstSchedule) {
        console.log("No schedules found in database");
        return { success: true, data: [] };
      }
      scheduleNos.push(firstSchedule.scheduleNo);
      console.log("Falling back to scheduleNo:", scheduleNos);
    }

    const materials = await prisma.scheduleConfirmation.findMany({
      where: {
        scheduleNo: {
          in: scheduleNos,
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
    console.log("Raw materials from DB:", materials);

    const formattedMaterials = materials.map((item, index) => ({
      id: item.id.toString(),
      scheduleNo: item.scheduleNo,
      sequenceNo: (index + 1).toString().padStart(3, '0'),
      outMatMo: item.outMaterialNo,
      outThickness: item.outThickness,
      outWidth: item.outWidth,
      outGrade: item.outGrade,
      outCoilWeight: item.outCoilWeight,
      outActualWeight: item.outCoilWeight,
      materialSummary: `Material ${item.outMaterialNo}`,
      inMatNo: item.inMatNo,
      inThickness: item.inThickness,
      inWidth: item.inWidth,
      grade: item.inGrade,
      actualWeight: item.inactualWeight,
    }));

    console.log("Formatted materials:", formattedMaterials);
    return { success: true, data: formattedMaterials };
  } catch (error) {
    console.error("Error fetching schedule materials:", error);
    return { success: false, error: error.message };
  }
}
// Change sequence of materials
export async function changeSequence(scheduleNo, materialIds, position, mode, referenceId) {
  try {
    if (!prisma) throw new Error("Prisma client is not initialized");
    console.log("changeSequence inputs:", { scheduleNo, materialIds, position, mode, referenceId });
    const scheduleExists = await prisma.scheduleConfirmation.findFirst({
      where: { scheduleNo },
    });
    if (!scheduleExists) throw new Error("Schedule not found");

    const materials = await prisma.scheduleConfirmation.findMany({
      where: {
        id: {
          in: materialIds.map(id => parseInt(id)),
        },
      },
    });
    if (materials.length === 0) throw new Error("No materials found to reorder");

    const allMaterials = await prisma.scheduleConfirmation.findMany({
      where: { scheduleNo },
      orderBy: { id: 'asc' },
    });

    await prisma.scheduleConfirmation.deleteMany({
      where: {
        id: {
          in: materialIds.map(id => parseInt(id)),
        },
      },
    });

    const remainingMaterials = allMaterials.filter(m => !materialIds.includes(m.id.toString()));
    const movingMaterials = materials;

    let newOrder;
    if (mode === 'start') {
      const pos = parseInt(position) - 1;
      newOrder = [
        ...remainingMaterials.slice(0, pos),
        ...movingMaterials,
        ...remainingMaterials.slice(pos),
      ];
    } else {
      const refIndex = remainingMaterials.findIndex(m => m.id.toString() === referenceId);
      const insertIndex = mode === 'before' ? refIndex : refIndex + 1;
      newOrder = [
        ...remainingMaterials.slice(0, insertIndex),
        ...movingMaterials,
        ...remainingMaterials.slice(insertIndex),
      ];
    }

    const newOrderData = newOrder.map(item => ({
      scheduleNo: item.scheduleNo,
      orderNo: item.orderNo,
      outMaterialNo: item.outMaterialNo,
      outThickness: item.outThickness,
      outWidth: item.outWidth,
      outGrade: item.outGrade,
      outCoilWeight: item.outCoilWeight,
      inMatNo: item.inMatNo,
      inThickness: item.inThickness,
      inWidth: item.inWidth,
      inGrade: item.inGrade,
      inactualWeight: item.inactualWeight,
      createdAt: item.createdAt,
    }));

    await prisma.scheduleConfirmation.deleteMany({
      where: { scheduleNo },
    });

    await prisma.scheduleConfirmation.createMany({
      data: newOrderData,
    });

    return { success: true };
  } catch (error) {
    console.error("Error changing sequence:", error);
    return { success: false, error: error.message };
  }
}

// Swap materials
export async function swapMaterials(scheduleNo, selectedIds, swapPosition) {
  try {
    if (!prisma) throw new Error("Prisma client is not initialized");

    const scheduleExists = await prisma.scheduleConfirmation.findFirst({
      where: { scheduleNo },
    });
    if (!scheduleExists) throw new Error("Schedule not found");

    const scheduleMaterials = await prisma.scheduleConfirmation.findMany({
      where: { scheduleNo },
      orderBy: { id: 'asc' },
    });
    console.log("Original materials:", scheduleMaterials);

    const selectedIndices = selectedIds.map(id => 
      scheduleMaterials.findIndex(m => m.id.toString() === id)
    ).filter(i => i !== -1);
    console.log("Selected indices:", selectedIndices);

    const swapStartIndex = parseInt(swapPosition) - 1;
    if (swapStartIndex < 0 || swapStartIndex + selectedIds.length > scheduleMaterials.length) {
      throw new Error("Invalid swap position or range");
    }

    const selectedItems = selectedIndices.map(i => scheduleMaterials[i]);
    const swapItems = Array.from(
      { length: selectedIds.length },
      (_, i) => scheduleMaterials[swapStartIndex + i]
    );
    console.log("Selected items:", selectedItems);
    console.log("Swap items:", swapItems);

    const updatedMaterials = [...scheduleMaterials];
    selectedIndices.forEach((index, i) => {
      updatedMaterials[index] = swapItems[i];
    });
    swapItems.forEach((item, i) => {
      updatedMaterials[swapStartIndex + i] = selectedItems[i];
    });
    console.log("Updated materials:", updatedMaterials);

    const updatedData = updatedMaterials.map(item => ({
      scheduleNo: item.scheduleNo,
      orderNo: item.orderNo,
      outMaterialNo: item.outMaterialNo,
      outThickness: item.outThickness,
      outWidth: item.outWidth,
      outGrade: item.outGrade,
      outCoilWeight: item.outCoilWeight,
      inMatNo: item.inMatNo,
      inThickness: item.inThickness,
      inWidth: item.inWidth,
      inGrade: item.inGrade,
      inactualWeight: item.inactualWeight,
      createdAt: item.createdAt,
    }));
    console.log("Data to insert:", updatedData);

    await prisma.scheduleConfirmation.deleteMany({
      where: { scheduleNo },
    });
    console.log("Deleted materials for:", scheduleNo);

    await prisma.scheduleConfirmation.createMany({
      data: updatedData,
    });
    console.log("Inserted new materials:", updatedData.length);

    return { success: true, data: updatedData };
  } catch (error) {
    console.error("Error swapping materials:", error);
    return { success: false, error: error.message };
  }
}
// Split schedule
export async function splitSchedule(scheduleNo, divisions) {
  try {
    if (!prisma) throw new Error("Prisma client is not initialized");

    const scheduleExists = await prisma.scheduleConfirmation.findFirst({
      where: { scheduleNo },
    });
    if (!scheduleExists) throw new Error("Schedule not found");

    const scheduleMaterials = await prisma.scheduleConfirmation.findMany({
      where: { scheduleNo },
      orderBy: { id: 'asc' },
    });

    const itemsPerDivision = Math.ceil(scheduleMaterials.length / divisions);
    const originalScheduleNo = scheduleNo;

    await prisma.scheduleConfirmation.deleteMany({
      where: { scheduleNo: originalScheduleNo },
    });

    const newSchedules = [];
    for (let i = 0; i < divisions; i++) {
      const startIndex = i * itemsPerDivision;
      const endIndex = Math.min((i + 1) * itemsPerDivision, scheduleMaterials.length);
      const subScheduleItems = scheduleMaterials.slice(startIndex, endIndex);

      const newScheduleNo = `${originalScheduleNo}-${(i + 1).toString().padStart(2, '0')}`;
      newSchedules.push({
        scheduleNo: newScheduleNo,
        items: subScheduleItems.map((item) => ({
          scheduleNo: newScheduleNo,
          orderNo: item.orderNo,
          outMaterialNo: item.outMaterialNo,
          outThickness: item.outThickness,
          outWidth: item.outWidth,
          outGrade: item.outGrade,
          outCoilWeight: item.outCoilWeight,
          inMatNo: item.inMatNo,
          inThickness: item.inThickness,
          inWidth: item.inWidth,
          inGrade: item.inGrade,
          inactualWeight: item.inactualWeight,
          createdAt: item.createdAt,
        })),
      });
    }

    for (const schedule of newSchedules) {
      await prisma.scheduleConfirmation.createMany({
        data: schedule.items,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error splitting schedule:", error);
    return { success: false, error: error.message };
  }
}

// Delete materials
export async function deleteMaterials(materialIds) {
  try {
    if (!prisma) throw new Error("Prisma client is not initialized");

    await prisma.scheduleConfirmation.deleteMany({
      where: {
        id: {
          in: materialIds.map(id => parseInt(id)),
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting materials:", error);
    return { success: false, error: error.message };
  }
}

// Update materials (placeholder)
export async function updateMaterials(materialData) {
  try {
    if (!prisma) throw new Error("Prisma client is not initialized");
    return { success: true, message: "Update functionality not implemented yet" };
  } catch (error) {
    console.error("Error updating materials:", error);
    return { success: false, error: error.message };
  }
}