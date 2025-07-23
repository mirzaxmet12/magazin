import { Product } from "./fetchProducts";
import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface ProductState {
    items: Product[];
    total: number;
    loading: boolean;
    error: string | null;
    offset: number;
    limit: number;
    searchQuery: string;
    categoryId: number | null;
}

const initialState: ProductState = {
    items: [],
    total: 0,
    loading: false,
    error: null,
    offset: 0,
    limit: 20,
    searchQuery: '',
    categoryId: null,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setOffset(state, action: PayloadAction<number>) {
            state.offset = action.payload;
        },
        setSearchQuery(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
            state.offset = 0; 
        },
        setCategoryId(state, action: PayloadAction<number | null>) {
            state.categoryId = action.payload;
            state.offset = 0; 
        },
        fetchProductsStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchProductsSuccess(state, action: PayloadAction<{ items: Product[]; total: number }>) {
            state.items = action.payload.items;
            state.total = action.payload.total;
            state.loading = false;
        },
        fetchProductsFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { setOffset, setSearchQuery, setCategoryId, fetchProductsStart, fetchProductsSuccess, fetchProductsFailure, } = productSlice.actions;

export default productSlice.reducer;
