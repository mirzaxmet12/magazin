import { useQuery } from '@tanstack/react-query';
import { fetchCategories, Category, fetchCategoryById } from '../services/categoryService';

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategory(id?: number) {
  return useQuery<Category, Error>({
    queryKey: ['category', id],
    queryFn: () => fetchCategoryById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}