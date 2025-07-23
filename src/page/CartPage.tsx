// src/pages/CartPage.tsx
import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Divider,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCartStart,
  clearCartStart,
} from '../features/cart/cartSlice';
import { RootState } from '../store/store';
import CartItem from '../components/CartItem';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(fetchCartStart());
  }, [dispatch]);

  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (loading && items.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Корзина
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {items.length === 0 ? (
        <Typography variant="h6">Корзина пуста</Typography>
      ) : (
        <>
          {items.map((item) => (
            <React.Fragment key={item.id}>
              <CartItem item={item} />
              <Divider sx={{ my: 2 }} />
            </React.Fragment>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mb: 2 }}>
            <Typography variant="h6">Общая сумма:</Typography>
            <Typography variant="h6">{totalAmount} сум</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => dispatch(clearCartStart())}
            >
              Очистить
            </Button>
            <Button component={Link} to="/payment" variant="contained" color="primary">
              Перейти к оплате
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
