import { call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  CartItem,
} from './cartService';
import {
  fetchCartStart,
  fetchCartSuccess,
  fetchCartFailure,
  addItemStart,
  addItemSuccess,
  addItemFailure,
  updateItemStart,
  updateItemSuccess,
  updateItemFailure,
  removeItemStart,
  removeItemSuccess,
  removeItemFailure,
  clearCartStart,
  clearCartSuccess,
  clearCartFailure,
} from './cartSlice';

// Fetch
function* onFetchCart() {
  try {
    const items: CartItem[] = yield call(fetchCart);
    yield put(fetchCartSuccess(items));
  } catch (err: any) {
    yield put(fetchCartFailure(err.message));
  }
}

// Add
function* onAddItem(action: ReturnType<typeof addItemStart>) {
  try {
    const { product, quantity } = action.payload;
    const item: CartItem = yield call(addCartItem, product, quantity);
    yield put(addItemSuccess(item));
  } catch (err: any) {
    yield put(addItemFailure(err.message));
  }
}

// Update
function* onUpdateItem(action: ReturnType<typeof updateItemStart>) {
  try {
    const { id, product, quantity } = action.payload;
    const item: CartItem = yield call(updateCartItem, id, product, quantity);
    // console.log(item);
    
    yield put(updateItemSuccess(item));
  } catch (err: any) {
    yield put(updateItemFailure(err.message));
  }
}

// Remove
function* onRemoveItem(action: ReturnType<typeof removeItemStart>) {
  try {
    const id: number = action.payload;
    yield call(removeCartItem, id);
    yield put(removeItemSuccess(id));
  } catch (err: any) {
    yield put(removeItemFailure(err.message));
  }
}

// Clear
function* onClearCart() {
  try {
    yield call(clearCart);
    yield put(clearCartSuccess());
  } catch (err: any) {
    yield put(clearCartFailure(err.message));
  }
}

export default function* cartSaga() {
  yield takeLatest(fetchCartStart.type, onFetchCart);
  yield takeLatest(addItemStart.type, onAddItem);
  yield takeLatest(updateItemStart.type, onUpdateItem);
  yield takeLatest(removeItemStart.type, onRemoveItem);
  yield takeLatest(clearCartStart.type, onClearCart);
}
