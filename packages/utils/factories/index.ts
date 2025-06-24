/**
 * packages/utils/factories/index.ts
 * ------------------------------------------------------------------
 * Factory helpers for deterministic test data generation.
 * Exported functions are used by Prisma seed, Cypress tasks,
 * and any spec needing mock entities without UI interaction.
 */
import { faker } from "@faker-js/faker";
import { hashSync } from "bcryptjs";
import { PrismaClient, Product } from "@prisma/client";

const prisma = new PrismaClient();

export interface UserFactoryInput {
  email?: string;
  password?: string;
  role?: "ADMIN" | "CUSTOMER";
}

export async function createUser(
  opts: UserFactoryInput = {}
) {
  const email = opts.email ?? faker.internet.email().toLowerCase();
  const password = hashSync(opts.password ?? "Test1234!", 10);
  const role = opts.role ?? "CUSTOMER";

  return {
    email,
    passwordHash: password,
    role
  };
}

export interface ProductFactoryInput {
  price?: number;
  name?: string;
}

export async function createProduct(
  opts: ProductFactoryInput = {}
): Promise<Omit<Product, "id">> {
  return {
    name: opts.name ?? faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: opts.price ?? Number(faker.commerce.price({ min: 10, max: 199 })),
    imageUrl: faker.image.urlPicsumPhotos({ width: 640, height: 480 })
  };
}

/**
 * Create an order with line‑items for the given user & products.
 */
export async function createOrder(userId: string, products: Product[]) {
  const order = await prisma.order.create({
    data: {
      userId,
      total: products.reduce((sum, p) => sum + p.price, 0),
      items: {
        createMany: {
          data: products.map((p) => ({ productId: p.id, quantity: 1 }))
        }
      }
    },
    include: { items: true }
  });
  return order;
}
