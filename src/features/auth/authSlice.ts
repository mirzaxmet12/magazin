import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RegisterPayload } from "./authServices";

export interface UserInfo {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
    date_of_birth: string;
    gender: string;
    is_active: boolean;
}

interface AuthState {
    registering: boolean;
    registerError: string | null;
    userId: number | null;
    user: UserInfo | null;

    verifying: boolean;
    verifyError: string | null;

    logging: boolean;
    loginError: string | null;

    accessToken: string | null;
    refreshToken: string | null;
};

const initialState: AuthState = {
    registering: false,
    registerError: null,
    userId: null,
    user: null,

    verifying: false,
    verifyError: null,

    logging: false,
    loginError: null,

    accessToken: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refresh_token'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // - Register-
        registerStart(state, _action: PayloadAction<RegisterPayload>) {
            state.registering = true;
            state.registerError = null;
        },
        registerSuccess(state, action: PayloadAction<number>) {
            state.registering = false;
            state.userId = action.payload;
        },
        registerFailure(state, action: PayloadAction<string>) {
            state.registering = false;
            state.registerError = action.payload;
        },
        // - Verify OTP -
        verifyStart(state, _action: PayloadAction<{ phone: string; otp: string; }>) {
            state.verifying = true;
            state.verifyError = null;
        },
        verifySuccess(state, action: PayloadAction<{ access: string; refresh: string }>) {
            state.verifying = false;
            state.accessToken = action.payload.access;
            state.refreshToken = action.payload.refresh;
        },
        verifyFailure(state, action: PayloadAction<string>) {
            state.verifying = false;
            state.verifyError = action.payload;
        },

        // - Login -
        loginStart(state, _action: PayloadAction<{ phone: string; password: string }>) {
            state.logging = true;
            state.loginError = null;
        },
        loginSuccess(state, action: PayloadAction<{ access: string; refresh: string }>) {
            state.logging = false;
            console.log(action.payload.access);
            console.log(action.payload);

            state.accessToken = action.payload.access;
            state.refreshToken = action.payload.refresh;
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.logging = false;
            state.loginError = action.payload;
        },
        
        // User info
        getMeStart(state) {
            state.logging = true;
            state.loginError = null;
        },
        getMeSuccess(state, action: PayloadAction<UserInfo>) {
            state.logging = false;
            state.user = action.payload;
        },
        getMeFailure(state, action: PayloadAction<string>) {
            state.logging = false;
            state.loginError = action.payload;
        },

        // - Logout -
        logout(state) {
            state.accessToken = null;
            state.refreshToken = null;
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
        },
    },
});

export const { registerStart, registerSuccess, registerFailure, verifyStart, verifySuccess, verifyFailure, loginStart, loginSuccess, loginFailure, logout,getMeStart,getMeSuccess,getMeFailure } = authSlice.actions;

export default authSlice.reducer;