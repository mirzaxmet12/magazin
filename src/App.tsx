import './App.css';
import ProductPage from './page/ProductsPage';
import Layout from './layout/layout';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './components/Login';
import ProductDetailPage from './page/ProductDetailPage';
import RegisterForm from './components/RegisterPage';
import OtpVerifyPage from './components/OtpVerify';
import CartPage from './page/CartPage';
import OrderPage from './page/OrderPage';
import MyOrdersPage from './page/MyOrdersPage';
import ProfilePage from './page/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path='/' element={<ProductPage />} />
          <Route path='/signUp' element={<RegisterForm />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/verify-otp' element={<OtpVerifyPage />} />
          <Route path='/product/:id' element={<ProductDetailPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/cart' element={<CartPage />} />
          <Route path='/payment' element={<OrderPage/>} />
          <Route path='/myorders' element={<MyOrdersPage/>} />
          <Route path='/profile' element={<ProfilePage/>} />
        </Route>
        </Routes>
      </Layout>
    </>
  );
}

export default App;
