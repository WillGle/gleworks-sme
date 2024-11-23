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
import About from "./components/About/About";
// import Blog from "./components/Blog (dev later)/Blog";
import Archive from "./components/Archive/Archive";
import Service from "./components/Service/ServiceSelect";
import Switch from "./components/Service/Switch";
import Build from "./components/Service/Build";
import CheckoutBuild from "./components/Service/CheckoutBuild";
import CheckoutSwitch from "./components/Service/CheckoutSwitch";
import UserPageLayout from "./components/UserPage/UserPageLayout";
import AdminPageLayout from "./components/AdminPage/AdminPageLayout";
import Policies from "./components/Policies/Policies";
import NotFound from "./components/NotFound";
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
        {/* Redirect from "/" to "/home" */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/blog" element={<Blog />} /> */}
        <Route path="/archive" element={<Archive />} />
        <Route path="/service/*" element={<ProtectedRoute><Service /></ProtectedRoute>} />
        <Route path="/service/switch-modding" element={<ProtectedRoute><Switch /></ProtectedRoute>} />
        <Route path="/service/keyboard-build" element={<ProtectedRoute><Build /></ProtectedRoute>} />
        <Route path="/service/checkout-build" element={<ProtectedRoute><CheckoutBuild /></ProtectedRoute>} />
        <Route path="/service/checkout-switch" element={<ProtectedRoute><CheckoutSwitch /></ProtectedRoute>} />
        {/* Delegate all /user sub-routes to UserPageLayout */}
        <Route path="/user/*" element={<ProtectedRoute><UserPageLayout /></ProtectedRoute>} />
        {/* Delegate all /admin sub-routes to AdminPageLayout */}
        <Route path="/admin/*" element={<AdminPageLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/lost-password" element={<LostPass />} />
        <Route path="/user/new-password" element={<NewPass />} />
        <Route path="/policies/" element={<Policies />} />
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
