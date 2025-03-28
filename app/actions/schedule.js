"use server";

import { prisma } from "@/lib/prisma"; // Adjust path to your Prisma client

export async function saveScheduleConfirmation(scheduleNo, selectedData) {
  try {
    const scheduleEntries = selectedData.map((item) => ({
      scheduleNo,
      orderNo: BigInt(item.orderNo), // Convert to BigInt for Prisma
      outMaterialNo: item.outMaterialNo,
      outThickness: item.outThickness || null,
      outWidth: item.outWidth || null,
      outGrade: item.outGrade || null,
      outCoilWeight: item.outCoilWeight || null,
      inMatNo: item.inMatNo,
      inThickness: item.inThickness,
      inWidth: item.inWidth,
      inGrade: item.inGrade,
      actualWeight: item.actualWeight,
    }));

    await prisma.scheduleConfirmation.createMany({
      data: scheduleEntries,
    });

    return { success: true, scheduleNo };
  } catch (error) {
    console.error("Error saving schedule:", error);
    return { success: false, error: error.message };
  }
}

export async function getScheduleConfirmation(scheduleNo) {
  try {
    const scheduleData = await prisma.scheduleConfirmation.findMany({
      where: { scheduleNo },
    });
    return { success: true, data: scheduleData };
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return { success: false, error: error.message };
  }
}