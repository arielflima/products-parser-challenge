import { GetUpdateProductResponse } from '../responses/GetUpdateProductResponse';
import { GetPagedProductResponse } from '../responses/GetPagedProductResponse';
import { CreateProductRequest } from '../requests/CreateProductRequest';
import { Product, ProductStatus, Prisma } from '@prisma/client';

export function toList(
  products: Product[],
  page: number,
  total: number,
  size: number,
): GetPagedProductResponse {
  const productResponse: GetUpdateProductResponse[] = products.map(
    (product) => ({
      id: product.id,
      brands: product.brands,
      categories: product.categories,
      cities: product.cities,
      code: product.code,
      created_t: product.created_t,
      creator: product.creator,
      deleted_t: product.deleted_t ?? null,
      image_url: product.image_url,
      ingredients_text: product.ingredients_text,
      imported_t: product.imported_t,
      labels: product.labels,
      last_modified_t: product.last_modified_t,
      main_category: product.main_category,
      nutriscore_grade: product.nutriscore_grade,
      nutriscore_score: product.nutriscore_score,
      product_name: product.product_name,
      purchase_places: product.purchase_places,
      quantity: product.quantity,
      serving_quantity: product.serving_quantity,
      serving_size: product.serving_size,
      status: product.status,
      stores: product.stores,
      traces: product.traces,
      updated_t: product.updated_t ?? null,
      url: product.url,
    }),
  );

  return {
    total,
    page,
    size,
    products: productResponse,
  };
}

export function toProduct(
  product: CreateProductRequest,
): Prisma.ProductCreateInput {
  return {
    brands: product.brands,
    categories: product.categories,
    cities: product.cities,
    code: product.code,
    created_t: product.created_t,
    creator: product.creator,
    deleted_t: product.deleted_t ?? null,
    image_url: product.image_url,
    ingredients_text: product.ingredients_text,
    imported_t: product.imported_t,
    labels: product.labels,
    last_modified_t: product.last_modified_t,
    main_category: product.main_category,
    nutriscore_grade: product.nutriscore_grade,
    nutriscore_score: product.nutriscore_score,
    product_name: product.product_name,
    purchase_places: product.purchase_places,
    quantity: product.quantity,
    serving_quantity: product.serving_quantity,
    serving_size: product.serving_size,
    status: ProductStatus.PUBLISHED as ProductStatus,
    stores: product.stores,
    traces: product.traces,
    updated_t: product.updated_t ?? null,
    url: product.url,
  };
}
