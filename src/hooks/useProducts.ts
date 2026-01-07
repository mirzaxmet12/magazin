import {
    useQuery,
    keepPreviousData,
  } from "@tanstack/react-query";
  
  import {
    fetchProducts,
    ProductResponse,
    FetchProductsParams,
    Product,
    fetchProductById,
  } from "../services/productService";
  
  
  export function useProducts(params: FetchProductsParams) {
    return useQuery<ProductResponse, Error>({
      queryKey: ["products", params],
      queryFn: () => fetchProducts(params),
      placeholderData: keepPreviousData,
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    });
  }
  


  export function useProduct(id?: number) {
    return useQuery<Product, Error>({
      queryKey: ["product", id],
      queryFn: () => fetchProductById(id as number),
      enabled: !!id,          
      staleTime: 60 * 1000,   
      retry: 1,
    });
  }


  