import { Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../modules/dashboard/Dashboard";
import PropertyDetail from "../modules/dashboard/PropertyDetail";
import AddInventory from "../modules/inventory/AddInventory";
import Profile from "../modules/profile/Profile";
import Premium from "../modules/premium/Premium";


const ProtectedRoutes = () => {
  return [
    <Route key="main" path="/" element={<MainLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="property/details/:id" element={<PropertyDetail />} />
      <Route path="add" element={<AddInventory />} />
      <Route path="profile" element={<Profile />} />
      <Route path="premium" element={<Premium />} />
    </Route>
  ];
};

export default ProtectedRoutes;