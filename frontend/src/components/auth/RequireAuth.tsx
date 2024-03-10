import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function RequireAuth() {
  const { authTokens } = useAuth();
  const location = useLocation();

  return authTokens?.access ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/sign-in" state={{ from: location }} replace />
  );
}

export default RequireAuth;
