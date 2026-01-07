import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Snackbar,
  Typography,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Product } from '../services/productService';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useProduct, useProducts } from '../hooks/useProducts';
import { useAddCartItem, useCart, useUpdateCartItem } from '../hooks/useCart';
import { useGetMe } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import {  useCategory } from '../hooks/useCategories';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: cartItems = [] } = useCart();
  const { data: user } = useGetMe();
  const addMutation = useAddCartItem();
  const updateMutation = useUpdateCartItem();

  const { data: product, isLoading: productLoading } = useProduct(
    id ? Number(id) : undefined
  );
  const { data: products, isLoading: productsLoading, } = useProducts({ category: product?.category });
  console.log(product);
  const { data: category } = useCategory(product?.category)

  const [selectedImage, setSelectedImage] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    // axios.get(`/products/${id}`).then((res) => {
    //   setProduct(res.data.data.items);
    //   setLoading(false);
    // });
  }, [id]);

  const handleAddToCart = (product: Product) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!user && !token) {
      navigate("/login");
      return;
    }
    const existing = cartItems.find((i) => i.product.id === product.id);
    const newQuantity = existing ? existing.quantity + 1 : 1;

    if (newQuantity > product.amount) {
      setSnackbarMsg(`Faqat ${product.amount} dona mavjud`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    if (existing) {
      updateMutation.mutate(
        { id: existing.id, product: existing.product.id, quantity: newQuantity },
        {
          onSuccess: () => {
            setSnackbarMsg("Mahsulot soni savatda oshirildi");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
          },
          onError: () => {
            setSnackbarMsg("Savatni yangilashda xatolik");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
          },
        }
      );
    } else {
      addMutation.mutate(
        { productId: product.id, quantity: 1 },
        {
          onSuccess: () => {
            setSnackbarMsg("Mahsulot savatga qo‘shildi");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
          },
          onError: () => {
            setSnackbarMsg("Savatga qo‘shishda xatolik");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
          },
        }
      );
    };
  }

  if (productLoading) {
    return (
      <Box textAlign="center" mt={10} display="flex" flexDirection="column" alignItems="center">
        <CircularProgress />
        <Typography mt={2}>Yuklanmoqda...</Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography>Mahsulot topilmadi</Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ py: 5 }}>
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          p: 4,
          gap: 4,
          borderRadius: 3,
          bgcolor: 'var(--main-background-color)',
          color: 'var(--text-color)',
        }}
      >
        {/* Thumbnail */}
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
                border: i === selectedImage ? '2px solid var(--button-background-color)' : '1px solid #ccc',
                boxShadow: i === selectedImage ? '0 0 10px rgba(0,0,0,0.3)' : 'none',
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                },
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              startIcon={<ArrowBackIosIcon />}
              onClick={() => navigate(-1)}
              sx={{
                mb: 2,
                color: 'gray',
                border: '1px solid',
                padding: '7px 15px',
                background: 'var(--background-color)',
                borderRadius: '20px',
                textTransform: 'none',
              }}
            >
              Orqaga
            </Button>
          </Box>

          <Typography variant="h4" fontWeight="bold" mb={2}>
            {product.name}
          </Typography>

          <Chip
            label={category?.name}
            sx={{ mb: 3, color: 'var(--text-color)', fontWeight: '500' }}
            variant="outlined"
          />

          <Typography variant="body1" mb={3} sx={{ color: 'gray' }}>
            {product.description}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight="bold">
              {product.price.toLocaleString('uz-UZ')} so‘m
            </Typography>

            <Button
              onClick={() => handleAddToCart(product)}
              size="large"
              variant="contained"
              disabled={product.amount === 0}
              sx={{
                background: product.amount === 0
                  ? 'gray'
                  : 'linear-gradient(135deg, var(--button-background-color), #42a5f5)',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: '12px',
              }}
            >
              {product.amount === 0 ? 'Sotuvda yo‘q' : 'Savatga qo‘shish'}
            </Button>
          </Box>
        </Box>
      </Paper>
      <Box mt={6}>
        <Typography variant="h5" mb={3} fontWeight="bold">
          Похожие товары
        </Typography>

        {productsLoading && <CircularProgress />}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 3,
          }}
        >
          {products?.items.map((product: any) => (
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
      </Box>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
