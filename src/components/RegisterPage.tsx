import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { registerStart } from '../features/auth/authSlice';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { RegisterPayload } from '../features/auth/authServices';
import { StyledTextField } from './Login';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { registering, registerError, userId } = useSelector((s: RootState) => s.auth);

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
    dispatch(registerStart(form));
    localStorage.setItem('registered_phone', form.phone);
  };

  useEffect(() => {
    if (userId) {
      navigate('/verify-otp');
    }
  }, [userId, navigate]);
 

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{
      maxWidth: 400, mx: 'auto',
      mt: 4,
      p:'40px 30px ',
      borderRadius:'5px',
      background:'var(--main-background-color)'
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

      <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit" disabled={registering}>
        {registering ? 'Signing up…' : 'Sign Up'}
      </Button>

      <Snackbar open={!!registerError} autoHideDuration={6000}>
        <Alert severity="error" sx={{ width: '100%' }}>{registerError}</Alert>
      </Snackbar>
    </Box>
  );
}
