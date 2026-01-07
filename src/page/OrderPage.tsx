import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Snackbar,
  Typography,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import { StyledTextField } from "../components/Login"; 

import { useCart } from "../hooks/useCart";
import { useGetMe } from "../hooks/useAuth";
import {
  useCreateOrder,
  useCreateCard,
  useRequestSms,
  useVerifyAndPay,
} from "../hooks/useOrder";
import { useQueryClient } from "@tanstack/react-query";
import type { CreateOrderPayload } from "../utilis/orderTypes";

export default function OrderPage() {
  const qc = useQueryClient();

  const { data: cartItems = [] } = useCart();
  const { data: user, isLoading: userLoading } = useGetMe();

  const createOrder = useCreateOrder();
  const createCard = useCreateCard();
  const requestSms = useRequestSms();
  const verifyAndPay = useVerifyAndPay();

  const [step, setStep] = useState<"order" | "card" | "sms" | "done">("order");

  // form state
  const totalAmount = useMemo(
    () => cartItems.reduce((sum: number, i: any) => sum + i.product.price * i.quantity, 0),
    [cartItems]
  );

  const [form, setForm] = useState<CreateOrderPayload>({
    amount: 0,
    payment_type: 1,
    delivery_type: 1,
    use_cashback: false,
    receiver: {
      first_name: "",
      last_name: "",
      phone: "",
      longitude: 0,
      latitude: 0,
      address: "",
    },
    items: [],
  });

  const [card, setCard] = useState({ card_number: "", expire: "" });
  const [smsCode, setSmsCode] = useState("");

  // snackbars / errors
  const [emptyCartOpen, setEmptyCartOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // prefill form when user/cart available
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
          address: "",
        },
        items: cartItems.map((item: any) => ({
          product: item.product.id,
          price: item.product.price,
          quantity: item.quantity,
        })),
      });
    }
  }, [user, cartItems, totalAmount]);

  // user loading state
  if (userLoading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  // Advance step when createOrder succeeds
  useEffect(() => {
    if (createOrder.isSuccess) {
      // if online payment => go to card step, else mark done
      if (form.payment_type === 1) {
        setStep("card");
      } else {
        setStep("done");
        setSuccessOpen(true);
        qc.invalidateQueries({ queryKey: ["cart"] });
      }
    }
    if (createOrder.isError) {
      setErrorMsg((createOrder.error as Error)?.message ?? "Ошибка создания заказа");
    }
  }, [createOrder.isSuccess, createOrder.isError]);

  // when createCard success -> move to sms
  useEffect(() => {
    if (createCard.isSuccess) setStep("sms");
    if (createCard.isError) setErrorMsg((createCard.error as Error)?.message ?? "Ошибка создания карты");
  }, [createCard.isSuccess, createCard.isError]);

  // requestSms error
  useEffect(() => {
    if (requestSms.isError) setErrorMsg((requestSms.error as Error)?.message ?? "Ошибка отправки SMS");
  }, [requestSms.isError]);

  // when verifyAndPay success -> done
  useEffect(() => {
    if (verifyAndPay.isSuccess) {
      setStep("done");
      setSuccessOpen(true);
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
    }
    if (verifyAndPay.isError) setErrorMsg((verifyAndPay.error as Error)?.message ?? "Ошибка оплаты");
  }, [verifyAndPay.isSuccess, verifyAndPay.isError]);

  const handleCreateOrder = () => {
    if (!cartItems || cartItems.length === 0) {
      setEmptyCartOpen(true);
      return;
    }
    if (form.delivery_type === 2 && !form.receiver.address) {
      setErrorMsg("Адрес обязателен для курьерской доставки");
      return;
    }
    createOrder.mutate(form);
  };

  const handleCreateCard = () => {
    createCard.mutate({ card_number: card.card_number, expire: card.expire });
  };

  const handleRequestSms = () => {
    const current = qc.getQueryData<any>(["order", "current"]);
    const token = current?.cardToken ?? current?.card_token ?? null;
    if (!token) {
      setErrorMsg("Нет токена карты");
      return;
    }
    requestSms.mutate(token);
  };

  const handleVerifyAndPay = () => {
    const current = qc.getQueryData<any>(["order", "current"]);
    const token = current?.cardToken ?? current?.card_token ?? null;
    const invoiceId = current?.invoiceId ?? current?.invoice_id ?? null;
    console.log(current);

    if (!token || !invoiceId) {
      setErrorMsg("Нет данных для оплаты");
      return;
    }
    verifyAndPay.mutate({ token, code: smsCode, invoiceId });
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        maxWidth: 360,
        mx: "auto",
        mt: 8,
        px: 3,
        py: 6,
        boxShadow: 1,
        borderRadius: 2,
        background: "var(--main-background-color)",
      }}
    >
      <Button variant="text" onClick={() => setStep("order")}>
        ← Назад
      </Button>

      {step === "order" && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Оформление заказа
          </Typography>

          {cartItems.map((item: any) => (
            <Box key={item.id} sx={{ mb: 1 }}>
              <Typography>{item.product.name}</Typography>
              <Typography variant="body2">
                {item.product.price} сум × {item.quantity} = {item.product.price * item.quantity} сум
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
            onClick={handleCreateOrder}
            disabled={createOrder.isPending}
          >
            {createOrder.isPending ? "Создание..." : "Подтвердить заказ"}
          </Button>
        </Box>
      )}

      {form.payment_type === 1 && step === "card" && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">💳 Оплата картой</Typography>

          <StyledTextField
            label="Номер карты"
            fullWidth
            margin="normal"
            value={card.card_number}
            onChange={(e) => setCard({ ...card, card_number: e.target.value })}
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
            onClick={handleCreateCard}
            disabled={createCard.isPending}
          >
            {createCard.isPending ? "Отправка..." : "📩 Запросить SMS код"}
          </Button>
        </Box>
      )}

      {step === "sms" && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">📱 Введите SMS код</Typography>
          <StyledTextField label="SMS код" fullWidth margin="normal" value={smsCode} onChange={(e) => setSmsCode(e.target.value)} />

          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleVerifyAndPay} disabled={verifyAndPay.isPending}>
            {verifyAndPay.isPending ? "Пожалуйста..." : "💰 Оплатить"}
          </Button>

          <Button fullWidth variant="text" sx={{ mt: 1 }} onClick={handleRequestSms} disabled={requestSms.isPending}>
            {requestSms.isPending ? "Отправка..." : "Отправить SMS снова"}
          </Button>
        </Box>
      )}

      {step === "done" && (
        <Typography variant="h5" color="green" sx={{ mt: 4 }}>
          ✅ Оплата прошла успешно!
        </Typography>
      )}

      {/* Snackbars */}
      <Snackbar open={emptyCartOpen} autoHideDuration={3000} onClose={() => setEmptyCartOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="warning" onClose={() => setEmptyCartOpen(false)} sx={{ width: "100%" }}>
          Корзина пуста!
        </Alert>
      </Snackbar>

      <Snackbar open={successOpen} autoHideDuration={3000} onClose={() => setSuccessOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" onClose={() => setSuccessOpen(false)} sx={{ width: "100%" }}>
          Заказ успешно оформлен!
        </Alert>
      </Snackbar>

      <Snackbar open={!!errorMsg} autoHideDuration={5000} onClose={() => setErrorMsg(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="error" onClose={() => setErrorMsg(null)} sx={{ width: "100%" }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
