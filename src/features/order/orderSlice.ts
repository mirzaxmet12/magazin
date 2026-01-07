import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateCardPayload, CreateOrderPayload } from "../../utilis/orderTypes";

interface OrderState {
    loading: boolean;
    error: string | null;
    orderId: number | null;
    invoiceId: string | null;
    cardToken: string;
    orders: Order[] | null;
    step: 'order' | 'card' | 'sms' | 'pay' | 'done';

}

export interface Order {
    d: number,
    order_number: string,
    amount: number,
    total_amount: number,
    use_cashback: boolean,
    cashback_earned: number,
    cashback_used: number,
    status: string,
    payment_type: number,
    delivery_type: number,
    receiver: {
        id: number,
        first_name: string;
        last_name: string;
        phone: string;
        address: string;
        longitude: number;
        latitude: number;
    },
    items: [
        {
            price: number,
            quantity: number,
            product: number,
            product_name: string,
            total_price: number
        }
    ],
    cash_payments: [
        {
            amount: string,
            type: string,
            created_at: string
        }
    ],
    online_payments: [
        {
            amount: number,
            qr_code_url: string,
            perform_time: string,
        }
    ],
    created_at: string,
    status_updated: string
}



const initialState: OrderState = {
    loading: false,
    error: null,
    orderId: null,
    invoiceId: null,
    cardToken: '',
    orders: null,
    step: 'order'
}
const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        // Create order
        createOrderStart(state, _action: PayloadAction<CreateOrderPayload>) {
            state.loading = true;
            state.error = null;
            console.log('kk');

        },
        orderCreated(state, action: PayloadAction<number>) {
            state.orderId = action.payload;
            state.loading = false;
            console.log('card');
            state.step = 'card'
        },
        setInvoiceId(state, action: PayloadAction<string>) {
            state.invoiceId = action.payload;
            console.log(action.payload);
        },

        // Create card
        createCardStart(state, _action: PayloadAction<CreateCardPayload>) {
            state.loading = true;
            state.error = null;
        },
        setCardToken(state, action: PayloadAction<string>) {
            state.cardToken = action.payload;
            state.loading = false
            state.step = 'sms';
        },

        // Request SMS 
        requestSmsStart(state) {
            state.loading = true;
            state.error = null;
        },
        smsRequested(state) {
            state.loading = false;
        },

        // Payment
        paymentStart(state, _action: PayloadAction<string>) {
            state.loading = true;
            state.error = null
            console.log(state.invoiceId);

        },
        paymentSuccess(state) {
            state.loading = false;
            state.step = 'done'
        },

        // Get orders
        getOrdersStart(state) {
            state.loading = true;
            state.error = null;
        },
        setOrders(state, action: PayloadAction<Order[]>) {
            state.orders = action.payload;
            console.log(state.orders);

            state.loading = false;
        },

        orderFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        prevStep(state) {
            if (state.step === 'sms') state.step = 'card';
            else if (state.step === 'card') state.step = 'order';
            else if (state.step === 'done') state.step = 'order';
        }
    },
});

export const { createOrderStart, orderCreated, createCardStart, requestSmsStart, getOrdersStart, setOrders,
    smsRequested, paymentStart, paymentSuccess, orderFailure, setInvoiceId, setCardToken, prevStep } = orderSlice.actions;

export default orderSlice.reducer;