import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "./components/LoginSignupPassword/Login";
import Signup from "./components/LoginSignupPassword/Signup";
import LostPass from "./components/LoginSignupPassword/LostPass";
import NewPass from "./components/LoginSignupPassword/NewPass";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Landing from "./components/Landing/Landing";
import About from "./components/About/About";
import Archive from "./components/Archive/Archive";
import "./App.css";

// Component responsible for rendering the layout with Header, Footer, and routing logic
function AppLayout() {
  const location = useLocation();

  // Define the paths where Header and Footer should be hidden
  const hideHeaderFooter = [
    "/login",
    "/signup",
    "/lost-password",
    "/new-password",
  ].includes(location.pathname);

  return (
    <>
      {/* Conditionally render Header and Footer based on the route */}
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route path="/home" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/lost-password" element={<LostPass />} />
        <Route path="/new-password" element={<NewPass />} />
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
