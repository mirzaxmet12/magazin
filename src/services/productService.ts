// src/services/fetchProducts.ts
import axios from './axios';

export interface Product {
  amount: number;
  category: number;
  id: number;
  name: string;
  description: string;
  price: number;
  images: { image: string }[];
}

export interface ProductResponse {
  items: Product[];
  total_records: number;
}

export interface FetchProductsParams {
  offset?: number;
  limit?: number;
  search?: string;
  category?: number | null;
}

export const fetchProducts = async (
  params: FetchProductsParams
): Promise<ProductResponse> => {
  const response = await axios.get('/products', {
    params: {
      offset: params.offset ?? 0,
      limit: params.limit ?? 20,
      ...(params.search ? { search: params.search } : {}),
      ...(params.category ? { category: params.category } : {}),
    },
  });

  // backend strukturasiga moslash
  return {
    items: response.data.data.items,
    total_records: response.data.data.total_records,
  };
};


// export interface Product {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   amount: number;
//   images: { id: number; image: string }[];
//   category?: {
//     id: number;
//     name: string;
//   };
// }

export interface ProductDetailResponse {
  data: Product;
}

export async function fetchProductById(id: number) {
  const res = await axios.get(`/products/${id}`);
  console.log(res);
  return res.data.data.items;
}
