import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Divider,
  Paper,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import {
  useCart,
  useClearCart,
} from "../hooks/useCart";

export default function CartPage() {
  const { data: items = [], isLoading, isError, error } = useCart();
  const clear = useClearCart();

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error"
  >("success");

  const totalAmount = useMemo(
    () =>
      (items ?? []).reduce(
        (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
        0
      ),
    [items]
  );

  useEffect(() => {
    if (clear.isSuccess) {
      setSnackbarMsg("Корзина очищена");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else if (clear.isError) {
      setSnackbarMsg("Ошибка при очистке корзины");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [clear.isSuccess, clear.isError]);

  if (isLoading && (items?.length ?? 0) === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Fade in timeout={400}>
      <Box sx={{ maxWidth: 900, mx: "auto", my: 4, px: 2 }}>
        {/* Gradient Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 3,
            background:
              "linear-gradient(90deg, var(--button-background-color, #1976d2), #42a5f5)",
            p: 2,
            borderRadius: "12px",
            color: "#fff",
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
          }}
        >
          <ShoppingCartOutlinedIcon sx={{ fontSize: 36 }} />
          <Typography variant="h5" fontWeight={600}>
            Моя корзина
          </Typography>
        </Box>

        {isError && (
          <Typography color="error" sx={{ mb: 2 }}>
            {(error as any)?.message || "Ошибка загрузки корзины"}
          </Typography>
        )}

        {(items ?? []).length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: "center",
              backgroundColor: "var(--background-color, #121212)",
              borderRadius: "16px",
              border: "1px dashed var(--border-color, #444)",
            }}
          >
            <RemoveShoppingCartIcon
              sx={{
                fontSize: 64,
                color: "var(--muted-text-color, #aaa)",
                mb: 2,
              }}
            />
            <Typography
              variant="h6"
              sx={{ color: "var(--muted-text-color, #aaa)" }}
            >
              Ваша корзина пуста
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "var(--muted-text-color, #aaa)", mb: 3 }}
            >
              Добавьте товары из каталога
            </Typography>
            <Button
              component={Link}
              to="/"
              variant="contained"
              sx={{
                backgroundColor: "var(--button-background-color, #1976d2)",
                textTransform: "none",
                px: 3,
                py: 1.2,
                fontWeight: 500,
                borderRadius: "8px",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  backgroundColor: "var(--button-hover-color, #1565c0)",
                },
              }}
            >
              Перейти в каталог
            </Button>
          </Paper>
        ) : (
          <>
            {/* Cart Items */}
            <Paper
              elevation={0}
              sx={{
                backgroundColor: "var(--background-color, #121212)",
                borderRadius: "16px",
                border: "1px solid var(--border-color, #444)",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              {items.map((item, index) => (
                <React.Fragment key={item.id}>
                  <CartItem item={item} />
                  {index !== items.length - 1 && (
                    <Divider sx={{ borderColor: "var(--border-color, #444)" }} />
                  )}
                </React.Fragment>
              ))}
            </Paper>

            {/* Total */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
                mb: 2,
                p: 2,
                backdropFilter: "blur(8px)",
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border-color, #444)",
                borderRadius: "12px",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Общая сумма:
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "var(--button-background-color, #1976d2)" }}
              >
                {totalAmount.toLocaleString()} сум
              </Typography>
            </Box>

            {/* Actions */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setConfirmOpen(true)}
                sx={{
                  flex: 1,
                  borderColor: "var(--button-background-color, #1976d2)",
                  color: "var(--button-background-color, #1976d2)",
                  textTransform: "none",
                  borderRadius: "8px",
                  py: 1.2,
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.08)",
                  },
                }}
                disabled={clear.isPending}
              >
                Очистить
              </Button>
              <Button
                component={Link}
                to="/payment"
                variant="contained"
                sx={{
                  flex: 1,
                  backgroundColor: "var(--button-background-color, #1976d2)",
                  textTransform: "none",
                  borderRadius: "8px",
                  py: 1.2,
                  fontWeight: 500,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    backgroundColor: "var(--button-hover-color, #1565c0)",
                  },
                }}
              >
                Перейти к оплате
              </Button>
            </Box>

            {/* Confirm Dialog */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
              <DialogTitle>Очистить корзину?</DialogTitle>
              <DialogContent>
                <Typography>Вы уверены, что хотите удалить все товары из корзины?</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setConfirmOpen(false)}>Отмена</Button>
                <Button
                  onClick={() => {
                    clear.mutate();
                    setConfirmOpen(false);
                  }}
                  color="error"
                  variant="contained"
                >
                  Очистить
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2500}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            severity={snackbarSeverity}
            onClose={() => setSnackbarOpen(false)}
            sx={{ width: "100%", zIndex: 5 }}
          >
            {snackbarMsg}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
}
