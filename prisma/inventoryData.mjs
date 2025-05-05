import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const materials = [
      {
        IN_MaterialName: "IN2025029",
        IN_Thickness: 4.8,
        IN_Width: 1400,
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
        IN_MaterialName: "IN2025030",
        IN_Thickness: 5,
        IN_Width: 1400,
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
        IN_MaterialName: "IN2025031",
        IN_Thickness: 5.2,
        IN_Width: 1400,
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
        IN_MaterialName: "IN2025032",
        IN_Thickness: 4.7,
        IN_Width: 1400,
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

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });