import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Login from "./components/LoginSignupPassword/Login";
import Signup from "./components/LoginSignupPassword/Signup";
import LostPass from "./components/LoginSignupPassword/LostPass";
import NewPass from "./components/LoginSignupPassword/NewPass";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Landing from "./components/Landing/Landing";
// import About from "./components/About (save for later)/About";
// import Blog from "./components/Blog (dev later)/Blog";
import Archive from "./components/Archive/Archive";
import Service from "./components/Service/ServiceSelect";
import Switch from "./components/Service/Switch";
import Build from "./components/Service/Build";
import CheckoutBuild from "./components/Service/CheckoutBuild";
import CheckoutSwitch from "./components/Service/CheckoutSwitch";
import UserPageLayout from "./components/UserPage/UserPageLayout";
import AdminPageLayout from "./components/UserPage/AdminPageLayout";
import Policies from "./components/Policies/PrivacyPolicy";
import NotFound from "./components/NotFound";
import NotAuth from "./components/NotAuthorized";
import ProtectedRoute from "./components/ProtectedRoute";

// Component responsible for rendering the layout with Header, Footer, and routing logic
function AppLayout() {
  const location = useLocation();

  // Define the paths where Header and Footer should be hidden
  const hideHeaderFooter = [
    "/login",
    "/signup",
    "/lost-password",
    "/new-password",
  ].some((path) => location.pathname.startsWith(path));

  return (
    <>
      {/* Conditionally render Header and Footer based on the route */}
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Landing />} />
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/blog" element={<Blog />} /> */}
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
