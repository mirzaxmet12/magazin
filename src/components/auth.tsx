import { Box, IconButton, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import { getMeStart, logout } from '../features/auth/authSlice';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useEffect } from 'react';

function Auth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { accessToken } = useSelector((s: RootState) => s.auth);
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        if (accessToken) {
            dispatch(getMeStart());
        }
    }, [accessToken])

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <Box sx={{
            display: 'flex',
            gap: '10px',
            zIndex: 3,
            alignItems: 'center',
            alignContent: 'center',
        }}>

            {accessToken ? (<> <IconButton onClick={handleLogout} color="inherit" title="Logout">
                <LogoutIcon />
            </IconButton>
                <Link to='/myorders' color='primary'>
                    <Typography variant='subtitle1' sx={{
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        color: 'var(--text-color)',
                        border: '1px solid var(--navbar-border-color)',
                        borderRadius: '5px',
                        background: 'var(--background-color)',
                        padding: '4px 10px',
                        gap: 1,

                    }}>
                        Мой заказ
                    </Typography>
                </Link>
                <Link to='/profile' color='primary'>
                    <Typography variant='subtitle1' sx={{
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        color: 'var(--text-color)',
                        border: '1px solid var(--navbar-border-color)',
                        borderRadius: '5px',
                        
                        background: 'var(--background-color)',
                        padding: '4px 10px',
                        gap: 1,

                    }}>
                        {user?.first_name}
                    </Typography>
                </Link>
                <Box component={Link} to='/cart'>
                    <ShoppingCartIcon sx={{ color: 'var(--text-color)' }} />
                </Box>
            </>) : (
                <>
                    <Link to='/login' color='primary'>
                        <Typography variant='subtitle1' sx={{
                            fontSize: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: 'bold',
                            color: 'var(--text-color)',
                            border: '1px solid var(--navbar-border-color)',
                            borderRadius: '5px',
                            background: 'var(--background-color)',
                            padding: '2px 4px',
                            gap: 1,

                        }}>
                            <LoginIcon />
                            Login</Typography></Link>

                    <Link to='/signUp' color='primary'>
                        <Typography variant='subtitle1' sx={{
                            display: 'flex',
                            fontSize: '20px',
                            background: 'var(--background-color)',
                            alignItems: 'center',
                            color: 'var(--text-color)',
                            fontWeight: 'bold',
                            border: '1px solid var(--navbar-border-color)',
                            padding: '2px 4px',
                            borderRadius: '5px',
                            gap: 1,

                        }}>
                            <PersonAddAltIcon />
                            Sign up</Typography>
                    </Link>
                </>
            )}

        </Box >
    )
}

export default Auth
