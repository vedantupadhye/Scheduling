import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      select: {
        orderNo: true,
        timeToShip: true,
        timeForQualityCheck: true,
      },
    });

    console.log("✅ Orders fetched:", orders);
    return NextResponse.json(orders);
  } catch (error) {
    console.error("🔥 Prisma Error:", error); // Logs exact error
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
