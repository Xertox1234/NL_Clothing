#!/usr/bin/env ts-node
/**
 * prisma/seed.ts
 * -----------------------------------------------------------------------
 * Seed script populates a minimal dataset for local dev & Cypress tests.
 * • Creates an admin user, sample customers, products, and one order.
 * • Uses factory helpers from `packages/utils/factories` for consistency.
 * -----------------------------------------------------------------------
 * Usage:  pnpm dlx prisma migrate dev --name init && pnpm exec ts-node prisma/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";
import {
  createUser,
  createProduct,
  createOrder,
  type UserFactoryInput,
  type ProductFactoryInput
} from "@/packages/utils/factories";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱  Seeding database…");

  // 1. Admin user
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: await createUser({
      email: "admin@example.com",
      password: "Pass1234!",
      role: "ADMIN"
    } satisfies UserFactoryInput)
  });

  // 2. Sample products
  const products = await Promise.all(
    Array.from({ length: 8 }).map(() => createProduct())
  );

  await prisma.product.createMany({ data: products });

  // 3. Sample customer + order
  const customer = await prisma.user.create({
    data: await createUser({ role: "CUSTOMER" })
  });

  await createOrder(customer.id, products.slice(0, 3));

  console.log("✅  Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
