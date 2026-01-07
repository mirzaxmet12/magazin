import axios from "./axios";
import { Product } from "./productService";

export interface CartItem {
  id: number;
  cart_items: number;
  product: Product;
  quantity: number;
}

interface CartListResponse {
  data: {
    cart: CartItem[];
  };
}

interface CartItemResponse {
  data: {
    cart: CartItem;
  };
}


// GET /cart
export const fetchCart = async (): Promise<CartItem[]> => {
  const res = await axios.get<CartListResponse>("/cart");
  return res.data.data.cart;
};

//  POST /cart
export const addCartItem = async (
  productId: number,
  quantity: number = 1
): Promise<CartItem> => {
  const res = await axios.post<CartItemResponse>("/cart", {
    product: productId,
    quantity,
  });

  return res.data.data.cart;
};

// PUT /cart/:id
export const updateCartItem = async (
  id: number,
  product: number,
  quantity: number
): Promise<CartItem> => {
  const res = await axios.put<CartItemResponse>(`/cart/${id}`, {
    product,
    quantity,
  });

  return res.data.data.cart;
};

//DELETE /cart/:id
export const removeCartItem = async (id: number): Promise<void> => {
  await axios.delete(`/cart/${id}`);
};

// DELETE /cart/delete-all
export const clearCart = async (): Promise<void> => {
  await axios.delete("/cart/delete-all");
};
