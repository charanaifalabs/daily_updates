import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

if (process.env.NODE_ENV === "development") {
  prisma.$use(async (params, next) => {
    return next(params);
  });
}

export default prisma;
