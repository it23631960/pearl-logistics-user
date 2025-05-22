import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import { FloatingNav } from "./Components/FloatingNav";
import Footer from "./Components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Settings from "./pages/Settings";
import RequestProduct from "./pages/RequestProduct";
import MyOrders from "./pages/MyOrders";
import Delivery from "./pages/Delivery";
import OrderConfirmation from "./pages/OrderConfirmation";
import MyReports from "./pages/MyReports";

const App = () => {
  return (
    <Router>
      <MainContent />
    </Router>
  );
};

const MainContent = () => {
  const location = useLocation();
  const hideNavRoutes = ["/login", "/signup"];

  return (
    <>
      <ToastContainer />
      {!hideNavRoutes.includes(location.pathname) && <FloatingNav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/request" element={<RequestProduct />} />
        <Route path="/checkout" element={<Cart />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/myreports" element={<MyReports />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;