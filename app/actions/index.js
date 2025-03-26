"use server";

import { prisma } from "@/lib/prisma"; // Adjust based on your Prisma setup

// Fetch orders by leastProductionDate
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

    return orders.map(order => ({
      ...order,
      orderDeliveryDate: order.orderDeliveryDate.toISOString().split('T')[0],
      leastProductionDate: order.leastProductionDate?.toISOString().split('T')[0],
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

// Fetch matching inventory for an order
export async function getMatchingInventory(order) {
  try {
    const inventory = await prisma.inventory.findMany({
      where: {
        IN_Grade: order.grade,
        IN_Thickness: order.orderThickness,
        IN_Width: order.orderWidth,
      },
      select: {
        IN_MaterialName: true,
        IN_Thickness: true,
        IN_Width: true,
        IN_Weight: true,
        IN_Grade: true,
        In_ProductionDate: true,
        YardArrivalDate: true,
        Residence_INYard: true,
        YardNO: true,
        Position: true,
        Manufacturing_Location: true,
        Manufacturer: true,
      },
    });

    return inventory.map(item => ({
      ...item,
      In_ProductionDate: item.In_ProductionDate.toISOString().split('T')[0],
      YardArrivalDate: item.YardArrivalDate.toISOString().split('T')[0],
    }));
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
}