const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const result = await prisma.ruleTable.update({
    where: { ruleName: "test2" },
    data: {
      ruleNo: "t2",
      ruleName: "test2",
      remark: "none",
      criteria: {
        upsert: [{
          where: { ruleName: "test2", criteria: "Thickness jump" },
          create: {
            criteria: "Thickness jump",
            parameterType: "Range",
            parameterValue: "",
            controlParameter: "Output Thickness",
            parameterStatus: "Enable",
            ranges: { create: [{ parameterMin: "2", parameterMax: "4" }] },
          },
          update: {
            parameterType: "Range",
            parameterValue: "",
            controlParameter: "Output Thickness",
            parameterStatus: "Enable",
            ranges: { deleteMany: {}, create: [{ parameterMin: "2", parameterMax: "4" }] },
          },
        }],
      },
    },
  });
  console.log(result);
}

test().catch(console.error).finally(() => prisma.$disconnect());