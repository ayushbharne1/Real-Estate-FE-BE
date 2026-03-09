import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../redux/slices/authSlice";
import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../modules/dashboard/Dashboard";
import PropertyDetail from "../modules/dashboard/PropertyDetail";
import AddInventory from "../modules/inventory/AddInventory";
import Profile from "../modules/profile/Profile";
import Premium from "../modules/premium/Premium";

/**
 * Auth guard wrapper — used as the element for the root route.
 * If not authenticated, redirects to /login.
 * If authenticated, renders <MainLayout /> which contains <Outlet />
 * for all nested child routes.
 */
const AuthGuard = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />;
};

const ProtectedRoutes = () => {
  return [
    <Route key="main" path="/" element={<AuthGuard />}>
      <Route index element={<Dashboard />} />
      <Route path="property/details/:id" element={<PropertyDetail />} />
      <Route path="add" element={<AddInventory />} />
      <Route path="profile" element={<Profile />} />
      <Route path="premium" element={<Premium />} />
    </Route>,
  ];
};

export default ProtectedRoutes;