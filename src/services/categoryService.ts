import axios from './axios';

export interface Category {
  id: number;
  name: string;
  min_price: string;
  max_price: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await axios.get('/categories');
  return res.data?.data?.categories;
};

export const fetchCategoryById = async (id: number): Promise<Category> => {
  const res = await axios.get(`/categories/${id}`);
 
  return res.data?.data?.categories ;
};