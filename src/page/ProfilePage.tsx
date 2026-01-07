import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Button,
  Fade,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  AccountCircle,
  Phone,
  Cake,
  Wc,
  Logout
} from '@mui/icons-material';
import { useGetMe, useLogout } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { data: user, isLoading } = useGetMe();
  const navigate = useNavigate();

  const handleLogout = () => {
    useLogout();
    navigate("/login");
  };
  if (isLoading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }
  if (!user) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6" color="text.secondary">
          Пользователь не найден
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={500}>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" px={2}>
        <Card
          sx={{
            width: 400,
            p: 3,
            boxShadow: 4,
            borderRadius: '16px',
            backgroundColor: 'var(--background-color, #121212)',
            color: 'var(--text-color, #fff)'
          }}
        >
          <Box display="flex" justifyContent="center" mb={2}>
            <Avatar
              sx={{
                width: 90,
                height: 90,
                bgcolor: 'var(--button-background-color, #1976d2)',
                backgroundImage: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                color: '#fff'
              }}
            >
              <AccountCircle sx={{ fontSize: 80 }} />
            </Avatar>
          </Box>

          <CardContent>
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <AccountCircle color="primary" />
                <Typography variant="body1">
                  <strong>Имя:</strong> {user.first_name} {user.last_name}
                </Typography>
              </Box>
              <Divider sx={{ borderColor: 'var(--border-color, #444)' }} />
              <Box display="flex" alignItems="center" gap={1}>
                <Phone color="success" />
                <Typography variant="body1">
                  <strong>Телефон:</strong> {user.phone}
                </Typography>
              </Box>
              <Divider sx={{ borderColor: 'var(--border-color, #444)' }} />
              <Box display="flex" alignItems="center" gap={1}>
                <Cake color="error" />
                <Typography variant="body1">
                  <strong>Дата рождения:</strong> {user.date_of_birth}
                </Typography>
              </Box>
              <Divider sx={{ borderColor: 'var(--border-color, #444)' }} />
              <Box display="flex" alignItems="center" gap={1}>
                <Wc color="secondary" />
                <Typography variant="body1">
                  <strong>Пол:</strong> {user.gender === 'male' ? 'Мужской' : 'Женский'}
                </Typography>
              </Box>
            </Stack>
          </CardContent>

          <Box mt={3} textAlign="center">
            <Button
              variant="contained"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                backgroundColor: 'var(--button-background-color, #d32f2f)',
                textTransform: 'none',
                borderRadius: '8px',
                px: 3,
                py: 1.2,
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'var(--button-hover-color, #b71c1c)'
                }
              }}
            >
              Выйти
            </Button>
          </Box>
        </Card>
      </Box>
    </Fade>
  );
};

export default ProfilePage;
