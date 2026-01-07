import { useMemo } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Divider,
  Chip,
  Link,
  Avatar,
  Skeleton,
  Stepper,
  Step,
  StepLabel,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PaymentsIcon from "@mui/icons-material/Payments";
import { useGetOrders } from "../hooks/useOrder";
import { Order } from "../utilis/orderTypes";

export default function MyOrdersPage() {
  const { data: orders = [], isLoading, isError, error } = useGetOrders();

  const formatCurrency = useMemo(
    () => (amount: number) => new Intl.NumberFormat("ru-RU").format(amount) + " сум",
    []
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ожидает подтверждения":
        return "warning";
      case "Доставлен":
        return "success";
      case "Отменен":
        return "error";
      default:
        return "default";
    }
  };

  const getSteps = (status: string) => {
    if (status === "Ожидает подтверждения") return ["Принят", "В обработке", "Завершен"];
    if (status === "Доставлен") return ["Принят", "В пути", "Доставлен"];
    if (status === "Отменен") return ["Принят", "Отменен"];
    return ["Принят"];
  };

  const getActiveStep = (status: string) => {
    switch (status) {
      case "Ожидает подтверждения":
        return 1;
      case "Доставлен":
        return 2;
      case "Отменен":
        return 1;
      default:
        return 0;
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: 2, mb: 2 }} />
        ))}
      </Container>
    );
  }

  if (isError) {
    const msg = (error as Error | null)?.message ?? "Ошибка загрузки заказов";
    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Typography color="error" align="center">
          {msg}
        </Typography>
      </Container>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Typography align="center">У вас нет заказов.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Мои заказы
      </Typography>

      <Stack spacing={3}>
        {orders.map((order: Order) => (
          <Accordion
            key={order.order_number}
            sx={{
              borderRadius: "16px !important",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              "&:before": { display: "none" },
              transition: "0.3s",
              "&:hover": { boxShadow: "0 8px 18px rgba(0,0,0,0.08)" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
              sx={{
                background: "linear-gradient(90deg, #1976d2, #2196f3)",
                color: "#fff",
                px: 3,
                py: 2,
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight={700}>
                  Заказ №{order.order_number}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {order.created_at ? new Date(order.created_at).toLocaleString() : "-"}
                </Typography>
              </Box>
              <Chip
                label={order.status}
                color={getStatusColor(order.status)}
                sx={{ fontWeight: 600, bgcolor: "rgba(255,255,255,0.2)" }}
              />
            </AccordionSummary>

            <AccordionDetails sx={{ background: "var(--main-background-color)" }}>
              {/* Stepper */}
              <Box sx={{ p: 2 }}>
                <Stepper activeStep={getActiveStep(order.status)} alternativeLabel>
                  {getSteps(order.status).map((label, index) => (
                    <Step key={index}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              {/* Details grid */}
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                }}
              >
                <Card sx={{ borderRadius: 3, background: "var(--background-color)", color: "var(--text-color)" }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      <ListAltIcon color="primary" />
                      <Typography variant="h6">Детали заказа</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Typography>Итоговая сумма: {formatCurrency(order.total_amount)}</Typography>
                    <Typography>Использован кэшбэк: {formatCurrency(order.cashback_used)}</Typography>
                    <Typography>Начислен кэшбэк: {formatCurrency(order.cashback_earned)}</Typography>
                    <Typography>
                      Способ оплаты: {order.payment_type === 1 ? "Онлайн картой" : "Наличными/картой"}
                    </Typography>
                    <Typography>Доставка: {order.delivery_type === 1 ? "Самовывоз" : "Курьер"}</Typography>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 3, background: "var(--background-color)", color: "var(--text-color)" }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PersonIcon color="primary" />
                      <Typography variant="h6">Получатель</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Typography>Имя: {order.receiver.first_name}</Typography>
                    <Typography>Фамилия: {order.receiver.last_name}</Typography>
                    <Typography>Телефон: {order.receiver.phone}</Typography>
                    {order.receiver.address && <Typography>Адрес: {order.receiver.address}</Typography>}
                  </CardContent>
                </Card>
              </Box>

              {/* Items */}
              <Card sx={{ borderRadius: 3, mt: 2, background: "var(--background-color)", color: "var(--text-color)" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <ShoppingBagIcon color="primary" />
                    <Typography variant="h6">Товары</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  {order.items.map((item, idx) => (
                    <Box
                      key={`${order.order_number}-${idx}`}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1.5,
                        borderBottom: idx < order.items.length - 1 ? "1px solid var(--border-color)" : "none",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.02)" },
                        transition: "0.2s",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar variant="rounded" sx={{ width: 56, height: 56 }} />
                        <Box>
                          <Typography fontWeight={600}>
                            {item.product_name} ×{item.quantity}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography fontWeight={600}>{formatCurrency(item.total_price)}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>

              {/* Payments */}
              <Card sx={{ borderRadius: 3, mt: 2, background: "var(--background-color)", color: "var(--text-color)" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PaymentsIcon color="primary" />
                    <Typography variant="h6">Платежи</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />

                  {order.cash_payments?.length > 0 && (
                    <>
                      <Typography variant="body2" fontWeight={600} mt={1}>
                        Оплата наличными:
                      </Typography>
                      {order.cash_payments.map((pmt, i) => (
                        <Typography key={i} variant="body2">
                          {new Date(pmt.created_at).toLocaleString()} — {formatCurrency(Number(pmt.amount))}
                        </Typography>
                      ))}
                    </>
                  )}

                  {order.online_payments?.length > 0 && (
                    <>
                      <Typography variant="body2" fontWeight={600} mt={2}>
                        Онлайн оплата:
                      </Typography>
                      {order.online_payments.map((pmt, i) => (
                        <Box key={i} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                          <Typography variant="body2">
                            {pmt.perform_time ? new Date(pmt.perform_time).toLocaleString() : "-"} —{" "}
                            {formatCurrency(pmt.amount)}
                          </Typography>
                          {pmt.qr_code_url && (
                            <Link href={pmt.qr_code_url} target="_blank" rel="noopener" sx={{ ml: 2 }}>
                              QR-код
                            </Link>
                          )}
                        </Box>
                      ))}
                    </>
                  )}
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Container>
  );
}
