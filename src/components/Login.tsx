import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Link as MuiLink,
  styled,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart } from '../features/auth/authSlice';
import { RootState } from '../store/store';

export const StyledTextField = styled(TextField)(() => ({
  '& .MuiInputBase-input': {
    background: 'var(--background-color)',
    color: 'var(--text-color)',
  },
  '& .MuiInputBase-input::placeholder': {
    color: 'gray',
    opacity: 1,
  },
  '& .MuiInputLabel-root': {
    color: 'var(--text-color)',
  },
}))
export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logging, loginError, accessToken } = useSelector((s: RootState) => s.auth);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart({ phone, password }));
  };
  console.log(accessToken);

  useEffect(() => {
    if (accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);


  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 360,
        mx: 'auto',
        mt: 8,
        px: 3,
        py:6,
        boxShadow: 1,
        borderRadius: 2,
        background: 'var(--main-background-color)'
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        С возвращением
      </Typography>

      <StyledTextField
        label="Телефон"
        name="phone"
        fullWidth
        required
        margin="normal"
        placeholder='998901234567'
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <StyledTextField
        label="Пароль"
        name="password"
        type="password"
        fullWidth
        required
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}

      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={logging}
        sx={{
          mt: 2,
          background: 'var(--button-background-color)'
        }}
      >
        {logging ? 'Войти...' : 'Войти'}
      </Button>

      <Box textAlign="center" sx={{ mt: 2 }}>
        <Typography variant="body2">
        Нет аккаунта?{' '}
          <MuiLink component={Link} to="/signUp">
            Зарегистрироваться
          </MuiLink>
        </Typography>
      </Box>

      <Snackbar open={!!loginError} autoHideDuration={6000}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {loginError}
        </Alert>
      </Snackbar>
    </Box>
  );
}
