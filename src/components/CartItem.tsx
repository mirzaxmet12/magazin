// src/components/CartItem.tsx
import { useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  Typography,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MinimizeIcon from "@mui/icons-material/Minimize";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUpdateCartItem, useRemoveCartItem } from "../hooks/useCart";
import type { CartItem } from "../services/cartService";

interface Props {
  item: CartItem;
}

function CartItemComponent({ item }: Props) {
  const update = useUpdateCartItem();
  const remove = useRemoveCartItem();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error"
  >("success");

  const handleIncrease = () => {
    if (item.product.amount !== undefined && item.quantity + 1 > item.product.amount) {
      setSnackbarMsg(`Доступно только ${item.product.amount} шт.`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    update.mutate(
      { id: item.id, product: item.product.id, quantity: item.quantity + 1 },
      {
        onSuccess: () => {
          setSnackbarMsg("Количество товара обновлено");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        },
        onError: () => {
          setSnackbarMsg("Ошибка при обновлении");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        },
      }
    );
  };

  const handleDecrease = () => {
    if (item.quantity <= 1) return;

    update.mutate(
      { id: item.id, product: item.product.id, quantity: item.quantity - 1 },
      {
        onSuccess: () => {
          setSnackbarMsg("Количество товара обновлено");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        },
        onError: () => {
          setSnackbarMsg("Ошибка при обновлении");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        },
      }
    );
  };

  const handleRemove = () => {
    remove.mutate(item.id, {
      onSuccess: () => {
        setSnackbarMsg("Товар удален");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      },
      onError: () => {
        setSnackbarMsg("Ошибка при удалении");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      },
    });
  };

  return (
    <>
      <Card
        sx={{
          display: "flex",
          mb: 2,
          p: 1,
          alignItems: "center",
          boxShadow: "none",
          background: "var(--background-color)",
          border: "1px solid var(--border-color)",
        }}
      >
        <CardMedia
          component="img"
          image={item.product.images?.[0]?.image}
          alt={item.product.name}
          sx={{
            width: 80,
            height: 80,
            objectFit: "cover",
            borderRadius: 1,
            mr: 2,
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" color="var(--text-color)">
            {item.product.name}
          </Typography>
          <Typography color="var(--text-color)">
            {item.product.price} сум × {item.quantity} ={" "}
            {item.quantity * item.product.price} сум
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 1,
              gap: 1,
              color: "var(--text-color)",
            }}
          >
            <IconButton
              size="small"
              onClick={handleDecrease}
              disabled={item.quantity <= 1 || update.isPending}
              sx={{
                color: "gray",
                "&.Mui-disabled": {
                  color: "#999",
                },
              }}
            >
              <MinimizeIcon sx={{ mt: "-15px" }} />
            </IconButton>

            <Typography>{item.quantity}</Typography>

            <IconButton
              size="small"
              onClick={handleIncrease}
              disabled={
                (item.product.amount !== undefined &&
                  item.quantity >= item.product.amount) ||
                update.isPending
              }
              sx={{
                color: "gray",
                "&.Mui-disabled": {
                  color: "#999",
                },
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Box>

        <IconButton
          onClick={handleRemove}
          sx={{
            ml: 1,
            color: "gray",
          }}
          disabled={remove.isPending}
        >
          <DeleteIcon />
        </IconButton>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
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
    </>
  );
}

export default CartItemComponent;
