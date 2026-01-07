import axios from "./axios";
import type {
    CreateOrderPayload,
    CreateReceiptResponse,
    CreateCardPayload,
    CreateCardResponse,
    GenericSuccess,
} from "../utilis/orderTypes";

const WS_BASE = (import.meta.env.VITE_WS_BASE || "wss://globus-nukus.uz") + "/ws/orders";
const DEFAULT_WS_TIMEOUT = 30_000; // ms


async function wsRequest<T = any>(
    token: string,
    message: any,
    waitForType: string,
    timeoutMs = DEFAULT_WS_TIMEOUT
): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        if (!token) {
            reject(new Error("No token"));
            return;
        }

        const ws = new WebSocket(`${WS_BASE}?token=${encodeURIComponent(token)}`);
        let timer: number | undefined;

        ws.onopen = () => {
            try {
                ws.send(JSON.stringify(message));
            } catch (err) {
                if (timer) window.clearTimeout(timer);
                ws.close();
                reject(err);
            }
        };

        ws.onmessage = (ev) => {
            try {
                const parsed = JSON.parse(ev.data);
                if (parsed.type === waitForType) {
                    if (timer) window.clearTimeout(timer);
                    ws.close();
                    resolve(parsed as T);
                } else if (parsed.error) {
                    if (timer) window.clearTimeout(timer);
                    ws.close();
                    reject(new Error(parsed.error));
                }
            } catch (err) {

            }
        };

        ws.onerror = () => {
            if (timer) window.clearTimeout(timer);
            ws.close();
            reject(new Error("WebSocket error"));
        };

        timer = window.setTimeout(() => {
            try {
                ws.close();
            } catch { }
            reject(new Error("WebSocket timeout"));
        }, timeoutMs);
    });
}

/* =========================
   REST API wrappers
   ========================= */

/** Create receipt (invoice) */
export const createReceipt = async (
    order_id: number,
    amount: number
): Promise<CreateReceiptResponse> => {
    const res = await axios.post<CreateReceiptResponse>("/receipts/receipts_create", { order_id, amount });
    return res.data;
};

/** Create card (returns card token) */
export const createCard = async (params: CreateCardPayload): Promise<CreateCardResponse> => {
    const res = await axios.post<CreateCardResponse>("/cards/create_card", params);
    return res.data;
};

/** Request SMS for card verification */
export const requestSms = async (token: string): Promise<GenericSuccess> => {
    const res = await axios.post<GenericSuccess>("/cards/get_verify_code", { token });
    return res.data;
};

/** Verify card (using token + code) */
export const verifyCard = async (token: string, code: string): Promise<GenericSuccess> => {
    const res = await axios.post<GenericSuccess>("/cards/verify_card", { token, code });
    return res.data;
};

/** Pay invoice */
export const payInvoice = async (token: string, invoice_id: string): Promise<GenericSuccess> => {
    const res = await axios.post<GenericSuccess>("/receipts/receipts_pay", { token, invoice_id });
    return res.data;
};

/** Clear cart (REST) */
export const clearCart = async (): Promise<void> => {
    await axios.delete("/cart/delete-all");
};



export async function createOrderViaWs(payload: CreateOrderPayload, timeoutMs = DEFAULT_WS_TIMEOUT) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token");

    const msg = await wsRequest<any>(token, { type: "create_order", message: payload }, "order_created", timeoutMs);

    const orderId: number | undefined = msg?.data?.id;
    if (!orderId) throw new Error("No order id received from server");

    // create receipt via REST (same as your saga)
    const receipt = await createReceipt(orderId, payload.amount);
    const invoiceId = receipt.data.receipt._id;

    return { orderId, invoiceId };
}


export async function getOrdersViaWs(timeoutMs = DEFAULT_WS_TIMEOUT) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token");

    const msg = await wsRequest<any>(token, { type: "get_orders" }, "get_orders", timeoutMs);

    return msg?.data?.orders ?? [];
}
