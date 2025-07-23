import { call, put, select, takeLatest } from 'redux-saga/effects';
import { ProductResponse, fetchProducts } from './fetchProducts';
import { fetchProductsStart, fetchProductsSuccess, fetchProductsFailure, } from './productSlice';
import { RootState } from '../../store/store';
function* handleFetchProducts() {
    try {
        const state: RootState = yield select();
        const { offset, limit, searchQuery, categoryId } = state.products;

        const params: Record<string, any> = {
            offset,
            limit,
        };

        if (searchQuery) {
            params.search = searchQuery;
        }

        if (categoryId) {
            params.category = categoryId;
        }
        console.log(params);

        const data: ProductResponse = yield call(fetchProducts, params);

        yield put(fetchProductsSuccess({ items: data.items, total: data.total_records }));
    } catch (err: any) {
        yield put(fetchProductsFailure(err.message || 'Xatolik yuz berdi'));
    }
}

export default function* productSaga() {
    yield takeLatest(fetchProductsStart.type, handleFetchProducts);
}
