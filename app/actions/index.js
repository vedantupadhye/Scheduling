// "use server";

// import { prisma } from "@/lib/prisma"; // Adjust based on your Prisma setup

// // Fetch orders by leastProductionDate
// export async function getOrdersByDate(date) {
//   try {
//     const startOfDay = new Date(date);
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date(date);
//     endOfDay.setHours(23, 59, 59, 999);

//     const orders = await prisma.order.findMany({
//       where: {
//         leastProductionDate: {
//           gte: startOfDay,
//           lte: endOfDay,
//         },
//       },
//       select: {
//         orderNo: true,
//         weight: true,
//         quantity: true,
//         orderDeliveryDate: true,
//         grade: true,
//         orderThickness: true,
//         orderWidth: true,
//         deliveryPlace: true,
//         customerName: true,
//         leastProductionDate: true,
//       },
//     });

//     return orders.map(order => ({
//       ...order,
//       orderDeliveryDate: order.orderDeliveryDate.toISOString().split('T')[0],
//       leastProductionDate: order.leastProductionDate?.toISOString().split('T')[0],
//     }));
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     return [];
//   }
// }

// // Fetch matching inventory for an order
// export async function getMatchingInventory(order) {
//   try {
//     const inventory = await prisma.inventory.findMany({
//       where: {
//         IN_Grade: order.grade,
//         IN_Thickness: order.orderThickness,
//         IN_Width: order.orderWidth,
//       },
//       select: {
//         IN_MaterialName: true,
//         IN_Thickness: true,
//         IN_Width: true,
//         IN_Weight: true,
//         IN_Grade: true,
//         In_ProductionDate: true,
//         YardArrivalDate: true,
//         Residence_INYard: true,
//         YardNO: true,
//         Position: true,
//         Manufacturing_Location: true,
//         Manufacturer: true,
//       },
//     });

//     return inventory.map(item => ({
//       ...item,
//       In_ProductionDate: item.In_ProductionDate.toISOString().split('T')[0],
//       YardArrivalDate: item.YardArrivalDate.toISOString().split('T')[0],
//     }));
//   } catch (error) {
//     console.error("Error fetching inventory:", error);
//     return [];
//   }
// }


// "use server";

// import { prisma } from "@/lib/prisma";

// // Fetch orders by leastProductionDate (unchanged)
// export async function getOrdersByDate(date) {
//   try {
//     const startOfDay = new Date(date);
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date(date);
//     endOfDay.setHours(23, 59, 59, 999);

//     const orders = await prisma.order.findMany({
//       where: {
//         leastProductionDate: {
//           gte: startOfDay,
//           lte: endOfDay,
//         },
//       },
//       select: {
//         orderNo: true,
//         weight: true,
//         quantity: true,
//         orderDeliveryDate: true,
//         grade: true,
//         orderThickness: true,
//         orderWidth: true,
//         deliveryPlace: true,
//         customerName: true,
//         leastProductionDate: true,
//         orderStatus: true,
//       },
//     });

//     return orders.map(order => ({
//       ...order,
//       orderDeliveryDate: order.orderDeliveryDate.toISOString().split('T')[0],
//       leastProductionDate: order.leastProductionDate?.toISOString().split('T')[0],
//     }));
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     return [];
//   }
// }

// // Fetch active material allocation rules
// export async function getMaterialAllocationRules() {
//   try {
//     const rules = await prisma.materialAllocationRules.findMany({
//       where: { status: "Active" },
//     });
//     return rules;
//   } catch (error) {
//     console.error("Error fetching material allocation rules:", error);
//     throw error; // Throw to catch in frontend
//   }
// }

// // Upsert a material allocation rule
// export async function upsertMaterialAllocationRule({ id, orderParameter, logic, parameter, materialParameter, status }) {
//   try {
//     if (id) {
//       await prisma.materialAllocationRules.update({
//         where: { id },
//         data: { orderParameter, logic, parameter, materialParameter, status },
//       });
//     } else {
//       await prisma.materialAllocationRules.create({
//         data: { orderParameter, logic, parameter, materialParameter, status },
//       });
//     }
//   } catch (error) {
//     console.error("Error upserting material allocation rule:", error);
//     throw error; // Throw to catch in frontend
//   }
// }

// // Delete a material allocation rule (soft delete by setting status to Inactive)
// export async function deleteMaterialAllocationRule(id) {
//   try {
//     await prisma.materialAllocationRules.update({
//       where: { id },
//       data: { status: "Inactive" },
//     });
//   } catch (error) {
//     console.error("Error deleting material allocation rule:", error);
//     throw error;
//   }
// }

// // Fetch matching inventory based on rules (unchanged)
// export async function getMatchingInventory(order) {
//   try {
//     const inventory = await prisma.inventory.findMany();
//     const rules = await getMaterialAllocationRules();

//     const matches = inventory.filter(item => {
//       return rules.every(rule => {
//         const orderValue = rule.orderParameter === "Order Thickness" ? order.orderThickness :
//                           rule.orderParameter === "Order Width" ? order.orderWidth :
//                           order.grade;
//         const materialValue = rule.materialParameter === "IN_Thickness" ? item.IN_Thickness :
//                               rule.materialParameter === "IN_Width" ? item.IN_Width :
//                               item.IN_Grade;

//         if (orderValue === null || materialValue === null) return false;

//         switch (rule.logic) {
//           case "Less Than":
//             return orderValue < materialValue + rule.parameter;
//           case "Less Than Equal To":
//             return orderValue <= materialValue + rule.parameter;
//           case "Equal To":
//             return orderValue === materialValue;
//           case "More Than":
//             return orderValue > materialValue - rule.parameter;
//           case "More Than Equal To":
//             return orderValue >= materialValue - rule.parameter;
//           default:
//             return false;
//         }
//       });
//     });

//     return matches.map(item => ({
//       ...item,
//       In_ProductionDate: item.In_ProductionDate.toISOString().split('T')[0],
//       YardArrivalDate: item.YardArrivalDate.toISOString().split('T')[0],
//     }));
//   } catch (error) {
//     console.error("Error fetching inventory:", error);
//     return [];
//   }
// }



// "use server";

// import { prisma } from "@/lib/prisma";

// export async function getOrdersByDate(date) {
//   try {
//     const startOfDay = new Date(date);
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date(date);
//     endOfDay.setHours(23, 59, 59, 999);

//     const orders = await prisma.order.findMany({
//       where: {
//         leastProductionDate: {
//           gte: startOfDay,
//           lte: endOfDay,
//         },
//       },
//       select: {
//         orderNo: true,
//         weight: true,
//         quantity: true,
//         orderDeliveryDate: true,
//         grade: true,
//         thickness: true,
//         width: true,
//         deliveryPlace: true,
//         customerName: true,
//         leastProductionDate: true,
//       },
//     });

//     return orders.map(order => ({
//       ...order,
//       orderDeliveryDate: order.orderDeliveryDate.toISOString().split('T')[0],
//       leastProductionDate: order.leastProductionDate?.toISOString().split('T')[0],
//       orderThickness: order.thickness,
//       orderWidth: order.width,
//     }));
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     throw error;
//   }
// }

// export async function getMaterialAllocationRules() {
//   try {
//     const rules = await prisma.materialAllocationRules.findMany({
//       where: { status: "Active" },
//     });
//     console.log("Fetched rules:", rules);
//     return rules;
//   } catch (error) {
//     console.error("Error fetching material allocation rules:", error);
//     throw error;
//   }
// }

// export async function upsertMaterialAllocationRule({ id, orderParameter, logic, parameter, materialParameter, status }) {
//   try {
//     if (id) {
//       await prisma.materialAllocationRules.update({
//         where: { id },
//         data: { orderParameter, logic, parameter, materialParameter, status },
//       });
//     } else {
//       await prisma.materialAllocationRules.create({
//         data: { orderParameter, logic, parameter, materialParameter, status },
//       });
//     }
//   } catch (error) {
//     console.error("Error upserting material allocation rule:", error);
//     throw error;
//   }
// }

// export async function deleteMaterialAllocationRule(id) {
//   try {
//     await prisma.materialAllocationRules.update({
//       where: { id },
//       data: { status: "Inactive" },
//     });
//   } catch (error) {
//     console.error("Error deleting material allocation rule:", error);
//     throw error;
//   }
// }

// export async function getMatchingInventory(order) {
//   try {
//     const inventory = await prisma.inventory.findMany();
//     let rules = await getMaterialAllocationRules();

//     console.log("Order values:", { thickness: order.thickness, width: order.width, grade: order.grade });
//     console.log("Inventory items:", inventory);

//     const hasThicknessRule = rules.some(r => r.orderParameter === "Order Thickness");
//     const hasWidthRule = rules.some(r => r.orderParameter === "Order Width");
//     const hasGradeRule = rules.some(r => r.orderParameter === "Grade");

//     if (!hasThicknessRule) {
//       rules.push({ orderParameter: "Order Thickness", logic: "Equal To", parameter: 0, materialParameter: "IN_Thickness", status: "Active" });
//     }
//     if (!hasWidthRule) {
//       rules.push({ orderParameter: "Order Width", logic: "Equal To", parameter: 0, materialParameter: "IN_Width", status: "Active" });
//     }
//     if (!hasGradeRule) {
//       rules.push({ orderParameter: "Grade", logic: "Equal To", parameter: 0, materialParameter: "IN_Grade", status: "Active" });
//     }

//     console.log("Applied rules:", rules);

//     const matches = inventory.filter(item => {
//       return rules.every(rule => {
//         let orderValue, materialValue;

//         if (rule.orderParameter === "Order Thickness") {
//           orderValue = Number(order.thickness);
//           materialValue = Number(item.IN_Thickness);
//         } else if (rule.orderParameter === "Order Width") {
//           orderValue = Number(order.width);
//           materialValue = Number(item.IN_Width);
//         } else if (rule.orderParameter === "Grade") {
//           orderValue = order.grade ? order.grade.trim() : "";
//           materialValue = item.IN_Grade ? item.IN_Grade.trim() : "";
//         }

//         if (orderValue === null || materialValue === null) {
//           console.log(`Null values for ${rule.orderParameter}: order=${orderValue}, material=${materialValue}`);
//           return false;
//         }

//         // For numeric fields (Thickness, Width), check NaN
//         if (rule.orderParameter !== "Grade" && (isNaN(orderValue) || isNaN(materialValue))) {
//           console.log(`Invalid numeric values for ${rule.orderParameter}: order=${orderValue}, material=${materialValue}`);
//           return false;
//         }

//         const isNumeric = rule.orderParameter !== "Grade";
//         const difference = isNumeric ? materialValue - orderValue : 0;
//         console.log(`${rule.orderParameter}: order=${orderValue}, material=${materialValue}, diff=${difference}, logic=${rule.logic}, param=${rule.parameter}`);

//         switch (rule.logic.toLowerCase()) {
//           case "less than":
//             return difference < rule.parameter && difference >= 0;
//           case "less than equal to":
//             return difference <= rule.parameter && difference >= 0;
//           case "equal to":
//             return isNumeric ? difference === 0 : orderValue === materialValue;
//           case "more than":
//             return difference > -rule.parameter && difference <= 0;
//           case "more than equal to":
//             return difference >= -rule.parameter && difference <= 0;
//           default:
//             console.log(`Unknown logic: ${rule.logic}`);
//             return false;
//         }
//       });
//     });

//     console.log("Matched inventory:", matches);
//     return matches.map(item => ({
//       ...item,
//       In_ProductionDate: item.In_ProductionDate.toISOString().split('T')[0],
//       YardArrivalDate: item.YardArrivalDate.toISOString().split('T')[0],
//     }));
//   } catch (error) {
//     console.error("Error fetching inventory:", error);
//     throw error;
//   }
// }

"use server";

import { prisma } from "@/lib/prisma";

// export async function getOrdersByDate(date) {
//   try {
//     const startOfDay = new Date(date);
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date(date);
//     endOfDay.setHours(23, 59, 59, 999);

//     const orders = await prisma.order.findMany({
//       where: {
//         leastProductionDate: {
//           gte: startOfDay,
//           lte: endOfDay,
//         },
//       },
//       select: {
//         orderNo: true,
//         weight: true,
//         quantity: true,
//         orderDeliveryDate: true,
//         grade: true,
//         orderThickness: true, // Fetch directly
//         orderWidth: true,     // Fetch directly
//         deliveryPlace: true,
//         customerName: true,
//         leastProductionDate: true,
//       },
//     });

//     return orders.map(order => ({
//       ...order,
//       orderDeliveryDate: order.orderDeliveryDate.toISOString().split("T")[0],
//       leastProductionDate: order.leastProductionDate?.toISOString().split("T")[0],
//     }));
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     throw error;
//   }
// }

export async function getOrdersByDate(date) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await prisma.order.findMany({
      where: {
        leastProductionDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        orderNo: true,
        weight: true,
        quantity: true,
        orderDeliveryDate: true,
        grade: true,
        orderThickness: true,
        orderWidth: true,
        deliveryPlace: true,
        customerName: true,
        leastProductionDate: true,
      },
    });

    console.log("Orders fetched from DB:", orders); // Add this log
    return orders.map((order) => ({
      ...order,
      orderDeliveryDate: order.orderDeliveryDate.toISOString().split("T")[0],
      leastProductionDate: order.leastProductionDate?.toISOString().split("T")[0],
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

export async function getMaterialAllocationRules() {
  try {
    const rules = await prisma.materialAllocationRules.findMany({
      where: { status: "Active" },
    });
    console.log("Fetched rules:", rules);
    return rules;
  } catch (error) {
    console.error("Error fetching material allocation rules:", error);
    throw error;
  }
}

export async function upsertMaterialAllocationRule({ id, orderParameter, logic, parameter, materialParameter, status }) {
  try {
    if (id) {
      await prisma.materialAllocationRules.update({
        where: { id },
        data: { orderParameter, logic, parameter, materialParameter, status },
      });
    } else {
      await prisma.materialAllocationRules.create({
        data: { orderParameter, logic, parameter, materialParameter, status },
      });
    }
  } catch (error) {
    console.error("Error upserting material allocation rule:", error);
    throw error;
  }
}

export async function deleteMaterialAllocationRule(id) {
  try {
    await prisma.materialAllocationRules.update({
      where: { id },
      data: { status: "Inactive" },
    });
  } catch (error) {
    console.error("Error deleting material allocation rule:", error);
    throw error;
  }
}

export async function getMatchingInventory(order) {
  try {
    const inventory = await prisma.inventory.findMany();
    let rules = await getMaterialAllocationRules();

    console.log("Order values:", { orderThickness: order.orderThickness, orderWidth: order.orderWidth, grade: order.grade });
    console.log("Inventory items:", inventory);

    const hasThicknessRule = rules.some(r => r.orderParameter === "Order Thickness");
    const hasWidthRule = rules.some(r => r.orderParameter === "Order Width");
    const hasGradeRule = rules.some(r => r.orderParameter === "Grade");

    if (!hasThicknessRule) {
      rules.push({ orderParameter: "Order Thickness", logic: "Equal To", parameter: 0, materialParameter: "IN_Thickness", status: "Active" });
    }
    if (!hasWidthRule) {
      rules.push({ orderParameter: "Order Width", logic: "Equal To", parameter: 0, materialParameter: "IN_Width", status: "Active" });
    }
    if (!hasGradeRule) {
      rules.push({ orderParameter: "Grade", logic: "Equal To", parameter: 0, materialParameter: "IN_Grade", status: "Active" });
    }

    console.log("Applied rules:", rules);

    const matches = inventory.filter(item => {
      return rules.every(rule => {
        let orderValue, materialValue;

        if (rule.orderParameter === "Order Thickness") {
          orderValue = Number(order.orderThickness);
          materialValue = Number(item.IN_Thickness);
        } else if (rule.orderParameter === "Order Width") {
          orderValue = Number(order.orderWidth);
          materialValue = Number(item.IN_Width);
        } else if (rule.orderParameter === "Grade") {
          orderValue = order.grade ? order.grade.trim() : "";
          materialValue = item.IN_Grade ? item.IN_Grade.trim() : "";
        }

        if (orderValue === null || materialValue === null) {
          console.log(`Null values for ${rule.orderParameter}: order=${orderValue}, material=${materialValue}`);
          return false;
        }

        if (rule.orderParameter !== "Grade" && (isNaN(orderValue) || isNaN(materialValue))) {
          console.log(`Invalid numeric values for ${rule.orderParameter}: order=${orderValue}, material=${materialValue}`);
          return false;
        }

        const isNumeric = rule.orderParameter !== "Grade";
        const difference = isNumeric ? materialValue - orderValue : 0;
        console.log(`${rule.orderParameter}: order=${orderValue}, material=${materialValue}, diff=${difference}, logic=${rule.logic}, param=${rule.parameter}`);

        switch (rule.logic.toLowerCase()) {
          case "less than":
            return difference < rule.parameter && difference >= 0;
          case "less than equal to":
            return difference <= rule.parameter && difference >= 0;
          case "equal to":
            return isNumeric ? difference === 0 : orderValue === materialValue;
          case "more than":
            return difference > -rule.parameter && difference <= 0;
          case "more than equal to":
            return difference >= -rule.parameter && difference <= 0;
          default:
            console.log(`Unknown logic: ${rule.logic}`);
            return false;
        }
      });
    });

    console.log("Matched inventory:", matches);
    return matches.map(item => ({
      ...item,
      In_ProductionDate: item.In_ProductionDate.toISOString().split("T")[0],
      YardArrivalDate: item.YardArrivalDate.toISOString().split("T")[0],
    }));
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
}

export async function createSchedule(scheduleData) {
  try {
    const schedule = await prisma.schedule.create({
      data: {
        scheduleNo: scheduleData.scheduleNo,
        items: {
          create: Object.entries(scheduleData.selectedData).flatMap(([orderNo, { order, items }]) =>
            items.map((item, index) => ({
              outMaterialNo: `NA${String(index + 1).padStart(5, "0")}`,
              outThickness: order.orderThickness,
              outWidth: order.orderWidth,
              outGrade: order.grade,
              outCoilWeight: order.weight,
              outActualWeight: order.weight,
              inMaterialNo: item.IN_MaterialName,
              inThickness: item.IN_Thickness,
              inWidth: item.IN_Width,
              inGrade: item.IN_Grade,
              inActualWeight: item.IN_Weight,
            }))
          ),
        },
      },
    });
    return schedule;
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw error;
  }
}