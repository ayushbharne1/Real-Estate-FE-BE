import { Route } from "react-router-dom";

import Login from "../modules/auth/Login";

const PublicRoutes = () => {
  return [
    <Route key="login" path="/login" element={<Login />} 
     />,
  ];
};

export default PublicRoutes;