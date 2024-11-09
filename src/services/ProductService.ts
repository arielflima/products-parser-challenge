import { create } from '../repositories/ProductRepository';
import { Prisma } from '@prisma/client';

export async function createProduct(
  productData: Prisma.ProductCreateInput,
): Promise<void> {
  return create(productData);
}
