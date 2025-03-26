"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all rules with their criteria
export async function getRules() {
  try {
    const rules = await prisma.ruleTable.findMany({
      include: {
        criteria: true,
      },
    });
    return { success: true, data: rules };
  } catch (error) {
    console.error("Error fetching rules:", error);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}

// Create a new rule with criteria
export async function createRule(formData) {
  try {
    const rule = await prisma.ruleTable.create({
      data: {
        ruleNo: formData.ruleNo,
        ruleName: formData.ruleName,
        remark: formData.remark,
        createdBy: formData.createdBy,
        criteria: formData.criteria
          ? {
              create: formData.criteria.map((crit) => ({
                ruleName: formData.ruleName,
                criteria: crit.criteria,
                parameterType: crit.parameterValues?.type || null,
                parameterValue: crit.parameterValues?.value || null,
                parameterMin: crit.parameterValues?.min ? parseFloat(crit.parameterValues.min) : null,
                parameterMax: crit.parameterValues?.max ? parseFloat(crit.parameterValues.max) : null,
                logic: crit.logicValues || null,
                controlParameter: crit.controlParameterValues?.selectedOption || null,
                controlInputType: crit.controlParameterValues?.inputType || null,
                controlValue: crit.controlParameterValues?.value || null,
                controlMin: crit.controlParameterValues?.min ? parseFloat(crit.controlParameterValues.min) : null,
                controlMax: crit.controlParameterValues?.max ? parseFloat(crit.controlParameterValues.max) : null,
                parameterStatus: crit.parameterStatus || "Enable",
              })),
            }
          : undefined,
      },
      include: { criteria: true },
    });
    return { success: true, data: rule };
  } catch (error) {
    console.error("Error creating rule:", error);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}

// Update a rule and its criteria
export async function updateRule(ruleName, formData) {
  try {
    const rule = await prisma.ruleTable.update({
      where: { ruleName: ruleName },
      data: {
        ruleNo: formData.ruleNo,
        ruleName: formData.ruleName,
        remark: formData.remark,
      },
      include: { criteria: true },
    });

    await prisma.ruleCriteria.deleteMany({
      where: { ruleName: ruleName },
    });

    if (formData.criteria) {
      await prisma.ruleCriteria.createMany({
        data: formData.criteria.map((crit) => ({
          ruleName: formData.ruleName,
          criteria: crit.criteria,
          parameterType: crit.parameterValues?.type || null,
          parameterValue: crit.parameterValues?.value || null,
          parameterMin: crit.parameterValues?.min ? parseFloat(crit.parameterValues.min) : null,
          parameterMax: crit.parameterValues?.max ? parseFloat(crit.parameterValues.max) : null,
          logic: crit.logicValues || null,
          controlParameter: crit.controlParameterValues?.selectedOption || null,
          controlInputType: crit.controlParameterValues?.inputType || null,
          controlValue: crit.controlParameterValues?.value || null,
          controlMin: crit.controlParameterValues?.min ? parseFloat(crit.controlParameterValues.min) : null,
          controlMax: crit.controlParameterValues?.max ? parseFloat(crit.controlParameterValues.max) : null,
          parameterStatus: crit.parameterStatus || "Enable",
        })),
      });
    }

    const updatedRule = await prisma.ruleTable.findUnique({
      where: { ruleName: formData.ruleName },
      include: { criteria: true },
    });

    return { success: true, data: updatedRule };
  } catch (error) {
    console.error("Error updating rule:", error);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}

// Delete a rule
export async function deleteRule(ruleName) {
  try {
    await prisma.ruleTable.delete({
      where: { ruleName: ruleName },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting rule:", error);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}

// Search rules
export async function searchRules({ ruleNo, ruleName, remark }) {
  try {
    const rules = await prisma.ruleTable.findMany({
      where: {
        AND: [
          ruleNo ? { ruleNo: { contains: ruleNo, mode: "insensitive" } } : {},
          ruleName ? { ruleName: { contains: ruleName, mode: "insensitive" } } : {},
          remark ? { remark: { contains: remark, mode: "insensitive" } } : {},
        ],
      },
      include: { criteria: true },
    });
    return { success: true, data: rules };
  } catch (error) {
    console.error("Error searching rules:", error);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}