import React, { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, CardMedia, CircularProgress,
  Container, InputAdornment, Menu, MenuItem, Pagination, Snackbar, TextField, Typography
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchProductsStart, setCategoryId, setOffset, setSearchQuery, } from '../features/product/productSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Category, Product, fetchCategories } from '../features/product/fetchProducts';
import { addItemStart, fetchCartStart, updateItemStart } from '../features/cart/cartSlice';
import SearchIcon from '@mui/icons-material/Search';

export default function ProductPage() {
  const dispatch = useDispatch();
  const { items, offset, limit, total, categoryId, loading, searchQuery } = useSelector((s: RootState) => s.products);
  const cart = useSelector((s: RootState) => s.cart.items)

  const accessToken = useSelector((s: RootState) => s.auth.accessToken);
  const navigate = useNavigate(); 

  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearchQuery(search));
    }, 300);
    return () => clearTimeout(handler);
  }, [search, dispatch]);

  useEffect(() => {
    dispatch(fetchProductsStart());
    dispatch(fetchCartStart());
    fetchCategories()
      .then((res) => setCategories(res))
      .catch((err) => console.error(err));
  }, [dispatch, offset, searchQuery, categoryId]);

  const handleAddToCart = (product: Product) => {
    if (!accessToken) {
      navigate('/login');
      return;
    }
    const existing = cart.find((i) => i.product.id === product.id);
    const newQuantity = existing ? existing.quantity + 1 : 1;

    if (newQuantity > product.amount) {
      setSnackbarMsg(`Доступно только ${product.amount} шт.`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    if (existing) {
      dispatch(updateItemStart({ id: existing.id, product: existing.product.id, quantity: existing.quantity + 1 }));
      setSnackbarMsg('Количество в корзине увеличено');
    }
    else {
      dispatch(addItemStart({ product: product.id, quantity: 1 }))
      setSnackbarMsg('Товар добавлен в корзину');
    }
    setSnackbarSeverity('success');
    setSnackbarOpen(true)
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setOffset((page - 1) * limit));
  };

  const handleCategorySelect = (id: number | null) => {
    dispatch(setCategoryId(id));
    dispatch(setOffset(0));
    dispatch(fetchProductsStart());
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (

    <Container sx={{
      pt: 4,
      pb: 4,
      background: 'var(--background-color)'
    }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1', minWidth: 300 }}>
          <Box sx={{
            marginBottom: '30px',
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <TextField
              fullWidth

              variant="outlined"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}

              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                style: {
                  borderRadius: '10px',
                  width: '450px'
                },
              }}
            />
            <Button
              variant="outlined"
              onMouseEnter={handleMenuOpen}
              onClick={handleMenuOpen}
              aria-controls={menuOpen ? 'category-menu' : undefined}
              aria-haspopup="true"
              id="category-button"
              sx={{
                width: '260px',
              }}
            >
              {categoryId === null ? 'Categories' : categories.find(c => c.id === categoryId)?.name}
            </Button>
            <Menu
              id="category-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              disableScrollLock
              slotProps={{
                paper: {
                  onMouseLeave: () => setAnchorEl(null),
                  sx: {
                    maxHeight: 300,
                    backgroundColor: 'var(--background-color)',
                    color: 'var(--text-color)',
                  },
                },
              }}

            >
              <MenuItem selected={categoryId === null} onClick={() => handleCategorySelect(null)}>
                All
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem
                  key={cat.id}
                  selected={categoryId === cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                >
                  {cat.name}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {loading && items.length === 0 ? (
            <Box display="flex" justifyContent="center" sx={{ my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {items.map((product: Product) => (
                <Card key={product.id} component={Link} to={`/product/${product.id}`}
                  sx={{
                    width: 275,
                    background: 'var(--background-color)',
                    border: '1px solid var(--border-color)'
                  }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={product.images[0]?.image}
                    alt={product.name}
                  />
                  <CardContent sx={{
                    alignItems: 'baseline',
                    color: 'var(--text-color)'
                  }}>
                    <Typography variant="h6" sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 3
                    }}>
                      {product.name}
                    </Typography>
                    <Box>
                      <Typography variant="body2" >
                        {product.price} сум
                      </Typography>
                      <Button onClick={(e) => { e.preventDefault(), handleAddToCart(product) }} fullWidth variant="contained" size="small" sx={{
                        mt: 1,
                        backgroundColor: 'var(--button-background-color)'
                      }}>
                        В корзину
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'var(--text-color)',
                  borderColor: 'var(--border-color)',
                },
                '& .Mui-selected': {
                  background: 'var(--button-background-color)',
                  color: '#fff',
                },
              }}
            />
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}>
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: '100%', zIndex: 5 }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
