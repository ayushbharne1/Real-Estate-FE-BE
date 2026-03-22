import { lazy, Suspense } from 'react'
import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectToken } from "../redux/slices/authSlice";
import MainLayout from "../components/layout/MainLayout";

const Dashboard     = lazy(() => import('../modules/dashboard/Dashboard'))
const PropertyDetail = lazy(() => import('../modules/dashboard/PropertyDetail'))
const AddInventory  = lazy(() => import('../modules/inventory/AddInventory'))
const EditInventory = lazy(() => import('../modules/inventory/Editinventory'))
const Profile       = lazy(() => import('../modules/profile/Profile'))
const Premium       = lazy(() => import('../modules/premium/Premium'))
const Customer      = lazy(() => import('../modules/customer/Customer'))
const AddCustomerForm = lazy(() => import('../modules/customer/AddCustomerForm'))
const BuyerDetail   = lazy(() => import('../modules/customer/BuyerDetail'))

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <span className="inline-block w-8 h-8 border-4 border-gray-200 rounded-full animate-spin"
      style={{ borderTopColor: '#E8431A' }} />
  </div>
)

const AuthGuard = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectToken);
  if (!isAuthenticated || !token) return <Navigate to="/login" replace />;
  return <MainLayout />;
};

const ProtectedRoutes = () => [
  <Route key="main" path="/" element={<AuthGuard />}>
    <Route index element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
    <Route path="property/details/:id" element={<Suspense fallback={<PageLoader />}><PropertyDetail /></Suspense>} />
    <Route path="add" element={<Suspense fallback={<PageLoader />}><AddInventory /></Suspense>} />
    <Route path="edit/:id" element={<Suspense fallback={<PageLoader />}><EditInventory /></Suspense>} />
    <Route path="inventory/edit/:id" element={<Suspense fallback={<PageLoader />}><EditInventory /></Suspense>} />
    <Route path="profile" element={<Suspense fallback={<PageLoader />}><Profile /></Suspense>} />
    <Route path="premium" element={<Suspense fallback={<PageLoader />}><Premium /></Suspense>} />
    <Route path="customer" element={<Suspense fallback={<PageLoader />}><Customer /></Suspense>} />
    <Route path="/customer/add" element={<Suspense fallback={<PageLoader />}><AddCustomerForm /></Suspense>} />
    <Route path="/customer/:id" element={<Suspense fallback={<PageLoader />}><BuyerDetail /></Suspense>} />
  </Route>,
];

export default ProtectedRoutes;