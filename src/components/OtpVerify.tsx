import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { StyledTextField } from './Login';
import { useVerifyOtp } from '../hooks/useAuth';

export default function OtpVerifyPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const phone = localStorage.getItem('registered_phone');

  const {
    mutate,
    isPending,
    isError,
    error,
    isSuccess,
  } = useVerifyOtp();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    mutate({ phone, otp });
  };

  useEffect(() => {
    if (isSuccess) {
      navigate('/');
    }
  }, [isSuccess, navigate]);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{
      maxWidth: 400, mx: 'auto',
      mt: 4,
      p: '30px 20px',
      borderRadius: '5px',
      background: 'var(--main-background-color)'
    }}>
      <Typography variant="h5" mb={2}>Verify Phone Number</Typography>
      <StyledTextField
        label="Verification Code"
        fullWidth
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <Button type="submit" fullWidth variant="contained" disabled={isPending || otp.length < 4}
        sx={{
          mt: 2,
          background: 'var(--button-background-color)'
        }} >
        {isPending ? 'Verifying...' : 'Verify'}
      </Button>

      <Snackbar open={isError} autoHideDuration={6000}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {(error as any)?.response?.data?.message || 'OTP error'}
        </Alert>
      </Snackbar>
    </Box>
  );
}
