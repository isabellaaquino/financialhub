import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Anonymous() {
  const { authTokens } = useAuth();
  const location = useLocation();

  return authTokens?.access ? (
    <Navigate to="/auth/sign-in" state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
}

export default Anonymous;
