import { Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../modules/dashboard/Dashboard";
import PropertyDetail from "../modules/dashboard/PropertyDetail";
import AddInventory from "../modules/inventory/AddInventory";


const ProtectedRoutes = () => {
  return [
    <Route key="main" path="/" element={<MainLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="property/details/:id" element={<PropertyDetail />} />
      <Route path="add" element={<AddInventory />} />
    </Route>
  ];
};

export default ProtectedRoutes;