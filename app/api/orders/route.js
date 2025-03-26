import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const newOrder = await prisma.order.create({
      data: body,
    });
    return Response.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Failed to insert order" }, { status: 500 });
  }
}

