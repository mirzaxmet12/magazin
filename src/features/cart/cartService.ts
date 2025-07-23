import CartItem from '../../components/CartItem';
import axios from '../../service/axios';
import { Product } from '../product/fetchProducts';

export interface CartItem {
  id: number;
  cart_items: number;
  product: Product;
  quantity: number;
}

// export interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   image: string;
//   quantity: number;
//   total_price: number;
// }

// Fetch
export const fetchCart = async () => {
  const res = await axios.get<{ data: { cart: CartItem[] } }>('/cart');
  console.log(res.data.data.cart);
  const cart: CartItem[] = res.data.data.cart
  console.log(cart);

  return res.data.data.cart;
};

// Add
export const addCartItem = async (
  productId: number,
  quantity: number
): Promise<CartItem> => {
  const res = await axios.post<{ data:{cart: CartItem }}>('/cart', {
    product: productId,
    quantity,
  });
  console.log(res.data.data.cart);
  
  return res.data.data.cart;
};

// Update
export const updateCartItem = async (
  id: number,
  product: number,
  quantity: number
)=> {
  // console.log(res);
  console.log(id,product,quantity);
  const res = await axios.put(`/cart/${id}`, { product, quantity });
  console.log(res.data.data.cart);
  const item = res.data.data.cart;

  return item;
};

// Remove
export const removeCartItem = async (id: number): Promise<void> => {
  await axios.delete(`/cart/${id}`);
};

// Cleare
export const clearCart = async (): Promise<void> => {
  await axios.delete('/cart/delete-all');
};
