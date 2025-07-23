import {
  Box,
  Button,
  Container,
  MenuItem,
  Snackbar,
  Typography,
  Divider,
  Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  createOrderStart,
  createCardStart,
  requestSmsStart,
  paymentStart,
  prevStep,
  paymentSuccess,
} from '../features/order/orderSlice';
import { CreateOrderPayload } from '../features/order/orderTypes';
import { RootState } from '../store/store';
import { fetchCartStart } from '../features/cart/cartSlice';
import { getMeStart } from '../features/auth/authSlice';
import { StyledTextField } from '../components/Login';

export default function OrderPage() {
  const dispatch = useDispatch();
  const { step } = useSelector((s: RootState) => s.order);
  const cartItems = useSelector((s: RootState) => s.cart.items);
  const user = useSelector((s: RootState) => s.auth.user);
  const totalAmount = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  // Form state
  const [form, setForm] = useState<CreateOrderPayload>({
    amount: 0,
    payment_type: 1,
    delivery_type: 1,
    use_cashback: false,
    receiver: {
      first_name: '',
      last_name: '',
      phone: '',
      longitude: 0,
      latitude: 0,
      address: '',
    },
    items: [],
  });

  // Card + SMS
  const [card, setCard] = useState({ card_number: '', expire: '' });
  const [smsCode, setSmsCode] = useState('');

  // Snackbars
  const [emptyCartOpen, setEmptyCartOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  // Загрузка начальных данных
  useEffect(() => {
    dispatch(fetchCartStart());
    dispatch(getMeStart());
  }, [dispatch]);

  // Обновление формы при смене корзины или пользователя
  useEffect(() => {
    if (user && cartItems.length > 0) {
      setForm({
        amount: totalAmount,
        payment_type: 1,
        delivery_type: 1,
        use_cashback: false,
        receiver: {
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          longitude: 0,
          latitude: 0,
          address: '',
        },
        items: cartItems.map((item) => ({
          product: item.product.id,
          price: item.product.price,
          quantity: item.quantity,
        })),
      });
    }
  }, [user, cartItems, totalAmount]);

  // Открыть Snackbar "Оплата успешно" когда step переходит в done
  useEffect(() => {
    if (step === 'done') {
      setSuccessOpen(true);
    }
  }, [step]);

  const handleSubmit = () => {
    if (cartItems.length === 0) {
      setEmptyCartOpen(true);
      return;
    }
    if (form.delivery_type === 2 && !form.receiver.address) {
      alert('Адрес обязателен!');
      return;
    }
    dispatch(createOrderStart(form));
    if (form.payment_type === 2) {
      dispatch(paymentSuccess());
    }
  };

  const handleCard = () => {
    dispatch(createCardStart(card));
    dispatch(requestSmsStart());
  };

  const handlePayment = () => {
    dispatch(paymentStart(smsCode));
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        maxWidth: 360,
        mx: 'auto',
        mt: 8,
        px: 3,
        py: 6,
        boxShadow: 1,
        borderRadius: 2,
        background: 'var(--main-background-color)',
      }}
    >
      <Button variant="text" onClick={() => dispatch(prevStep())}>
        ← Назад
      </Button>

      {step === 'order' && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Оформление заказа
          </Typography>

          {cartItems.map((item) => (
            <Box key={item.id} sx={{ mb: 1 }}>
              <Typography>{item.product.name}</Typography>
              <Typography variant="body2">
                {item.product.price} сум × {item.quantity} ={' '}
                {item.product.price * item.quantity} сум
              </Typography>
              <Divider sx={{ my: 1 }} />
            </Box>
          ))}

          <Typography variant="h6">Итого: {totalAmount} сум</Typography>
          <Typography variant="h6">
            Адрес магазина: FJ65+C75, Нукус, Республика Каракалпакстан, Узбекистан
          </Typography>

          <StyledTextField
            label="Имя"
            fullWidth
            margin="normal"
            value={form.receiver.first_name}
            onChange={(e) =>
              setForm({
                ...form,
                receiver: { ...form.receiver, first_name: e.target.value },
              })
            }
          />
          <StyledTextField
            label="Фамилия"
            fullWidth
            margin="normal"
            value={form.receiver.last_name}
            onChange={(e) =>
              setForm({
                ...form,
                receiver: { ...form.receiver, last_name: e.target.value },
              })
            }
          />
          <StyledTextField
            label="Телефон"
            fullWidth
            margin="normal"
            value={form.receiver.phone}
            onChange={(e) =>
              setForm({
                ...form,
                receiver: { ...form.receiver, phone: e.target.value },
              })
            }
          />

          <StyledTextField
            label="Тип доставки"
            fullWidth
            select
            margin="normal"
            value={form.delivery_type}
            onChange={(e) =>
              setForm({
                ...form,
                delivery_type: +e.target.value as 1 | 2,
              })
            }
          >
            <MenuItem value={1}>Самовывоз</MenuItem>
            <MenuItem value={2}>Курьер</MenuItem>
          </StyledTextField>

          {form.delivery_type === 2 && (
            <StyledTextField
              label="Адрес"
              fullWidth
              margin="normal"
              required
              value={form.receiver.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  receiver: { ...form.receiver, address: e.target.value },
                })
              }
            />
          )}

          <StyledTextField
            label="Способ оплаты"
            fullWidth
            select
            margin="normal"
            value={form.payment_type}
            onChange={(e) =>
              setForm({
                ...form,
                payment_type: +e.target.value as 1 | 2,
              })
            }
          >
            <MenuItem value={1}>Онлайн</MenuItem>
            <MenuItem value={2}>Наличные / Карта</MenuItem>
          </StyledTextField>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleSubmit}
            disabled={cartItems.length === 0}
          >
            Подтвердить заказ
          </Button>
        </Box>
      )}

      {form.payment_type === 1 && step === 'card' && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">💳 Оплата картой</Typography>

          <StyledTextField
            label="Номер карты"
            fullWidth
            margin="normal"
            value={card.card_number}
            onChange={(e) =>
              setCard({ ...card, card_number: e.target.value })
            }
          />
          <StyledTextField
            label="Срок действия (MM/YY)"
            fullWidth
            margin="normal"
            value={card.expire}
            onChange={(e) => setCard({ ...card, expire: e.target.value })}
          />

          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={handleCard}
          >
            📩 Запросить SMS код
          </Button>
        </Box>
      )}

      {step === 'sms' && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">📱 Введите SMS код</Typography>
          <StyledTextField
            label="SMS код"
            fullWidth
            margin="normal"
            value={smsCode}
            onChange={(e) => setSmsCode(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handlePayment}
          >
            💰 Оплатить
          </Button>
        </Box>
      )}

      {step === 'done' && (
        <Typography variant="h5" color="green" sx={{ mt: 4 }}>
          ✅ Оплата прошла успешно!
        </Typography>
      )}

      {/* Snackbar: корзина пуста */}
      <Snackbar
        open={emptyCartOpen}
        autoHideDuration={3000}
        onClose={() => setEmptyCartOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="warning"
          onClose={() => setEmptyCartOpen(false)}
          sx={{ width: '100%' }}
        >
          Корзина пуста!
        </Alert>
      </Snackbar>

      {/* Snackbar: оплата успешна */}
      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          onClose={() => setSuccessOpen(false)}
          sx={{ width: '100%' }}
        >
          Заказ прошла успешно!
        </Alert>
      </Snackbar>
    </Container>
  );
}
