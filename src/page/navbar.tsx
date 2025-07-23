import { Box, Typography, CardMedia } from '@mui/material'
import { Link } from 'react-router-dom'
import AbstractDesign from '/src/assets/AbstractDesign.svg'
import Theme from '../components/theme'
import Auth from '../components/auth'

function Navbar() {

    return (
        <Box sx={{
            position: 'relative',
            height: '81px',
            width: '100%',
            background: 'var(--background-color)',

        }}>
            <Box className='navbar' sx={{
                background: 'var(--background-color)',
                position: 'fixed',
                width: '100%',
                zIndex: '100',
                height: '81px',
            }}>
                <CardMedia component='img' image={AbstractDesign} alt="" sx={{
                    width: '100%',
                    position: 'absolute',
                    top: 0,
                    objectFit: 'cover',
                    borderBottom: '1px solid',
                    height: {
                        xs: '67px',
                        md: '81px'
                    },
                }} />
                <Box sx={{
                    zIndex: 4,
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '16px 56px',
                    gap: 1,
                    justifyContent: 'space-between',
                }}>
                    <Typography component={Link} to={'/'} variant='h1' sx={{
                        fontSize: '48px',
                        color: 'var(--text-color)',
                        zIndex: 3,
                        fontWeight: 'bold'

                    }}>Globus Market</Typography>

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}>
                        <Auth />
                        <Theme />
                    </Box>
                </Box>

            </Box >
        </Box >
    )
}

export default Navbar
