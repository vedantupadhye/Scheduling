
// actions/inventory.js


// 'use server';

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function getInventory() {
//   try {
//     const inventoryItems = await prisma.inventory.findMany({
//       orderBy: {
//         YardArrivalDate: 'desc',
//       },
//     });
    
//     return inventoryItems;
//   } catch (error) {
//     console.error('Error fetching inventory data:', error);
//     return [];
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// export async function insertInventoryItem(data) {
//   try {
//     const newItem = await prisma.inventory.create({
//       data: {
//         ...data,
//         In_ProductionDate: new Date(data.In_ProductionDate),
//         YardArrivalDate: new Date(data.YardArrivalDate)
//       }
//     });
    
//     return newItem;
//   } catch (error) {
//     console.error('Error inserting inventory item:', error);
//     throw error;
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// export async function updateInventoryItem(id, data) {
//   try {
//     const updatedItem = await prisma.inventory.update({
//       where: { id },
//       data: {
//         ...data,
//         In_ProductionDate: new Date(data.In_ProductionDate),
//         YardArrivalDate: new Date(data.YardArrivalDate)
//       }
//     });
    
//     return updatedItem;
//   } catch (error) {
//     console.error('Error updating inventory item:', error);
//     throw error;
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// export async function deleteInventoryItem(id) {
//   try {
//     await prisma.inventory.delete({
//       where: { id }
//     });
    
//     return { message: 'Item successfully deleted' };
//   } catch (error) {
//     console.error('Error deleting inventory item:', error);
//     throw error;
//   } finally {
//     await prisma.$disconnect();
//   }
// }


'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getInventory() {
  try {
    const inventoryItems = await prisma.inventory.findMany({
      orderBy: {
        YardArrivalDate: 'desc',
      },
    });
    
    return inventoryItems;
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}