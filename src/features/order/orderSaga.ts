import { call, put, select, take, takeLatest } from "redux-saga/effects";
import { orderFailure, createCardStart, createOrderStart, orderCreated, setCardToken, setInvoiceId, requestSmsStart, smsRequested, paymentStart, paymentSuccess, getOrdersStart, setOrders } from "./orderSlice";
import { createCard, createReceipt, payInvoice, requestSms, verifyCard } from "./orderService";
import { END, EventChannel, SagaIterator, eventChannel } from "redux-saga";
import { CreateCardResponse, CreateOrderPayload } from "./orderTypes";
import { RootState } from "../../store/store";
import axios from "../../service/axios";

// Websocket

function createOrderChannel(token: string, payload?: CreateOrderPayload): EventChannel<any> {
    return eventChannel(emitter => {
        const ws = new WebSocket(`wss://globus-nukus.uz/ws/orders?token=${token}`);

        ws.onopen = () => {
            const message = payload ? { type: "create_order", message: payload } : { type: "get_orders" };
            ws.send(JSON.stringify(message));
        }

        ws.onmessage = (e) => emitter(JSON.parse(e.data));
        ws.onerror = () => { emitter({ error: 'WebSocket error' }); emitter(END); };
        ws.onclose = () => emitter(END);

        return () => ws.close();
    });
}

function* handleCreateOrder(action: ReturnType<typeof createOrderStart>): SagaIterator {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token нет');


        const chan = yield call(createOrderChannel, token, action.payload);
        while (true) {
            const msg = yield take(chan);
            if (msg.error) {
                throw new Error(msg.error);
            };
            if (msg.type === 'order_created') {
                const orderId = msg.data.id;
                yield put(orderCreated(orderId));
                chan.close();

                const receipt = yield call(createReceipt, orderId, action.payload.amount);
                yield put(setInvoiceId(receipt.data.receipt._id));
                break;
            }
        }
    } catch (err: any) {
        yield put(orderFailure(err.message));
    }
}

function* handleGetOrders(): SagaIterator {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token нет");

        const chan = yield call(createOrderChannel, token);

        while (true) {
            const msg = yield take(chan);

            if (msg.error) throw new Error(msg.error);

            if (msg.type === "get_orders") {
                yield put(setOrders(msg.data.orders));
                chan.close();
                break;
            }
        }
    } catch (err: any) {
        yield put(orderFailure(err.message));
    }
}

function* handleCreateCard(action: ReturnType<typeof createCardStart>) {
    console.log('d');
    try {
        const res: CreateCardResponse = yield call(createCard, action.payload);
        yield put(setCardToken(res.data.card.token));

        yield put(requestSmsStart());
    } catch (err: any) {
        yield put(orderFailure(err.message));
    }
}



function* handleRequestSms(): SagaIterator {
    try {
        const token = yield select((s: RootState) => s.order.cardToken);
        yield call(requestSms, token);
        yield put(smsRequested());
    } catch (err: any) {
        yield put(orderFailure(err.message));
    }
}

function* handlePay(action: ReturnType<typeof paymentStart>): SagaIterator {
    try {
        const code = action.payload;
        const token = yield select((s: RootState) => s.order.cardToken);
        const invoiceId = yield select((s: RootState) => s.order.invoiceId);

        yield call(verifyCard, token, code);
        yield call(payInvoice, token, invoiceId);
        yield call(() => axios.delete('/cart/delete-all'));
        yield put(paymentSuccess());
    } catch (err: any) {
        yield put(orderFailure(err.message));
    }
}

export default function* orderSaga() {
    yield takeLatest(createOrderStart.type, handleCreateOrder);
    yield takeLatest(getOrdersStart.type, handleGetOrders);
    yield takeLatest(createCardStart.type, handleCreateCard);
    yield takeLatest(requestSmsStart.type, handleRequestSms);
    yield takeLatest(paymentStart.type, handlePay);
}
