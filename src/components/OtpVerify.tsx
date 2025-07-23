import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Snackbar, Alert
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { verifyStart } from '../features/auth/authSlice';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { StyledTextField } from './Login';

export default function OtpVerifyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { verifying, verifyError, accessToken } = useSelector((s: RootState) => s.auth);
  const [otp, setOtp] = useState('');

  const phone = localStorage.getItem('registered_phone');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone) {
      dispatch(verifyStart({ phone, otp }));
    }
  };

  useEffect(() => {
    if (accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

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
      <Button type="submit" fullWidth variant="contained" disabled={verifying} sx={{
        mt: 2,
        background: 'var(--button-background-color)'
      }} >
        {verifying ? 'Verifying...' : 'Verify'}
      </Button>

      <Snackbar open={!!verifyError} autoHideDuration={6000}>
        <Alert severity="error" sx={{ width: '100%' }}>{verifyError}</Alert>
      </Snackbar>
    </Box>
  );
}
