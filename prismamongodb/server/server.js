import app from "./src/app.js";
import { PrismaClient } from "@prisma/client";

const PORT = process.env.PORT || 5000;

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to MongoDB via Prisma");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(" Failed to connect to MongoDB:", err);
  }
}

main();


