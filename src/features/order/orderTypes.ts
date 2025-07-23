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
