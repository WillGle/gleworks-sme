// Defines the app shell and top-level routes.
import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
// Eager: part of the shell, or the first route users land on. Loaded upfront.
import Header from "./components/Header";
import Footer from "./components/Footer";
import GlobalApiErrorToast from "./components/GlobalApiErrorToast";
import Landing from "./components/Landing/Landing";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy: each route is split into its own chunk and fetched on navigation.
// Ordered high → low by how much weight they keep off the initial load.
const AdminPageLayout = lazy(() => import("./components/UserPage/AdminPageLayout"));
const UserPageLayout = lazy(() => import("./components/UserPage/UserPageLayout"));
const CheckoutBuild = lazy(() => import("./components/Service/CheckoutBuild"));
const CheckoutSwitch = lazy(() => import("./components/Service/CheckoutSwitch"));
const Service = lazy(() => import("./components/Service/ServiceSelect"));
const Switch = lazy(() => import("./components/Service/Switch"));
const Build = lazy(() => import("./components/Service/Build"));
const Archive = lazy(() => import("./components/Archive/Archive"));
const Policies = lazy(() => import("./components/Policies/Policies"));
const Login = lazy(() => import("./components/LoginSignupPassword/Login"));
const Signup = lazy(() => import("./components/LoginSignupPassword/Signup"));
const LostPass = lazy(() => import("./components/LoginSignupPassword/LostPass"));
const NewPass = lazy(() => import("./components/LoginSignupPassword/NewPass"));
const NotFound = lazy(() => import("./components/NotFound"));
const NotAuth = lazy(() => import("./components/NotAuthorized"));

// Component responsible for rendering the layout with Header, Footer, and routing logic
function AppLayout() {
  const location = useLocation();

  // Define the paths where Header and Footer should be hidden
  const hideHeaderFooter = [
    "/login",
    "/signup",
    "/lost-password",
    "/user/new-password",
    "/admin/new-password",
  ].some((path) => location.pathname.startsWith(path));

  return (
    <>
      <GlobalApiErrorToast />
      {/* Conditionally render Header and Footer based on the route */}
      {!hideHeaderFooter && <Header />}
      {/* Suspense catches lazily-loaded routes while their chunk is fetched */}
      <Suspense fallback={<div className="route-loading">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/service/*" element={<Service />} />
        <Route path="/service/switch-modding" element={<Switch />} />
        <Route path="/service/keyboard-building" element={<Build />} />
        <Route
          path="/service/checkout-build"
          element={
            <ProtectedRoute>
              <CheckoutBuild />
            </ProtectedRoute>
          }
        />
        <Route
          path="/service/checkout-switch"
          element={
            <ProtectedRoute>
              <CheckoutSwitch />
            </ProtectedRoute>
          }
        />
        {/* Delegate all /user sub-routes to UserPageLayout */}
        <Route
          path="/user/*"
          element={
            <ProtectedRoute>
              <UserPageLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminPageLayout />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/lost-password" element={<LostPass />} />
        <Route
          path="/user/new-password"
          element={
            <ProtectedRoute>
              <NewPass />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/new-password"
          element={
            <ProtectedRoute>
              <NewPass />
            </ProtectedRoute>
          }
        />
        <Route path="/policies/" element={<Policies />} />
        <Route path="/not-authorized" element={<NotAuth />} />
        <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
        </Routes>
      </Suspense>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

// Main router for the application that wraps everything inside a Router
function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
