// "use server";

// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// // Get all rules with their criteria
// export async function getRules() {
//   try {
//     const rules = await prisma.ruleTable.findMany({
//       include: {
//         criteria: true,
//       },
//     });
//     return { success: true, data: rules };
//   } catch (error) {
//     console.error("Error fetching rules:", error);
//     return { success: false, error: error.message };
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// // Create a new rule with criteria
// export async function createRule(formData) {
//   try {
//     const rule = await prisma.ruleTable.create({
//       data: {
//         ruleNo: formData.ruleNo,
//         ruleName: formData.ruleName,
//         remark: formData.remark,
//         createdBy: formData.createdBy,
//         criteria: formData.criteria
//           ? {
//               create: formData.criteria.map((crit) => ({
//                 ruleName: formData.ruleName,
//                 criteria: crit.criteria,
//                 parameterType: crit.parameterValues?.type || null,
//                 parameterValue: crit.parameterValues?.value || null,
//                 parameterMin: crit.parameterValues?.min ? parseFloat(crit.parameterValues.min) : null,
//                 parameterMax: crit.parameterValues?.max ? parseFloat(crit.parameterValues.max) : null,
//                 logic: crit.logicValues || null,
//                 controlParameter: crit.controlParameterValues?.selectedOption || null,
//                 controlInputType: crit.controlParameterValues?.inputType || null,
//                 controlValue: crit.controlParameterValues?.value || null,
//                 controlMin: crit.controlParameterValues?.min ? parseFloat(crit.controlParameterValues.min) : null,
//                 controlMax: crit.controlParameterValues?.max ? parseFloat(crit.controlParameterValues.max) : null,
//                 parameterStatus: crit.parameterStatus || "Enable",
//               })),
//             }
//           : undefined,
//       },
//       include: { criteria: true },
//     });
//     return { success: true, data: rule };
//   } catch (error) {
//     console.error("Error creating rule:", error);
//     return { success: false, error: error.message };
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// // Update a rule and its criteria
// export async function updateRule(ruleName, formData) {
//   try {
//     const rule = await prisma.ruleTable.update({
//       where: { ruleName: ruleName },
//       data: {
//         ruleNo: formData.ruleNo,
//         ruleName: formData.ruleName,
//         remark: formData.remark,
//       },
//       include: { criteria: true },
//     });

//     await prisma.ruleCriteria.deleteMany({
//       where: { ruleName: ruleName },
//     });

//     if (formData.criteria) {
//       await prisma.ruleCriteria.createMany({
//         data: formData.criteria.map((crit) => ({
//           ruleName: formData.ruleName,
//           criteria: crit.criteria,
//           parameterType: crit.parameterValues?.type || null,
//           parameterValue: crit.parameterValues?.value || null,
//           parameterMin: crit.parameterValues?.min ? parseFloat(crit.parameterValues.min) : null,
//           parameterMax: crit.parameterValues?.max ? parseFloat(crit.parameterValues.max) : null,
//           logic: crit.logicValues || null,
//           controlParameter: crit.controlParameterValues?.selectedOption || null,
//           controlInputType: crit.controlParameterValues?.inputType || null,
//           controlValue: crit.controlParameterValues?.value || null,
//           controlMin: crit.controlParameterValues?.min ? parseFloat(crit.controlParameterValues.min) : null,
//           controlMax: crit.controlParameterValues?.max ? parseFloat(crit.controlParameterValues.max) : null,
//           parameterStatus: crit.parameterStatus || "Enable",
//         })),
//       });
//     }

//     const updatedRule = await prisma.ruleTable.findUnique({
//       where: { ruleName: formData.ruleName },
//       include: { criteria: true },
//     });

//     return { success: true, data: updatedRule };
//   } catch (error) {
//     console.error("Error updating rule:", error);
//     return { success: false, error: error.message };
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// // Delete a rule
// export async function deleteRule(ruleName) {
//   try {
//     await prisma.ruleTable.delete({
//       where: { ruleName: ruleName },
//     });
//     return { success: true };
//   } catch (error) {
//     console.error("Error deleting rule:", error);
//     return { success: false, error: error.message };
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// // Search rules
// export async function searchRules({ ruleNo, ruleName, remark }) {
//   try {
//     const rules = await prisma.ruleTable.findMany({
//       where: {
//         AND: [
//           ruleNo ? { ruleNo: { contains: ruleNo, mode: "insensitive" } } : {},
//           ruleName ? { ruleName: { contains: ruleName, mode: "insensitive" } } : {},
//           remark ? { remark: { contains: remark, mode: "insensitive" } } : {},
//         ],
//       },
//       include: { criteria: true },
//     });
//     return { success: true, data: rules };
//   } catch (error) {
//     console.error("Error searching rules:", error);
//     return { success: false, error: error.message };
//   } finally {
//     await prisma.$disconnect();
//   }
// }




"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all rules with their criteria and ranges
export async function getRules() {
  try {
    const rules = await prisma.ruleTable.findMany({
      include: {
        criteria: {
          include: {
            ranges: true,
          },
        },
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

// Create a new rule with criteria and ranges
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
                criteria: crit.criteria,
                parameterType: crit.parameterValues?.type || null,
                parameterValue: crit.parameterValues?.type === "Input Value" ? crit.parameterValues.value : null,
                controlParameter: crit.controlParameterValues?.selectedOption || null,
                parameterStatus: crit.parameterStatus || "Enable",
                ranges: crit.parameterValues?.type === "Range" && crit.parameterValues.ranges.length > 0
                ? {
                    create: crit.parameterValues.ranges.map((range) => ({
                      parameterMin: range.min ? String(range.min) : null, // Convert to string
                      parameterMax: range.max ? String(range.max) : null, // Convert to string
                    })),
                  }
                : undefined,
              
              })),
            }
          : undefined,
      },
      include: {
        criteria: {
          include: { ranges: true },
        },
      },
    });
    return { success: true, data: rule };
  } catch (error) {
    console.error("Error creating rule:", error);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}

// Update a rule and its criteria with ranges
export async function updateRule(ruleName, formData) {
  try {
    const rule = await prisma.ruleTable.update({
      where: { ruleName: ruleName },
      data: {
        ruleNo: formData.ruleNo,
        ruleName: formData.ruleName,
        remark: formData.remark,
      },
      include: {
        criteria: {
          include: { ranges: true },
        },
      },
    });

    // Delete existing criteria and ranges
    await prisma.ruleCriteria.deleteMany({
      where: { ruleName: ruleName },
    });

    if (formData.criteria) {
      await prisma.ruleCriteria.createMany({
        data: formData.criteria.map((crit) => ({
          ruleName: formData.ruleName,
          criteria: crit.criteria,
          parameterType: crit.parameterValues?.type || null,
          parameterValue: crit.parameterValues?.type === "Input Value" ? crit.parameterValues.value : null,
          controlParameter: crit.controlParameterValues?.selectedOption || null,
          parameterStatus: crit.parameterStatus || "Enable",
        })),
      });

      // Create ranges for each criteria
      for (const crit of formData.criteria) {
        if (crit.parameterValues?.type === "Range" && crit.parameterValues.ranges.length > 0) {
          const createdCrit = await prisma.ruleCriteria.findFirst({
            where: { ruleName: formData.ruleName, criteria: crit.criteria },
          });
          await prisma.criteriaRange.createMany({
            data: crit.parameterValues.ranges.map((range) => ({
              ruleCriteriaId: createdCrit.id,
              parameterMin: range.min ? String(range.min) : null,  // Convert to string
              parameterMax: range.max ? String(range.max) : null,  // Convert to string
            })),
          });
          
        }
      }
    }

    const updatedRule = await prisma.ruleTable.findUnique({
      where: { ruleName: formData.ruleName },
      include: {
        criteria: {
          include: { ranges: true },
        },
      },
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


// export async function updateRule(ruleName, data) {
//   const updatedRule = await prisma.ruleTable.update({
//     where: { ruleName },
//     data: {
//       ruleNo: data.ruleNo,
//       ruleName: data.ruleName,
//       remark: data.remark || "",
//       criteria: {
//         upsert: data.criteria.map((crit) => ({
//           where: {
//             ruleName: data.ruleName, // Use the fields directly
//             criteria: crit.criteria,
//           },
//           create: {
//             criteria: crit.criteria,
//             parameterType: crit.parameterValues.type,
//             parameterValue: crit.parameterValues.value || "",
//             controlParameter: crit.controlParameterValues.selectedOption,
//             parameterStatus: crit.parameterStatus,
//             ranges: {
//               create: crit.parameterValues.ranges.map((range) => ({
//                 parameterMin: range.fromGrade || range.min || "",
//                 parameterMax: range.toGrade || range.max || "",
//               })),
//             },
//           },
//           update: {
//             parameterType: crit.parameterValues.type,
//             parameterValue: crit.parameterValues.value || "",
//             controlParameter: crit.controlParameterValues.selectedOption,
//             parameterStatus: crit.parameterStatus,
//             ranges: {
//               deleteMany: {}, // Clear existing ranges
//               create: crit.parameterValues.ranges.map((range) => ({
//                 parameterMin: range.fromGrade || range.min || "",
//                 parameterMax: range.toGrade || range.max || "",
//               })),
//             },
//           },
//         })),
//       },
//     },
//   });
//   return { success: true, data: updatedRule };
// }


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
      include: {
        criteria: {
          include: { ranges: true },
        },
      },
    });
    return { success: true, data: rules };
  } catch (error) {
    console.error("Error searching rules:", error);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}