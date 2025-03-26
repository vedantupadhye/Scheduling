"use server";
import { prisma } from "@/lib/prisma";

// Get all input materials
export async function getInputMaterials() {
  try {
    const inputMaterials = await prisma.inputMaterial.findMany();
    
    // Return the data with any necessary transformations
    return inputMaterials.map(material => ({
      ...material,
      // Add any date formatting or type conversions here if needed
      createdAt: material.createdAt ? material.createdAt.toISOString() : null,
      updatedAt: material.updatedAt ? material.updatedAt.toISOString() : null,
    }));
  } catch (error) {
    console.error("Error fetching input materials:", error);
    throw new Error("Failed to fetch input materials");
  }
}