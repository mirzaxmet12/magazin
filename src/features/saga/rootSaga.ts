// import { all } from "axios";
import { all } from "redux-saga/effects";
import LoginSaga from "../auth/authSaga";
import productSaga from "../product/productsSaga";
import authSaga from "../auth/authSaga";
import cartSaga from "../cart/cartSaga";
import orderSaga from "../order/orderSaga";

export default function* rootSaga() {
    yield all([
        authSaga(),
        LoginSaga(),
        productSaga(),
        cartSaga(),
        orderSaga(),
    ])
}