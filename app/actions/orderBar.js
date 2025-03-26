import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        orderNo: true,
        quantity: true,
        grade: true,
        leastProductionDate: true
      },
      where: {
        leastProductionDate: {
          not: null
        }
      },
      orderBy: {
        leastProductionDate: 'asc'
      }
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}