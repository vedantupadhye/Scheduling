import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const materials = [
    {
      IN_MaterialName: "IN20250301",
      IN_Thickness: 2,
      IN_Width: 1250,
      IN_Weight: 15,
      IN_Grade: "E350Br",
      ActuallWeight: 490.5,
      In_ProductionDate: new Date("2024-03-10T00:00:00.000Z"),
      YardArrivalDate: new Date("2024-03-15T00:00:00.000Z"),
      Residence_INYard: "Section A",
      YardNO: "Y-101",
      Position: "Y01010A02",
      Manufacturing_Location: "Plant 1",
      Manufacturer: "SteelCorp Ltd.",
    },
    {
      IN_MaterialName: "IN20250302",
      IN_Thickness: 3.0,
      IN_Width: 1300.0,
      IN_Weight: 600.0,
      IN_Grade: "B500",
      ActuallWeight: 595.0,
      In_ProductionDate: new Date("2024-03-12T00:00:00.000Z"),
      YardArrivalDate: new Date("2024-03-18T00:00:00.000Z"),
      Residence_INYard: "Section B",
      YardNO: "Y-102",
      Position: "Y01010C01",
      Manufacturing_Location: "Plant 2",
      Manufacturer: "MetalWorks Pvt. Ltd.",
    },
    {
      IN_MaterialName: "IN20250303",
      IN_Thickness: 4.5,
      IN_Width: 1100.8,
      IN_Weight: 750.0,
      IN_Grade: "C45",
      ActuallWeight: 745.5,
      In_ProductionDate: new Date("2024-03-14T00:00:00.000Z"),
      YardArrivalDate: new Date("2024-03-20T00:00:00.000Z"),
      Residence_INYard: "Section C",
      YardNO: "Y-101",
      Position: "Y01010A02",
      Manufacturing_Location: "Plant 3",
      Manufacturer: "IronTech Industries",
    },
    {
      IN_MaterialName: "IN20250304",
      IN_Thickness: 1.8,
      IN_Width: 1250,
      IN_Weight: 15,
      IN_Grade: "E350Br",
      ActuallWeight: 490.5,
      In_ProductionDate: new Date("2024-03-10T00:00:00.000Z"),
      YardArrivalDate: new Date("2024-03-05T00:00:00.000Z"),
      Residence_INYard: "Section A",
      YardNO: "Y-104",
      Position: "Y01010C04",
      Manufacturing_Location: "Plant =2",
      Manufacturer: "SteelCorp Ltd.",
    },
    {
      IN_MaterialName: "IN20250305",
      IN_Thickness: 2.5,
      IN_Width: 1250,
      IN_Weight: 15,
      IN_Grade: "E350Br",
      ActuallWeight: 490.5,
      In_ProductionDate: new Date("2024-03-10T00:00:00.000Z"),
      YardArrivalDate: new Date("2024-03-01T00:00:00.000Z"),
      Residence_INYard: "Section A",
      YardNO: "Y-105",
      Position: "Y01030D03",
      Manufacturing_Location: "Plant 1",
      Manufacturer: "SteelCorp Ltd.",
    },
    {
      IN_MaterialName: "IN20250306",
      IN_Thickness: 2,
      IN_Width: 1250,
      IN_Weight: 15,
      IN_Grade: "E350Br",
      ActuallWeight: 40.5,
      In_ProductionDate: new Date("2024-03-10T00:00:00.000Z"),
      YardArrivalDate: new Date("2024-03-18T00:00:00.000Z"),
      Residence_INYard: "Section A",
      YardNO: "Y-101",
      Position: "Y01040B02",
      Manufacturing_Location: "Plant 3",
      Manufacturer: "SteelCorp Ltd.",
    },
    {
      IN_MaterialName: "IN20250307",
      IN_Thickness: 2.2,
      IN_Width: 1250,
      IN_Weight: 15,
      IN_Grade: "E350Br",
      ActuallWeight: 490.5,
      In_ProductionDate: new Date("2024-03-10T00:00:00.000Z"),
      YardArrivalDate: new Date("2024-03-15T00:00:00.000Z"),
      Residence_INYard: "Section A",
      YardNO: "Y-101",
      Position: "Y01020C01",
      Manufacturing_Location: "Plant 2",
      Manufacturer: "SteelCorp Ltd.",
    },
    {
      IN_MaterialName: "IN20250308",
      IN_Thickness: 2,
      IN_Width: 1250,
      IN_Weight: 15,
      IN_Grade: "E350Br",
      ActuallWeight: 490.5,
      In_ProductionDate: new Date("2024-03-10T00:00:00.000Z"),
      YardArrivalDate: new Date("2024-03-19T00:00:00.000Z"),
      Residence_INYard: "Section A",
      YardNO: "Y-103",
      Position: "Y01010A03",
      Manufacturing_Location: "Plant =2",
      Manufacturer: "SteelCorp Ltd.",
    },
    {
      IN_MaterialName: "IN20250309",
      IN_Thickness: 4.5,
      IN_Width: 1300,
      IN_Weight: 30,
      IN_Grade: "E250Br",
      ActuallWeight: 490.5,
      In_ProductionDate: new Date("2024-03-10T00:00:00.000Z"),
      YardArrivalDate: new Date("2024-03-15T00:00:00.000Z"),
      Residence_INYard: "Section A",
      YardNO: "Y-101",
      Position: "Y01010A02",
      Manufacturing_Location: "Plant 1",
      Manufacturer: "SteelCorp Ltd.",
    },
    {
      IN_MaterialName: "IN20250310",
      IN_Thickness: 4.5,
      IN_Width: 1300,
      IN_Weight: 15,
      IN_Grade: "E250Br",
      ActuallWeight: 490.5,
      In_ProductionDate: new Date("2024-03-10T00:00:00.000Z"),
      YardArrivalDate: new Date("2024-03-15T00:00:00.000Z"),
      Residence_INYard: "Section A",
      YardNO: "Y-101",
      Position: "Y01010A02",
      Manufacturing_Location: "Plant 1",
      Manufacturer: "SteelCorp Ltd.",
    },
  ];
  
  for (const material of materials) {
    await prisma.inventory.upsert({
      where: { IN_MaterialName: material.IN_MaterialName },
      update: material,
      create: material,
    });
    console.log(`Upserted material: ${material.IN_MaterialName}`);
  }

  console.log("✅ Order and Inventory data seeded successfully");
}

const schedule = await prisma.scheduleSummary.upsert({
  where: { scheduleNo: 'SCH001' },
  update: {}, // If it exists, do nothing
  create: {
    scheduleNo: 'SCH001',
    status: 'Pending',
    totalMaterialNumber: 0,
    totalMatWeight: 0.0,
    totalRollingLength: 0.0,
    estimatedTime: '0h',
    madeBy: 'Admin',
    createdDate: new Date(),
  },
});

console.log('✅ ScheduleSummary seeded:', schedule);

// Insert a record into ScheduleConfirmation
await prisma.scheduleConfirmation.create({
  data: {
    scheduleNo: 'SCH001', // Must match an existing scheduleNo in ScheduleSummary
    orderNo: 12345,
    outMaterialNo: 'NA00001',
    outThickness: 2.5,
    outWidth: 300.0,
    outGrade: 'GradeB',
    outCoilWeight: 500,
    inMatNo: 'IN_001',
    inThickness: 5.0,
    inWidth: 200.0,
    inGrade: 'GradeA',
    inactualWeight: 100.5,
    materialSummary: 'Pending',
  },
});

console.log('✅ ScheduleConfirmation seeded successfully');

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

  