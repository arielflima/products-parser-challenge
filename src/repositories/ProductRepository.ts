import prisma from '../config/prismaClient';
import { Prisma } from '@prisma/client';

export async function create(
  productData: Prisma.ProductCreateInput,
): Promise<void> {
  await prisma.product.create({
    data: productData,
  });
}
