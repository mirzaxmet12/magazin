import {Box,Card,CardContent,Typography,Avatar,Stack,Button} from '@mui/material';
import {
  AccountCircle,
  Phone,
  Cake,
  Wc,
  Logout
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../features/auth/authSlice';

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  
 
  const handleLogout = () => {
    dispatch(logout());
  };

  if (!user) {
    return <Typography variant="h6">Пользователь не найден</Typography>;
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Card sx={{ width: 400, p: 3, boxShadow: 3 }}>
        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar sx={{ width: 80, height: 80 }}>
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
            <Box display="flex" alignItems="center" gap={1}>
              <Phone color="success" />
              <Typography variant="body1">
                <strong>Телефон:</strong> {user.phone}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Cake color="error" />
              <Typography variant="body1">
                <strong>Дата рождения:</strong> {user.date_of_birth}
              </Typography>
            </Box>
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
            color="error"
            startIcon={<Logout />}
            onClick={handleLogout}
          >
            Выйти
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default ProfilePage;
