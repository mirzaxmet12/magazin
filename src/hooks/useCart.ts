import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  CartItem,
} from "../services/cartService";

type AddPayload = { productId: number; quantity?: number };
type UpdatePayload = { id: number; product: number; quantity: number };

const CART_KEY = ["cart"] as const;

export function useCart() {
  return useQuery<CartItem[], Error>({
    queryKey: CART_KEY,
    queryFn: fetchCart,
    staleTime: 30_000, // 30s
    retry: 1,
  });
}

/** Add item */
export function useAddCartItem() {
  const qc = useQueryClient();

  return useMutation<CartItem, Error, AddPayload>({
    mutationFn: ({ productId, quantity = 1 }) => addCartItem(productId, quantity),
    onSuccess(newItem) {
      qc.setQueryData<CartItem[] | undefined>(CART_KEY, (old) => {
        if (!old) return [newItem];
        return [...old, newItem];
      });
    },
    onError(err) {
      console.error("Add cart item failed", err);
    },
  });
}

/** Update item */
export function useUpdateCartItem() {
  const qc = useQueryClient();

  return useMutation<CartItem, Error, UpdatePayload>({
    mutationFn: ({ id, product, quantity }) => updateCartItem(id, product, quantity),
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: CART_KEY });
      const previous = qc.getQueryData<CartItem[]>(CART_KEY);

      qc.setQueryData<CartItem[] | undefined>(CART_KEY, (old) =>
        old ? old.map((it) => (it.id === vars.id ? { ...it, quantity: vars.quantity } : it)) : old
      );

      return { previous };
    },
    onError: (_err, _vars, context: any) => {
      if (context?.previous) qc.setQueryData(CART_KEY, context.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}

/** Remove item */
export function useRemoveCartItem() {
  const qc = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id: number) => removeCartItem(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: CART_KEY });
      const previous = qc.getQueryData<CartItem[]>(CART_KEY);

      qc.setQueryData<CartItem[] | undefined>(CART_KEY, (old) =>
        old ? old.filter((it) => it.id !== id) : old
      );

      return { previous };
    },
    onError: (_err, _id, context: any) => {
      if (context?.previous) qc.setQueryData(CART_KEY, context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  });
}

/** Clear cart */
export function useClearCart() {
  const qc = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: () => clearCart(),
    onSuccess: () => {
      qc.setQueryData<CartItem[] | undefined>(CART_KEY, []);
    },
    onError: (err) => {
      console.error("Clear cart failed", err);
    },
  });
}
