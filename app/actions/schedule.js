// "use server";

// import { prisma } from "@/lib/prisma"; // Adjust path

// export async function saveScheduleConfirmation(scheduleNo, selectedData) {
//   try {
//     if (!prisma) {
//       throw new Error("Prisma client is not initialized");
//     }

//     const scheduleEntries = selectedData.map((item) => ({
//       scheduleNo,
//       orderNo: BigInt(item.orderNo),
//       outMaterialNo: item.outMaterialNo,
//       outThickness: item.outThickness || null,
//       outWidth: item.outWidth || null,
//       outGrade: item.outGrade || null,
//       outCoilWeight: item.outCoilWeight || null,
//       inMatNo: item.inMatNo,
//       inThickness: item.inThickness,
//       inWidth: item.inWidth,
//       inGrade: item.inGrade,
//       inactualWeight: item.inactualWeight,
//     }));

//     // First, check if records with this scheduleNo already exist
//     const existingRecords = await prisma.scheduleConfirmation.findMany({
//       where: { scheduleNo },
//     });

//     let result;
//     if (existingRecords.length > 0) {
//       // If records exist, update them or delete and recreate
//       await prisma.$transaction(async (tx) => {
//         // Delete existing records
//         await tx.scheduleConfirmation.deleteMany({
//           where: { scheduleNo },
//         });
        
//         // Create new records
//         result = await tx.scheduleConfirmation.createMany({
//           data: scheduleEntries,
//         });
//       });
//     } else {
//       // If no records exist, simply create them
//       result = await prisma.scheduleConfirmation.createMany({
//         data: scheduleEntries,
//       });
//     }

//     return { success: true, scheduleNo, count: result?.count };
//   } catch (error) {
//     console.error("Error saving schedule:", error);
//     return { 
//       success: false, 
//       error: error.message,
//       code: error.code // Include error code for better debugging
//     };
//   }
// }

// export async function getScheduleConfirmation(scheduleNo) {
//   try {
//     if (!prisma) {
//       throw new Error("Prisma client is not initialized");
//     }

//     const scheduleData = await prisma.scheduleConfirmation.findMany({
//       where: { scheduleNo },
//     });
    
//     return { success: true, data: scheduleData };
//   } catch (error) {
//     console.error("Error fetching schedule:", error);
//     return { success: false, error: error.message };
//   }
// }



// "use server";

// import { prisma } from "@/lib/prisma";
// import { parseISO, isValid } from "date-fns";

// export async function saveScheduleConfirmation(scheduleNo, selectedData) {
//   if (!prisma) return { success: false, error: "Prisma client is not initialized" };

//   try {
//     const scheduleEntries = selectedData.map((item) => ({
//       scheduleNo,
//       orderNo: BigInt(item.orderNo),
//       outMaterialNo: item.outMaterialNo,
//       outThickness: item.outThickness || null,
//       outWidth: item.outWidth || null,
//       outGrade: item.outGrade || null,
//       outCoilWeight: item.outCoilWeight || null,
//       inMatNo: item.inMatNo,
//       inThickness: item.inThickness,
//       inWidth: item.inWidth,
//       inGrade: item.inGrade,
//       inactualWeight: item.inactualWeight,
//     }));

//     await prisma.scheduleConfirmation.createMany({ data: scheduleEntries });

//     await prisma.scheduleMaker.deleteMany({
//       where: {
//         OR: selectedData.map((item) => ({
//           orderNo: BigInt(item.orderNo),
//           inMaterialName: item.inMatNo,
//         })),
//       },
//     });

//     return { success: true, scheduleNo };
//   } catch (error) {
//     console.error("Error saving schedule:", error);
//     return { success: false, error: error.message };
//   }
// }

// export async function getScheduleConfirmation(scheduleNo) {
//   if (!prisma) return { success: false, error: "Prisma client is not initialized" };

//   try {
//     const scheduleData = await prisma.scheduleConfirmation.findMany({ where: { scheduleNo } });
//     return { success: true, data: scheduleData };
//   } catch (error) {
//     console.error("Error fetching schedule:", error);
//     return { success: false, error: error.message };
//   }
// }

// export async function getScheduleMakerItems() {
//   if (!prisma) return { success: false, error: "Prisma client is not initialized" };

//   try {
//     const items = await prisma.scheduleMaker.findMany();
//     console.log("Fetched ScheduleMaker items from DB:", items);
//     return { success: true, data: items };
//   } catch (error) {
//     console.error("Error fetching ScheduleMaker items:", error);
//     return { success: false, error: error.message };
//   }
// }

// export async function addToScheduleMaker(orderNo, selectedItems) {
//   if (!prisma) return { success: false, error: "Prisma client is not initialized" };

//   try {
//     console.log(`Adding to ScheduleMaker for Order ${orderNo}:`, selectedItems);

//     const entries = selectedItems.map((item) => ({
//       orderNo: BigInt(orderNo),
//       inMaterialName: item.IN_MaterialName,
//       inThickness: item.IN_Thickness,
//       inWidth: item.IN_Width,
//       inGrade: item.IN_Grade,
//       inactualWeight: item.ActuallWeight,
//       orderThickness: item.orderThickness || null,
//       orderWidth: item.orderWidth || null,
//       grade: item.grade || null,
//       weight: item.weight || null,
//       In_ProductionDate: item.In_ProductionDate && isValid(parseISO(item.In_ProductionDate)) ? new Date(item.In_ProductionDate) : null,
//       YardArrivalDate: item.YardArrivalDate && isValid(parseISO(item.YardArrivalDate)) ? new Date(item.YardArrivalDate) : null,
//       Residence_INYard: item.Residence_INYard || null,
//       YardNO: item.YardNO || null,
//       Position: item.Position || null,
//       Manufacturing_Location: item.Manufacturing_Location || null,
//       Manufacturer: item.Manufacturer || null,
//     }));

//     await prisma.scheduleMaker.createMany({ data: entries, skipDuplicates: true });

//     console.log(`Successfully added ${entries.length} items to ScheduleMaker for Order ${orderNo}`);
//     return { success: true };
//   } catch (error) {
//     console.error("Error adding to ScheduleMaker:", error);
//     return { success: false, error: error.message };
//   }
// }





// ----------------------------------------------------------------

// "use server";

// import { prisma } from "@/lib/prisma";
// import { parseISO, isValid } from "date-fns";

// // Function to get the next available schedule number
// export async function getNextScheduleNumber() {
//   if (!prisma) return { success: false, error: "Prisma client is not initialized" };

//   try {
//     // Find the highest schedule number in the database
//     const highestSchedule = await prisma.scheduleConfirmation.findFirst({
//       orderBy: { scheduleNo: 'desc' },
//       select: { scheduleNo: true },
//     });

//     let nextScheduleNo = "SCH001";
//     if (highestSchedule) {
//       // Extract the numeric part of the schedule number and increment it
//       const currentNumber = parseInt(highestSchedule.scheduleNo.replace("SCH", ""), 10);
//       const nextNumber = currentNumber + 1;
//       nextScheduleNo = `SCH${nextNumber.toString().padStart(3, "0")}`;
//     }

//     return { success: true, nextScheduleNo };
//   } catch (error) {
//     console.error("Error getting next schedule number:", error);
//     return { success: false, error: error.message };
//   }
// }

// export async function saveScheduleConfirmation(scheduleNo, selectedData) {
//   if (!prisma) return { success: false, error: "Prisma client is not initialized" };

//   try {
//     // Data validation
//     if (!scheduleNo || !selectedData || selectedData.length === 0) {
//       return { 
//         success: false, 
//         error: "Invalid data: Schedule number or selected data is missing" 
//       };
//     }

//     // Prepare data for database
//     const scheduleEntries = selectedData.map((item) => ({
//       scheduleNo,
//       orderNo: typeof item.orderNo === 'bigint' ? item.orderNo : BigInt(item.orderNo),
//       outMaterialNo: item.outMaterialNo,
//       outThickness: item.outThickness || null,
//       outWidth: item.outWidth || null,
//       outGrade: item.outGrade || null,
//       outCoilWeight: item.outCoilWeight || null,
//       inMatNo: item.inMatNo,
//       inThickness: item.inThickness,
//       inWidth: item.inWidth,
//       inGrade: item.inGrade,
//       inactualWeight: item.inactualWeight,
//     }));

//     // Begin transaction
//     const result = await prisma.$transaction(async (tx) => {
//       // Delete any existing entries with this schedule number (for updates)
//       await tx.scheduleConfirmation.deleteMany({
//         where: { scheduleNo }
//       });

//       // Create the new entries
//       await tx.scheduleConfirmation.createMany({ 
//         data: scheduleEntries 
//       });

//       // Remove items from the schedule maker pool
//       await tx.scheduleMaker.deleteMany({
//         where: {
//           OR: selectedData.map((item) => ({
//             orderNo: typeof item.orderNo === 'bigint' ? item.orderNo : BigInt(item.orderNo),
//             inMaterialName: item.inMatNo,
//           })),
//         },
//       });

//       // Get the next schedule number for the next operation
//       const highestSchedule = await tx.scheduleConfirmation.findFirst({
//         orderBy: { scheduleNo: 'desc' },
//         select: { scheduleNo: true },
//       });

//       let nextScheduleNo = "SCH001";
//       if (highestSchedule) {
//         const currentNumber = parseInt(highestSchedule.scheduleNo.replace("SCH", ""), 10);
//         const nextNumber = currentNumber + 1;
//         nextScheduleNo = `SCH${nextNumber.toString().padStart(3, "0")}`;
//       }

//       return { nextScheduleNo };
//     });

//     console.log(`Successfully saved schedule ${scheduleNo}. Next schedule: ${result.nextScheduleNo}`);
//     return { 
//       success: true, 
//       scheduleNo, 
//       nextScheduleNo: result.nextScheduleNo 
//     };
//   } catch (error) {
//     console.error("Error saving schedule:", error);
//     return { success: false, error: error.message };
//   }
// }

// export async function getScheduleConfirmation(scheduleNo) {
//   if (!prisma) return { success: false, error: "Prisma client is not initialized" };

//   try {
//     // Validate input
//     if (!scheduleNo) {
//       return { success: false, error: "Schedule number is required" };
//     }

//     // Query the database
//     const scheduleData = await prisma.scheduleConfirmation.findMany({ 
//       where: { scheduleNo } 
//     });
    
//     return { success: true, data: scheduleData };
//   } catch (error) {
//     console.error("Error fetching schedule:", error);
//     return { success: false, error: error.message };
//   }
// }

// export async function getScheduleMakerItems() {
//   if (!prisma) return { success: false, error: "Prisma client is not initialized" };

//   try {
//     const items = await prisma.scheduleMaker.findMany();
//     console.log("Fetched ScheduleMaker items from DB:", items);
//     return { success: true, data: items };
//   } catch (error) {
//     console.error("Error fetching ScheduleMaker items:", error);
//     return { success: false, error: error.message };
//   }
// }

// export async function addToScheduleMaker(orderNo, selectedItems) {
//   if (!prisma) return { success: false, error: "Prisma client is not initialized" };

//   try {
//     console.log(`Adding to ScheduleMaker for Order ${orderNo}:`, selectedItems);

//     const entries = selectedItems.map((item) => ({
//       orderNo: BigInt(orderNo),
//       inMaterialName: item.IN_MaterialName,
//       inThickness: item.IN_Thickness,
//       inWidth: item.IN_Width,
//       inGrade: item.IN_Grade,
//       inactualWeight: item.ActuallWeight,
//       orderThickness: item.orderThickness || null,
//       orderWidth: item.orderWidth || null,
//       grade: item.grade || null,
//       weight: item.weight || null,
//       In_ProductionDate: item.In_ProductionDate && isValid(parseISO(item.In_ProductionDate)) ? new Date(item.In_ProductionDate) : null,
//       YardArrivalDate: item.YardArrivalDate && isValid(parseISO(item.YardArrivalDate)) ? new Date(item.YardArrivalDate) : null,
//       Residence_INYard: item.Residence_INYard || null,
//       YardNO: item.YardNO || null,
//       Position: item.Position || null,
//       Manufacturing_Location: item.Manufacturing_Location || null,
//       Manufacturer: item.Manufacturer || null,
//     }));

//     await prisma.scheduleMaker.createMany({ data: entries, skipDuplicates: true });

//     console.log(`Successfully added ${entries.length} items to ScheduleMaker for Order ${orderNo}`);
//     return { success: true };
//   } catch (error) {
//     console.error("Error adding to ScheduleMaker:", error);
//     return { success: false, error: error.message };
//   }
// }

"use server";

import { prisma } from "@/lib/prisma";
import { parseISO, isValid } from "date-fns";

export async function getNextScheduleNumber() {
  try {
    if (!prisma) throw new Error("Prisma client is not initialized");

    // Get the current counter without incrementing it
    const counter = await prisma.scheduleCounter.findFirst();
    
    let nextCount = 1;
    if (counter) {
      nextCount = counter.count + 1;
    }
    
    // Return the next schedule number without updating the counter
    return { 
      success: true, 
      data: `SCH${String(nextCount).padStart(3, "0")}` 
    };
  } catch (error) {
    console.error("Error getting next schedule number:", error);
    return { success: false, error: error.message };
  }
}

// Add a new function to increment the counter only when a schedule is finalized
export async function incrementScheduleCounter() {
  try {
    if (!prisma) throw new Error("Prisma client is not initialized");

    const counter = await prisma.scheduleCounter.findFirst();
    
    if (counter) {
      await prisma.scheduleCounter.update({
        where: { id: counter.id },
        data: { count: counter.count + 1 },
      });
    } else {
      await prisma.scheduleCounter.create({
        data: { count: 1 },
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error incrementing schedule counter:", error);
    return { success: false, error: error.message };
  }
}

// Update the saveScheduleConfirmation function
export async function saveScheduleConfirmation(scheduleNo, selectedData) {
  if (!prisma) return { success: false, error: "Prisma client is not initialized" };

  try {
    // Check if this schedule already exists
    const existingSchedule = await prisma.scheduleConfirmation.findFirst({
      where: { scheduleNo }
    });

    // If it exists, don't allow re-saving
    if (existingSchedule) {
      return { 
        success: false, 
        error: `Schedule ${scheduleNo} already exists. Please use a new schedule number.` 
      };
    }
    
    const scheduleEntries = selectedData.map((item) => ({
      scheduleNo,
      orderNo: BigInt(item.orderNo),
      outMaterialNo: item.outMaterialNo,
      outThickness: item.outThickness || null,
      outWidth: item.outWidth || null,
      outGrade: item.outGrade || null,
      outCoilWeight: item.outCoilWeight || null,
      inMatNo: item.inMatNo,
      inThickness: item.inThickness,
      inWidth: item.inWidth,
      inGrade: item.inGrade,
      inactualWeight: item.inactualWeight,
    }));

    await prisma.scheduleConfirmation.createMany({ data: scheduleEntries });

    // Remove items from scheduleMaker after they've been added to a schedule
    await prisma.scheduleMaker.deleteMany({
      where: {
        OR: selectedData.map((item) => ({
          orderNo: BigInt(item.orderNo),
          inMaterialName: item.inMatNo,
        })),
      },
    });
    
    // Increment the counter only after successfully saving the schedule
    await incrementScheduleCounter();

    return { success: true, scheduleNo };
  } catch (error) {
    console.error("Error saving schedule:", error);
    return { success: false, error: error.message };
  }
}

export async function getScheduleConfirmation(scheduleNo) {
  if (!prisma) return { success: false, error: "Prisma client is not initialized" };

  try {
    const scheduleData = await prisma.scheduleConfirmation.findMany({ 
      where: { scheduleNo },
      orderBy: { id: 'asc' }
    });
    
    return { success: true, data: scheduleData };
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return { success: false, error: error.message };
  }
}

export async function getScheduleMakerItems() {
  if (!prisma) return { success: false, error: "Prisma client is not initialized" };

  try {
    const items = await prisma.scheduleMaker.findMany();
    return { success: true, data: items };
  } catch (error) {
    console.error("Error fetching ScheduleMaker items:", error);
    return { success: false, error: error.message };
  }
}

export async function addToScheduleMaker(orderNo, selectedItems) {
  if (!prisma) return { success: false, error: "Prisma client is not initialized" };

  try {
    console.log(`Adding to ScheduleMaker for Order ${orderNo}:`, selectedItems);

    const entries = selectedItems.map((item) => ({
      orderNo: BigInt(orderNo),
      inMaterialName: item.IN_MaterialName,
      inThickness: item.IN_Thickness,
      inWidth: item.IN_Width,
      inGrade: item.IN_Grade,
      inactualWeight: item.ActuallWeight,
      orderThickness: item.orderThickness || null,
      orderWidth: item.orderWidth || null,
      grade: item.grade || null,
      weight: item.weight || null,
      In_ProductionDate: item.In_ProductionDate && isValid(parseISO(item.In_ProductionDate)) ? new Date(item.In_ProductionDate) : null,
      YardArrivalDate: item.YardArrivalDate && isValid(parseISO(item.YardArrivalDate)) ? new Date(item.YardArrivalDate) : null,
      Residence_INYard: item.Residence_INYard || null,
      YardNO: item.YardNO || null,
      Position: item.Position || null,
      Manufacturing_Location: item.Manufacturing_Location || null,
      Manufacturer: item.Manufacturer || null,
    }));

    await prisma.scheduleMaker.createMany({ data: entries, skipDuplicates: true });

    console.log(`Successfully added ${entries.length} items to ScheduleMaker for Order ${orderNo}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding to ScheduleMaker:", error);
    return { success: false, error: error.message };
  }
}
