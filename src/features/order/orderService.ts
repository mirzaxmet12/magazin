import axios from "../../services/axios"
import { CreateCardPayload, CreateCardResponse, CreateReceiptResponse, GenericSuccess } from "../../utilis/orderTypes";

// Invoice
export const createReceipt = async (order_id: number, amount: number): Promise<CreateReceiptResponse> => {
    const res = await axios.post('/receipts/receipts_create', { order_id, amount });
    return res.data
};
// Card token
export const createCard = async (params: CreateCardPayload): Promise<CreateCardResponse> => {
    const res = await axios.post('/cards/create_card', params);
    return res.data;
};
// SMS
export const requestSms = async (token: string): Promise<GenericSuccess> => {
    const res = await axios.post('/cards/get_verify_code', { token });
    return res.data;
};
// Verify card
export const verifyCard = async (token: string, code: string): Promise<GenericSuccess> => {
    const res = await axios.post('/cards/verify_card', { token, code });
    return res.data
};
//Payment 
export const payInvoice = async (token: string, invoice_id: string) => {
    const res = await axios.post('/receipts/receipts_pay', { token, invoice_id });
    return res.data
}