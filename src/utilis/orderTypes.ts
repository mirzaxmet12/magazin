export interface Receiver {
  address?: string;
  first_name: string;
  last_name: string;
  phone: string;
  longitude: number;
  latitude: number;
}

export interface OrderItem {
  product: number;
  price: number;
  quantity: number;
}

export interface CreateOrderPayload {
  amount: number;
  payment_type: 1 | 2;
  delivery_type: 1 | 2;
  use_cashback: boolean;
  receiver: Receiver;
  items: OrderItem[];
}

export interface CreateCardPayload {
  card_number: string;   // "8600123456789012"
  expire: string;   // "MM/YY"
}

export interface CreateReceiptResponse {
  success: boolean;
  data: {
    receipt: { _id: string };
  };
}

export interface CreateCardResponse {
  success: boolean;
  data: {
    card: { token: string };
  };
}

export interface GenericSuccess {
  success: boolean;
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