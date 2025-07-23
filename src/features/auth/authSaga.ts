import { call, put, takeLatest } from "redux-saga/effects";
import { UserInfo, getMeFailure, getMeStart, getMeSuccess, loginFailure, loginStart, loginSuccess, registerFailure, registerStart, registerSuccess, verifyFailure, verifyStart, verifySuccess } from "./authSlice";
import {  RegisterResponse, VerifyPayload, VerifyResponse, getMe, loginUser, registerUser, verifyOtp } from "./authServices";

function* handleRegister(action: ReturnType<typeof registerStart>) {
    try {
        const payload = action.payload;
        
        const data: RegisterResponse = yield call(registerUser, payload);
        yield put(registerSuccess(data.data.user.id))
    }
    catch (err: any) {
        yield put(registerFailure(err.message))
    }
}

function* handleVerify(action: ReturnType<typeof verifyStart>) {
    try {
        const payload: VerifyPayload = action.payload;
        const data: VerifyResponse = yield call(verifyOtp, payload);
        yield put(verifySuccess({
            access: data.data.token.access,
            refresh: data.data.token.refresh,
        }))
    }
    catch (err: any) {
        yield put(verifyFailure(err.message))
    }
}

function* handleLogin(action: ReturnType<typeof loginStart>) {
    try{
        const data: VerifyResponse = yield call(loginUser, action.payload);
        
        yield put(loginSuccess( data.data.token));

          localStorage.setItem('token', data.data.token.access);
        localStorage.setItem('refresh_token', data.data.token.refresh);
    }
    catch(err:any){
        yield put(loginFailure(err.message))
    }

}

function* handleGetMe() {
    try {
      const user: UserInfo = yield call(getMe);
      yield put(getMeSuccess(user));
    } catch (err: any) {
      yield put(getMeFailure(err.message));
    }
  }

export default function* authSaga() {
    yield takeLatest(registerStart.type, handleRegister);
    yield takeLatest(verifyStart.type, handleVerify);
    yield takeLatest(loginStart.type, handleLogin);
    yield takeLatest(getMeStart.type, handleGetMe);
  }
  