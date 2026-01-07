import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RegisterPayload } from '../services/authService';
import { StyledTextField } from './Login';
import { useRegister } from '../hooks/useAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();
  const [openError, setOpenError] = useState<string | null>(null);


  const [form, setForm] = useState<RegisterPayload>({
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    date_of_birth: '',
    gender: 'male',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate(form, {
      onSuccess: (_data) => {
        // store phone for OTP verification step
        localStorage.setItem("registered_phone", form.phone);
        navigate("/verify-otp");
      },
      onError: (err: any) => {
        // show API error
        const msg = err?.response?.data?.errorMessage ?? err?.message ?? "Ошибка регистрации";
        setOpenError(msg);
      },
    });
  };

  useEffect(() => {
    if ((register.error as any)?.message && !openError) {
      setOpenError((register.error as any).message);
    }
  }, [register.error]);
  
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{
      maxWidth: 400, mx: 'auto',
      mt: 4,
      p: '40px 30px ',
      borderRadius: '5px',
      background: 'var(--main-background-color)'
    }}>
      <Typography variant="h5" mb={2}>Create Account</Typography>
      <StyledTextField label="First Name" name="first_name" fullWidth required margin="normal" onChange={handleChange} />
      <StyledTextField label="Last Name" name="last_name" fullWidth required margin="normal" onChange={handleChange} />
      <StyledTextField label="Phone" name="phone" fullWidth required margin="normal" placeholder='998901234567' onChange={handleChange} />
      <StyledTextField label="Password" name="password" type="password" fullWidth required margin="normal" onChange={handleChange} />
      <StyledTextField label="Date of Birth" name="date_of_birth" type="date" fullWidth required margin="normal" onChange={handleChange} InputLabelProps={{ shrink: true }} />
      <StyledTextField label="Gender" name="gender" fullWidth required select SelectProps={{ native: true }} margin="normal" onChange={handleChange}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </StyledTextField>

      <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit" disabled={register.isPending}>
        {register.isPending ? 'Signing up…' : 'Sign Up'}
      </Button>

      <Snackbar open={!!openError} autoHideDuration={6000}>
        <Alert severity="error" sx={{ width: '100%' }}>{openError}</Alert>
      </Snackbar>
    </Box>
  );
}
