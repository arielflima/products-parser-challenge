export interface CreateProductRequest {
  brands: string;
  categories: string;
  cities: string | null;
  code: string;
  created_t: string;
  creator: string;
  deleted_t: Date | null;
  image_url: string;
  ingredients_text: string;
  imported_t: Date;
  labels: string;
  last_modified_t: string;
  main_category: string;
  nutriscore_grade: string;
  nutriscore_score: string;
  product_name: string;
  purchase_places: string;
  quantity: string;
  serving_quantity: string;
  serving_size: string;
  status: string;
  stores: string;
  traces: string;
  updated_t: Date | null;
  url: string;
}
