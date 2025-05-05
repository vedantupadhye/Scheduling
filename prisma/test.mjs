// seed.mjs
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Adding test data to existing database...');

  // Generate sequential order numbers (starting from today's date)
  const baseOrderNo = 71220250310; // YYYYMMDD + 310
  const baseMaterialNo = 20250311; // YYYYMM + 311

  // Valid grades as per requirements
  const validGrades = ['E150Br', 'E250Br', 'E350Br', 'E450Br', 'APIX'];

  // Create test orders with correct formats
  const orders = [
    // Valid thickness transitions (descending)
    { orderNo: baseOrderNo, grade: 'E150Br', orderThickness: 12.0, orderWidth: 1500, deliveryPlace: 'Warehouse A' },
    { orderNo: baseOrderNo + 1, grade: 'E250Br', orderThickness: 8.0, orderWidth: 1500, deliveryPlace: 'Warehouse A' },
    { orderNo: baseOrderNo + 2, grade: 'E350Br', orderThickness: 6.0, orderWidth: 1500, deliveryPlace: 'Warehouse B' },
    { orderNo: baseOrderNo + 3, grade: 'E450Br', orderThickness: 4.0, orderWidth: 1500, deliveryPlace: 'Warehouse B' },
    { orderNo: baseOrderNo + 4, grade: 'APIX', orderThickness: 3.8, orderWidth: 1500, deliveryPlace: 'Warehouse C' },
    { orderNo: baseOrderNo + 5, grade: 'E150Br', orderThickness: 1.8, orderWidth: 1500, deliveryPlace: 'Warehouse C' },
    { orderNo: baseOrderNo + 6, grade: 'E250Br', orderThickness: 1.2, orderWidth: 1500, deliveryPlace: 'Warehouse D' },
    
    // Edge cases
    { orderNo: baseOrderNo + 7, grade: 'E350Br', orderThickness: 8.1, orderWidth: 1500, deliveryPlace: 'Warehouse D' },
    { orderNo: baseOrderNo + 8, grade: 'E450Br', orderThickness: 5.9, orderWidth: 1500, deliveryPlace: 'Warehouse E' },
    { orderNo: baseOrderNo + 9, grade: 'APIX', orderThickness: 4.1, orderWidth: 1500, deliveryPlace: 'Warehouse E' },
    { orderNo: baseOrderNo + 10, grade: 'E150Br', orderThickness: 1.21, orderWidth: 1500, deliveryPlace: 'Warehouse F' },
  ];

  // Create inventory items with correct formats
  const inventory = [
    // Valid sequence
    {
      IN_MaterialName: `IN${baseMaterialNo}`,
      IN_Thickness: 12.0,
      IN_Width: 1500,
      IN_Weight: 25,
      IN_Grade: 'E150Br',
      ActuallWeight: 500,
      In_ProductionDate: new Date("2024-03-10T00:00:00.000Z"),
      YardArrivalDate: new Date("2024-03-15T00:00:00.000Z"),
      Residence_INYard: "Section A",
      YardNO: "Y-101",
      Position: "Y01010A01",
      Manufacturing_Location: "Plant 1",
      Manufacturer: "SteelCorp Ltd.",
    },
    {
      IN_MaterialName: `IN${baseMaterialNo + 1}`,
      IN_Thickness: 8.0,
      IN_Width: 1500,
      IN_Weight: 25,
      IN_Grade: 'E250Br',
      ActuallWeight: 500,
      In_ProductionDate: new Date("2024-03-11T00:00:00.000Z"),
      YardArrivalDate: new Date("2024-03-16T00:00:00.000Z"),
      Residence_INYard: "Section A",
      YardNO: "Y-101",
      Position: "Y01010A02",
      Manufacturing_Location: "Plant 1",
      Manufacturer: "SteelCorp Ltd.",
    },
    {
      IN_MaterialName: `IN${baseMaterialNo + 2}`,
      IN_Thickness: 6.0,
      IN_Width: 1500,
      IN_Weight: 25,
      IN_Grade: 'E350Br',
      ActuallWeight: 500,
      In_ProductionDate: new Date("2024-03-12T00:00:00.000Z"),
      YardArrivalDate: new Date("2024-03-17T00:00:00.000Z"),
      Residence_INYard: "Section B",
      YardNO: "Y-102",
      Position: "Y01010B01",
      Manufacturing_Location: "Plant 1",
      Manufacturer: "SteelCorp Ltd.",
    },
    {
      IN_MaterialName: `IN${baseMaterialNo + 3}`,
      IN_Thickness: 4.0,
      IN_Width: 1100,
      IN_Weight: 15,
      IN_Grade: 'E450Br',
      ActuallWeight: 490.5,
      In_ProductionDate: new Date("2024-03-13T00:00:00.000Z"),
      YardArrivalDate: new Date("2024-03-18T00:00:00.000Z"),
      Residence_INYard: "Section B",
      YardNO: "Y-102",
      Position: "Y01010B02",
      Manufacturing_Location: "Plant 1",
      Manufacturer: "SteelCorp Ltd.",
    },
    {
      IN_MaterialName: `IN${baseMaterialNo + 4}`,
      IN_Thickness: 3.8,
      IN_Width: 1100,
      IN_Weight: 15,
      IN_Grade: 'APIX',
      ActuallWeight: 490.5,
      In_ProductionDate: new Date("2024-03-14T00:00:00.000Z"),
      YardArrivalDate: new Date("2024-03-19T00:00:00.000Z"),
      Residence_INYard: "Section C",
      YardNO: "Y-103",
      Position: "Y01010C01",
      Manufacturing_Location: "Plant 1",
      Manufacturer: "SteelCorp Ltd.",
    },
    {
      IN_MaterialName: `IN${baseMaterialNo + 5}`,
      IN_Thickness: 1.8,
      IN_Width: 1100,
      IN_Weight: 15,
      IN_Grade: 'E150Br',
      ActuallWeight: 490.5,
      In_ProductionDate: new Date("2024-03-15T00:00:00.000Z"),
      YardArrivalDate: new Date("2024-03-20T00:00:00.000Z"),
      Residence_INYard: "Section C",
      YardNO: "Y-103",
      Position: "Y01010C02",
      Manufacturing_Location: "Plant 1",
      Manufacturer: "SteelCorp Ltd.",
    },
    {
      IN_MaterialName: `IN${baseMaterialNo + 6}`,
      IN_Thickness: 1.2,
      IN_Width: 1100,
      IN_Weight: 15,
      IN_Grade: 'E250Br',
      ActuallWeight: 490.5,
      In_ProductionDate: new Date("2024-03-16T00:00:00.000Z"),
      YardArrivalDate: new Date("2024-03-21T00:00:00.000Z"),
      Residence_INYard: "Section D",
      YardNO: "Y-104",
      Position: "Y01010D01",
      Manufacturing_Location: "Plant 1",
      Manufacturer: "SteelCorp Ltd.",
    },
    {
      IN_MaterialName:  `IN${baseMaterialNo + 7}`,
      IN_Thickness: 4.4,
      IN_Width: 1300,
      IN_Weight: 30,  // Matches order weight
      IN_Grade: "E250Br",  // Exactly matches order grade
      ActuallWeight: 510.2,  // Slightly higher than nominal weight
      In_ProductionDate: new Date("2025-03-25T00:00:00.000Z"),  // Before delivery date
      YardArrivalDate: new Date("2025-04-01T00:00:00.000Z"),  // Before delivery date
      Residence_INYard: "Section A",
      YardNO: "Y-107",
      Position: "Y01010A07",
      Manufacturing_Location: "Plant 1",
      Manufacturer: "SteelCorp Ltd."
    },
    {
      IN_MaterialName:  `IN${baseMaterialNo + 8}`,
      IN_Thickness: 4.5,
      IN_Width: 1300,
      IN_Weight: 30,  // Matches order weight
      IN_Grade: "E250Br",  // Exactly matches order grade
      ActuallWeight: 510.2,  // Slightly higher than nominal weight
      In_ProductionDate: new Date("2025-03-25T00:00:00.000Z"),  // Before delivery date
      YardArrivalDate: new Date("2025-04-01T00:00:00.000Z"),  // Before delivery date
      Residence_INYard: "Section A",
      YardNO: "Y-107",
      Position: "Y01010A07",
      Manufacturing_Location: "Plant 1",
      Manufacturer: "SteelCorp Ltd."
    },
    {
      IN_MaterialName:  `IN${baseMaterialNo + 9}`,
      IN_Thickness: 4.6,
      IN_Width: 1300,
      IN_Weight: 30,  // Matches order weight
      IN_Grade: "E250Br",  // Exactly matches order grade
      ActuallWeight: 510.2,  // Slightly higher than nominal weight
      In_ProductionDate: new Date("2025-03-25T00:00:00.000Z"),  // Before delivery date
      YardArrivalDate: new Date("2025-04-01T00:00:00.000Z"),  // Before delivery date
      Residence_INYard: "Section A",
      YardNO: "Y-107",
      Position: "Y01010A07",
      Manufacturing_Location: "Plant 1",
      Manufacturer: "SteelCorp Ltd."
    }
  ];

  // Insert data with error handling to avoid duplicates
  for (const order of orders) {
    try {
      await prisma.order.upsert({
        where: { orderNo: order.orderNo },
        update: {}, // Do nothing if exists
        create: order,
      });
    } catch (error) {
      console.log(`Order ${order.orderNo} already exists or error: ${error.message}`);
    }
  }

  for (const item of inventory) {
    try {
      await prisma.inventory.upsert({
        where: { IN_MaterialName: item.IN_MaterialName },
        update: {}, // Do nothing if exists
        create: item,
      });
    } catch (error) {
      console.log(`Inventory item ${item.IN_MaterialName} already exists or error: ${error.message}`);
    }
  }

  console.log('Test data addition completed!');
  console.log('Added orders with thickness sequence:');
  console.log(orders.map(o => `${o.orderNo}: ${o.orderThickness}mm (${o.grade})`).join('\n'));
  console.log('\nAdded inventory materials:');
  console.log(inventory.map(i => `${i.IN_MaterialName}: ${i.IN_Thickness}mm (${i.IN_Grade})`).join('\n'));
}

main()
  .catch(e => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });











// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// async function test() {
//   const result = await prisma.ruleTable.update({
//     where: { ruleName: "test2" },
//     data: {
//       ruleNo: "t2",
//       ruleName: "test2",
//       remark: "none",
//       criteria: {
//         upsert: [{
//           where: { ruleName: "test2", criteria: "Thickness jump" },
//           create: {
//             criteria: "Thickness jump",
//             parameterType: "Range",
//             parameterValue: "",
//             controlParameter: "Output Thickness",
//             parameterStatus: "Enable",
//             ranges: { create: [{ parameterMin: "2", parameterMax: "4" }] },
//           },
//           update: {
//             parameterType: "Range",
//             parameterValue: "",
//             controlParameter: "Output Thickness",
//             parameterStatus: "Enable",
//             ranges: { deleteMany: {}, create: [{ parameterMin: "2", parameterMax: "4" }] },
//           },
//         }],
//       },
//     },
//   });
//   console.log(result);
// }

// test().catch(console.error).finally(() => prisma.$disconnect());