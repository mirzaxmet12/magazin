import React, { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, CardMedia, CircularProgress,
  Container, Divider, Drawer, IconButton, InputAdornment, List, ListItemButton, ListItemText,
  Pagination, Snackbar, TextField, Typography
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from 'react-router-dom';

import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useCart, useAddCartItem, useUpdateCartItem } from '../hooks/useCart';
import { Category } from '../services/categoryService';

function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function ProductPage() {
  const navigate = useNavigate();

  const [offset, setOffset] = useState(0);
  const [limit] = useState(20);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  // drawer + snackbar UI
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // React Query hooks
  const { data: productsData, isLoading: productsLoading, isFetching: productsFetching, refetch: refetchProducts } =
    useProducts({ offset, limit, search: debouncedSearch, category: categoryId });

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const { data: cartItems } = useCart();

  const addMutation = useAddCartItem();
  const updateMutation = useUpdateCartItem();

  const items = productsData?.items ?? [];
  const total = productsData?.total_records ?? 0;

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    setOffset(0);
  }, [debouncedSearch, categoryId]);

  // helper: get existing cart item by product id
  const findExisting = (productId: number) => {
    return (cartItems ?? []).find((i: any) => i.product?.id === productId);
  };

  const handleAddToCart = (product: any) => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    const existing = findExisting(product.id);
    const newQuantity = existing ? existing.quantity + 1 : 1;

    if (newQuantity > (product.amount ?? 0)) {
      setSnackbarMsg(`Доступно только ${product.amount ?? 0} шт.`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (existing) {
      updateMutation.mutate(
        { id: existing.id, product: existing.product.id, quantity: newQuantity },
        {
          onSuccess: () => {
            setSnackbarMsg('Количество в корзине увеличено');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
          },
          onError: (err: any) => {
            setSnackbarMsg((err?.message) || 'Ошибка обновления корзины');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
          }
        }
      );
    } else {
      addMutation.mutate(
        { productId: product.id, quantity: 1 },
        {
          onSuccess: () => {
            setSnackbarMsg('Товар добавлен в корзину');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
          },
          onError: (err: any) => {
            setSnackbarMsg((err?.message) || 'Ошибка добавления в корзину');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
          }
        }
      );
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setOffset((page - 1) * limit);
  };

  const handleCategorySelect = (id: number | null) => {
    setCategoryId(id);
    setCategoryDrawerOpen(false);
  };

  return (
    <Container sx={{ pt: 4, pb: 4 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1', minWidth: 300 }}>
          {/* Search + Category button */}
          <Box sx={{ mb: '30px', display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgb(243 243 243)' }} />
                  </InputAdornment>
                ),
                style: {
                  borderRadius: '10px',
                  width: '100%',
                },
              }}
            />

            <Button
              variant="outlined"
              onClick={() => setCategoryDrawerOpen(true)}
              sx={{
                width: 200,
                borderRadius: "12px",
                borderColor: "var(--border-color, #444)",
                color: "var(--text-color, #fff)",
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              {categoryId === null ? "Categories" : (categories ?? []).find(c => c.id === categoryId)?.name}
            </Button>
          </Box>

          {/* Categories Drawer */}
          <Drawer
            anchor="right"
            open={categoryDrawerOpen}
            onClose={() => setCategoryDrawerOpen(false)}
            slotProps={{
              paper: {
                sx: {
                  width: 300,
                  backgroundColor: "var(--background-color, #121212)",
                  color: "var(--text-color, #fff)",
                  p: 2,
                },
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                Categories
              </Typography>
              <IconButton onClick={() => setCategoryDrawerOpen(false)} size="small">
                <CloseIcon sx={{ color: "var(--text-color, #fff)" }} />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2, borderColor: "var(--border-color, #444)" }} />

            <List sx={{ p: 0 }}>
              <ListItemButton
                selected={categoryId === null}
                onClick={() => handleCategorySelect(null)}
                sx={{
                  borderRadius: "8px",
                  mb: 1,
                  "&.Mui-selected": {
                    backgroundColor: "var(--button-background-color, #1976d2)",
                    color: "#fff",
                  },
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" },
                }}
              >
                <ListItemText primary="All" />
              </ListItemButton>

              {categories?.map((cat:Category) => (
                <ListItemButton
                  key={cat.id}
                  selected={categoryId === cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  sx={{
                    borderRadius: "8px",
                    mb: 1,
                    "&.Mui-selected": {
                      backgroundColor: "var(--button-background-color, #1976d2)",
                      color: "#fff",
                    },
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" },
                  }}
                >
                  <ListItemText primary={cat.name} />
                </ListItemButton>
              ))}
            </List>
          </Drawer>

          {/* Product Grid */}
          {(productsLoading && items.length === 0) ? (
            <Box display="flex" justifyContent="center" sx={{ my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 3
              }}
            >
              {items.map((product: any) => (
                <Card
                  key={product.id}
                  component={Link}
                  to={`/product/${product.id}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'var(--background-color, #121212)',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid var(--border-color, #444)',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.images?.[0]?.image}
                    alt={product.name}
                    sx={{
                      height: 200,
                      objectFit: 'cover',
                      backgroundColor: '#f5f5f5'
                    }}
                  />
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: 'var(--text-color)',
                        fontWeight: 600,
                        mb: 0.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '48px',
                      }}
                    >
                      {product.name}
                    </Typography>
                    {product.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'var(--muted-text-color, #aaa)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: '36px',
                          mb: 1
                        }}
                      >
                        {product.description}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--text-color, #fff)' }}>
                        {product.price} сум
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: 'var(--button-background-color, #1976d2)',
                          textTransform: 'none',
                          px: 2,
                          py: 0.5,
                          borderRadius: '8px',
                          fontWeight: 500,
                          '&:hover': { backgroundColor: 'var(--button-hover-color, #1565c0)' }
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                      >
                        В корзину
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {/* Pagination */}
          <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'var(--text-color, #fff)',
                  borderColor: 'var(--border-color, #444)',
                },
                '& .Mui-selected': {
                  background: 'var(--button-background-color, #1976d2)',
                  color: '#fff',
                },
              }}
            />
            {productsFetching && <CircularProgress size={20} sx={{ ml: 2 }} />}
          </Box>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: '100%', zIndex: 5 }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
