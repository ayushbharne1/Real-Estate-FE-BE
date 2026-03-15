import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectIsAuthenticated,
  selectSessionExpired,
  selectToken,
} from "../redux/slices/authSlice";

import MainLayout from "../components/layout/MainLayout";

import Dashboard from "../modules/dashboard/Dashboard";
import PropertyDetail from "../modules/dashboard/PropertyDetail";
import AddInventory from "../modules/inventory/AddInventory";
import EditInventory from "../modules/inventory/Editinventory";
import Profile from "../modules/profile/Profile";
import Premium from "../modules/premium/Premium";
import Customer from "../modules/customer/Customer";

const AuthGuard = () => {

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectToken);
  const sessionExpired = useSelector(selectSessionExpired);

  // If no token OR session expired → redirect
  if (!isAuthenticated || !token || sessionExpired) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout />;
};

const ProtectedRoutes = () => [
  <Route key="main" path="/" element={<AuthGuard />}>

    <Route index element={<Dashboard />} />

    <Route path="property/details/:id" element={<PropertyDetail />} />

    <Route path="add" element={<AddInventory />} />

    <Route path="edit/:id" element={<EditInventory />} />

    {/* also support this path */}
    <Route path="inventory/edit/:id" element={<EditInventory />} />

    <Route path="profile" element={<Profile />} />

    <Route path="premium" element={<Premium />} />

    <Route path="customer" element={<Customer />} />

  </Route>,
];

export default ProtectedRoutes;