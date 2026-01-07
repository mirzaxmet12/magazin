import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
    CreateOrderPayload,
    CreateCardPayload,
} from "../utilis/orderTypes";
import {
    createOrderViaWs,
    getOrdersViaWs,
    createCard as createCardApi,
    requestSms as requestSmsApi,
    verifyCard as verifyCardApi,
    payInvoice as payInvoiceApi,
    clearCart as clearCartApi,
} from "../services/orderService";

/**
 * Query keys
 */
const ORDERS_KEY = ["orders"];
const CURRENT_ORDER_KEY = ["order", "current"];

/* =========================
   useCreateOrder - mutation (WebSocket + receipt)
   ========================= */
type CreateOrderResult = { orderId: number; invoiceId: string; };
export function useCreateOrder() {
    const qc = useQueryClient();

    return useMutation<CreateOrderResult, Error, CreateOrderPayload>({
        
        mutationFn: (payload: CreateOrderPayload) => createOrderViaWs(payload),

        onMutate: async (payload) => {
            await qc.cancelQueries({ queryKey: ORDERS_KEY });
            // optionally set optimistic placeholder
            const previous = qc.getQueryData(ORDERS_KEY);
            return { previous };
        },
        onSuccess: (data) => {
            qc.setQueryData(CURRENT_ORDER_KEY, data);
            qc.invalidateQueries({ queryKey: ORDERS_KEY });
        },
        onError: (_err, _vars, context: any) => {
            if (context?.previous) qc.setQueryData(ORDERS_KEY, context.previous);
        },
    }
    );
}

/* =========================
   useGetOrders - query (WebSocket one-shot)
   ========================= */
export function useGetOrders() {
    return useQuery({
        queryKey: ORDERS_KEY,
        queryFn: () => getOrdersViaWs(),
        staleTime: 30_000,
        retry: 1,
    });
}

/* =========================
   useCreateCard - REST
   onSuccess: store card token into CURRENT_ORDER_KEY
   ========================= */
export function useCreateCard() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateCardPayload) => createCardApi(payload),
        onSuccess: (res) => {
            const token = res?.data?.card?.token;
            if (token) {
                qc.setQueryData(CURRENT_ORDER_KEY, (old: any) => ({ ...(old ?? {}), cardToken: token }));
            }
        },
    });
}

/* =========================
   useRequestSms - REST
   ========================= */
export function useRequestSms() {
    return useMutation({
        mutationFn: (token: string) => requestSmsApi(token),
    });
}

/* =========================
   useVerifyAndPay - chain verifyCard + payInvoice + clearCart
   ========================= */
export function useVerifyAndPay() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async ({ token, code, invoiceId }: { token: string; code: string; invoiceId: string }) => {
            // verify card then pay invoice, then clear cart
            await verifyCardApi(token, code);
            await payInvoiceApi(token, invoiceId);
            await clearCartApi();
            return true;
        },
        onSuccess: () => {
            // refresh orders and cart
            qc.invalidateQueries({ queryKey: ORDERS_KEY });
            qc.invalidateQueries({ queryKey: ["cart"] });
            qc.removeQueries({ queryKey: CURRENT_ORDER_KEY });
        },
    });
}
