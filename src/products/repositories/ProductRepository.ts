import prisma from '../../infra/prismaClient';
import { Prisma, ProductStatus } from '@prisma/client';

interface FindManyProps {
  skip?: number;
  take?: number;
  where?: Prisma.ProductWhereInput;
}

export default class ProductRepository {
  static async count() {
    return prisma.product.count();
  }

  static async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
      data: {
        ...data,
        imported_t: new Date(),
      },
    });
  }

  static async createMany(data: Prisma.ProductCreateInput[]) {
    return prisma.product.createMany({
      data: data.map((d) => ({
        ...d,
        imported_t: new Date(),
      })),
    });
  }

  static async findUnique(code: string) {
    return prisma.product.findUnique({
      where: { code },
    });
  }

  static async findMany({ skip, take, where }: FindManyProps) {
    return prisma.product.findMany({
      skip,
      take,
      where,
    });
  }

  static async update(code: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { code },
      data: { ...data, updated_t: new Date() },
    });
  }

  static async softDelete(code: string) {
    return prisma.product.update({
      where: { code },
      data: { status: ProductStatus.TRASH, deleted_t: new Date() },
    });
  }
}
