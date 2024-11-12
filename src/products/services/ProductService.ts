import ProductRepository from '../repositories/ProductRepository';
import {
  Prisma,
  Product,
  ImportHistoryStatus,
  ProductStatus,
} from '@prisma/client';
import logger from '../../utils/logger';
import {
  downloadAndExtractFile,
  fetchIndexFile,
  fetchProductsFromJsonFile,
} from '../../utils/fileHelper';
import ImportHistoryService from '../../importHistory/services/ImportHistoryService';
import { IMPORT_FOOD_DATA_LIMIT } from '../../infra/constants';
import elasticsearchClient from '../../infra/elasticsearchClient';
import { toProduct } from '../mappers/ProductMapper';

interface ElasticsearchHit<T> {
  _source: T;
}

interface ElasticsearchResponse<T> {
  hits: {
    hits: ElasticsearchHit<T>[];
  };
}

export class ProductService {
  static async createManyProducts(data: Product[]) {
    const products = data.map((product) => toProduct(product));
    const { count } = await ProductRepository.createMany(products);

    const createdProducts = await ProductRepository.findMany({
      where: {
        code: {
          in: data.map((product) => product.code),
        },
      },
    });

    for (const product of createdProducts) {
      try {
        await this.indexProduct(product);
        await ProductRepository.update(product.code, {
          status: ProductStatus.PUBLISHED,
        });
      } catch {
        await ProductRepository.update(product.code, {
          status: ProductStatus.DRAFT,
        });
      }
    }

    return { count };
  }

  static async createProduct(
    data: Prisma.ProductCreateInput,
  ): Promise<Product> {
    return ProductRepository.create(data);
  }

  static async deleteProduct(code: string) {
    const deletedProduct = await ProductRepository.softDelete(code);
    if (!deletedProduct) {
      throw new Error('Product not found');
    }
    return true;
  }

  static async findManyByCodes(codes: string[]): Promise<Product[]> {
    return ProductRepository.findMany({ where: { code: { in: codes } } });
  }

  static async getProduct(code: string): Promise<Product> {
    const product = await ProductRepository.findUnique(code);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  static async getProducts(page: number, take: number): Promise<Product[]> {
    const skip = (page - 1) * take;
    const products = await ProductRepository.findMany({ skip, take });
    return products;
  }

  static async getProductsCount(): Promise<number> {
    return ProductRepository.count();
  }

  static async importProducts() {
    const importLimit = parseInt(IMPORT_FOOD_DATA_LIMIT as string);
    try {
      const filenames = await fetchIndexFile();
      logger.info(`Found ${filenames.length} files to process.`);

      for (const filename of filenames) {
        try {
          logger.info(`Processing file: ${filename}`);
          const filePath = await downloadAndExtractFile(filename);

          await ImportHistoryService.createLogImport(
            filename,
            ImportHistoryStatus.SUCCESS,
          );

          let productsCreated = 0;
          let counter = 0;
          let isEndOfFile = false;

          while (productsCreated < importLimit && !isEndOfFile) {
            const remaining = importLimit - productsCreated;
            const { products: rawProducts, isEndOfFile: eof } =
              await fetchProductsFromJsonFile(
                filePath,
                remaining,
                counter * importLimit,
              );

            isEndOfFile = eof;

            const products = rawProducts.filter(
              (product, index, self) =>
                index === self.findIndex((p) => p.code === product.code),
            );

            const existingProducts = await this.findManyByCodes(
              products.map((product) => product.code),
            );

            const newProducts = products.filter(
              (product) =>
                !existingProducts.some((p) => p.code === product.code),
            );

            if (newProducts.length > 0) {
              const { count } = await this.createManyProducts(newProducts);
              productsCreated += count;
            }

            counter++;
          }

          logger.info(`Successfully processed file: ${filename}`);
        } catch (error) {
          let errorMessage: string;
          if (error instanceof Error) {
            errorMessage = error.message;
          } else {
            errorMessage = String(error);
          }
          await ImportHistoryService.createLogImport(
            filename,
            ImportHistoryStatus.FAILED,
            errorMessage,
          );
          logger.error(`Error processing file ${filename}: ${errorMessage}`);
        }
      }
    } catch (error) {
      logger.error('Error in main process:', error);
    }
  }

  static async indexProduct(product: Product) {
    try {
      await elasticsearchClient.index({
        index: 'products',
        id: product.code.toString(),
        body: product,
      });
    } catch (error) {
      logger.error(
        `Error indexing product ${product.code} in Elasticsearch:`,
        error,
      );
      throw error;
    }
  }

  static async searchProducts(query: string): Promise<Product[]> {
    if (!query || query.trim() === '') {
      throw new Error('Query text is required for search');
    }

    try {
      const result = await elasticsearchClient.search<
        ElasticsearchResponse<Product>
      >({
        index: 'products',
        body: {
          query: {
            multi_match: {
              query,
              fields: [
                'product_name',
                'brands',
                'categories',
                'labels',
                'cities',
                'code',
                'creator',
                'ingredients_text',
                'main_category',
                'purchase_places',
                'stores',
              ],
            },
          },
        },
      });

      return result.body.hits.hits.map((hit) => hit._source);
    } catch (error) {
      logger.error('Error searching products in Elasticsearch:', error);
      throw error;
    }
  }

  static async updateProduct(
    code: string,
    data: Prisma.ProductUpdateInput,
  ): Promise<Product> {
    return ProductRepository.update(code, data);
  }
}
