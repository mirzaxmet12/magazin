// src/pages/ProductDetailPage.tsx
import { Alert, Box, Button, Chip, Container, Paper, Snackbar, Typography, } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../service/axios';
import { Product } from '../features/product/fetchProducts';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { addItemStart, updateItemStart } from '../features/cart/cartSlice';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const cart = useSelector((s: RootState) => s.cart.items)
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  console.log(cart);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const accessToken = useSelector((s: RootState) => s.auth.accessToken);
  
  useEffect(() => {
    axios.get(`/products/${id}`).then((res) => {
      setProduct(res.data.data.items);
    });
  }, [id]);

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

  if (!product) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ py: 5, }}>
      <Paper
        elevation={1}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          p: 4,
          gap: 4,
          borderRadius: 3,
          color: 'var(--text-color)',
          bgcolor: 'var(--main-background-color)',
        }}
      >
        {/* Thumbnail Sidebar */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {product.images.map((img, i) => (
            <Box
              key={i}
              component="img"
              src={img.image}
              alt={`thumb-${i}`}
              onClick={() => setSelectedImage(i)}
              sx={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                borderRadius: 2,
                border: i === selectedImage
                  ? '2px solid var(--button-background-color)'
                  : '1px solid #ccc',                       
                cursor: 'pointer',
              }}
            />
          ))}
        </Box>

        <Box
          component="img"
          src={product.images[selectedImage]?.image}        
          alt={product.name}
          sx={{
            width: 400,
            height: 400,
            objectFit: 'contain',
            borderRadius: 3,
            flexShrink: 0,
          }}
        />

        <Box flex={1}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <Button
              startIcon={<ArrowBackIosIcon />}
              onClick={() => navigate(-1)}
              sx={{
                mb: 2,
                color: 'gray',
                border: '1px solid',
                padding: '7px 15px',
                background: 'var(--background-color)',
                borderRadius: '20px'
              }}
            >
              Back
            </Button>
          </Box>

          <Typography variant="h4" fontWeight="bold" mb={2}>
            {product.name}
          </Typography>

          <Chip
            label="Clothes"
            sx={{ mb: 3, color: 'var(--text-color)' }}
            variant="outlined"
            color="default"
          />

          <Typography variant="body1" mb={3} sx={{
            color: 'gray',
          }}>
            {product.description}
          </Typography>

          <Box sx={{
            display:'flex',
            justifyContent:'space-between',
            alignItems:'center'
          }}>

            
            <Typography variant="h5" fontWeight="bold">
              {product.price} сум
            </Typography>

            <Button onClick={() => handleAddToCart(product)} size="large" variant="contained" sx={{
              background: 'var(--button-background-color)'
            }}>
             В корзину
            </Button>
          </Box>
        </Box>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}>
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: '100%',zIndex:5 }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
