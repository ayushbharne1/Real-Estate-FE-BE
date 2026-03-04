import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import ProtectedRoutes from "./ProtectedRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {PublicRoutes()}
      {ProtectedRoutes()}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;