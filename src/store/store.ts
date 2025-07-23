import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from 'redux-saga';
import rootSaga from "../features/saga/rootSaga";
import productSlice from "../features/product/productSlice";
import authSlice from "../features/auth/authSlice";
import cartSlice from "../features/cart/cartSlice";
import orderSlice from "../features/order/orderSlice";

const sagaMiddlware = createSagaMiddleware();

export const store = configureStore({
    reducer: {
        auth:authSlice,
        products:productSlice,
        cart:cartSlice,
        order:orderSlice,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: false }).concat(sagaMiddlware)
    ,
});

sagaMiddlware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;