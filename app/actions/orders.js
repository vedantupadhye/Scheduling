// "use server";

// // import { prisma } from "@/lib/prisma"; // Ensure prisma client is configured
// import { prisma } from "@/lib/prisma";

// export async function getOrders() {
//   const orders = await prisma.order.findMany(); // ✅ Fetch from DB
//   console.log("Orders from DB:", orders); // 🛠 Debugging before sending response
//   return orders;
// }

// // Add a new order
// export async function addOrder(order) {
//   try {
//     if (!order.producedQuantityWeight) {
//       throw new Error("producedQuantityWeight is required");
//     }
//     return await prisma.order.create({
//       data: order,
//     });
//   } catch (error) {
//     console.error("Prisma Error:", error);
//     throw new Error("Failed to insert order");
//   }
// }

// // Update an existing order
// export async function updateOrder(id, updatedData) {
//   return await prisma.order.update({
//     where: { id },
//     data: updatedData,
//   });
// }

// // Delete an order
// export async function deleteOrder(id) {
//   return await prisma.order.delete({
//     where: { id },
//   });
// }

"use server";
import { prisma } from "@/lib/prisma";

// Get all orders
export async function getOrders() {
  try {
    const orders = await prisma.order.findMany();
    
    // Convert BigInt to string to avoid JSON serialization issues
    return orders.map(order => ({
      ...order,
      orderNo: order.orderNo.toString(),
      // Format dates properly for frontend
      orderDeliveryDate: order.orderDeliveryDate.toISOString(),
      createdAt: order.createdAt.toISOString(),
      leastProductionDate: order.leastProductionDate ? order.leastProductionDate.toISOString() : null,
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}

// Add a new order
export async function addOrder(orderData) {
  try {
    // Ensure orderNo is treated as BigInt
    const order = await prisma.order.create({
      data: orderData,
    });
    
    // Convert BigInt to string for frontend
    return {
      ...order,
      orderNo: order.orderNo.toString(),
      orderDeliveryDate: order.orderDeliveryDate.toISOString(),
      createdAt: order.createdAt.toISOString(),
      leastProductionDate: order.leastProductionDate ? order.leastProductionDate.toISOString() : null,
    };
  } catch (error) {
    console.error("Prisma Error:", error);
    throw new Error("Failed to insert order");
  }
}

// Update an existing order
export async function updateOrder(id, updatedData) {
  try {
    // Convert string id to BigInt
    const orderId = BigInt(id);
    
    const result = await prisma.order.update({
      where: { orderNo: orderId },
      data: updatedData,
    });
    
    return {
      ...result,
      orderNo: result.orderNo.toString(),
      orderDeliveryDate: result.orderDeliveryDate.toISOString(),
      createdAt: result.createdAt.toISOString(),
      leastProductionDate: result.leastProductionDate ? result.leastProductionDate.toISOString() : null,
    };
  } catch (error) {
    console.error("Update Error:", error);
    throw new Error("Failed to update order");
  }
}

// Delete an order
export async function deleteOrder(id) {
  try {
    // Convert string id to BigInt
    const orderId = BigInt(id);
    
    return await prisma.order.delete({
      where: { orderNo: orderId },
    });
  } catch (error) {
    console.error("Delete Error:", error);
    throw new Error("Failed to delete order");
  }
}