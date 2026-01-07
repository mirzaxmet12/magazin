import { Navigate, Outlet, useLocation } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useGetMe } from "../hooks/useAuth";
import { getToken } from "../utilis/auth";

export default function ProtectedRoute() {
  const { data: user, isLoading, error } = useGetMe();
  const token = getToken();
  const location = useLocation();

console.log(token);
console.log(user);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user || error) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet/>;
};

