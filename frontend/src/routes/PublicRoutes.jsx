import { lazy, Suspense } from 'react'
import { Route } from "react-router-dom";

const Login = lazy(() => import('../modules/auth/Login'))

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <span className="inline-block w-8 h-8 border-4 border-gray-200 rounded-full animate-spin"
      style={{ borderTopColor: '#E8431A' }} />
  </div>
)

const PublicRoutes = () => [
  <Route key="login" path="/login" element={
    <Suspense fallback={<PageLoader />}><Login /></Suspense>
  } />,
];

export default PublicRoutes;