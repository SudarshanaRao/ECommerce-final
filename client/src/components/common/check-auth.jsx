import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function CheckAuth({ children }) {
  const { pathname } = useLocation();
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);

  // Block rendering until auth state is known
  if (isLoading) return null;

  const isAuthPage =
    pathname.includes("/login") ||
    pathname.includes("/register") ||
    pathname.includes("/auth/verify-otp");

    console.log(isAuthenticated, user);
    
    

    if (isAuthenticated && user?.isOtpVerified && pathname === "/auth/verify-otp") {
      return <Navigate to="/shop/home" replace />;
    }

  // Redirect to /verify-otp if authenticated but OTP not verified
  if (isAuthenticated && !user?.isOtpVerified && pathname !== "/auth/verify-otp") {
    return <Navigate to="/auth/verify-otp" replace />;
  }

  // Root path redirection
  if (pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" replace />;
    }

    return user?.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/shop/home" replace />
    );
  }

  // If not authenticated and trying to access a protected route
  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/auth/login" replace />;
  }

  // If authenticated and trying to access login/register
  if (isAuthenticated && isAuthPage && pathname !== "/auth/verify-otp") {
    return user?.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/shop/home" replace />
    );
  }

  // Prevent non-admins from accessing admin routes
  if (isAuthenticated && user?.role !== "admin" && pathname.startsWith("/admin")) {
    return <Navigate to="/unauth-page" replace />;
  }

  // Prevent admins from accessing shop routes
  if (isAuthenticated && user?.role === "admin" && pathname.startsWith("/shop")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;
