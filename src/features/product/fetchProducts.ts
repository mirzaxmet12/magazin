import axios from '../../services/axios';

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
export interface Category {
  "id": number,
  "name": string,
  "min_price": string,
  "max_price": string,
};

export const fetchProducts = async (params: Record<string, any>): Promise<ProductResponse> => {
  console.log(params);
  const response = await axios.get('/products', { params });
  console.log(response.data.data);

  return response.data.data;

};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = (await axios.get('/categories'));
  console.log(response);

  return response.data.data.categories;
};



// const params = {
//   first_name: "Mirzaxmet",
//   last_name: "Abullaev",
//   password: "something",
//   phone: "998906612124",
//   date_of_birth: "2000-10-18",
//   gender: "male",
// };

// async function loadProducts() {
  // const response = await axios.post('/users', params);
  // try {
  //   const data = await registerUser(params);
  //   console.log('Products:', data);
  // } catch (err) {
  //   console.error(err);
  // }
// }

// loadProducts();

// export const addCartItem = async (
//   productId: number,
//   quantity: number = 1) => {
//   // POST /cart { product, quantity }
//   const res = await axios.post<{ data: any }>('/cart', {
//     product: productId,
//     quantity,
//   })
