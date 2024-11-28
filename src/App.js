import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import SignUpChoice from "./components/SignUpChoice";
import SignUpIndividual from "./components/SignUpIndividual";
import SignUpCompany from "./components/SignUpCompany";
import Login from "./components/Login";
import Homepage from "./components/Homepage";
import Cart from "./components/Cart";
import TopPage from "./components/TopPage";
import ProductPage from "./components/ProductPage";
import ContactPage from "./components/ContactPage";
import CheckoutPage from "./components/CheckoutPage";
import ProductDetails from "./components/ProductDetails";
import Invoice from "./components/Invoice";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPage from "./components/AdminPage";
// import TestComponent from "./TestComponent";

const App = () => {
  const location = useLocation(); 
  
  // List of routes where Cart and TopPage should not appear
  const hideOnRoutes = [
    "/login",
    "/signup-choice",
    "/signup-company",
    "/signup-individual",
    "/invoice",
    "/admin-page"
  ];

  // Check if current route is in the list
  const shouldHideCartAndTopPage = hideOnRoutes.includes(location.pathname);
  return (
    <>
      {/* Conditionally render Cart and TopPage */}
      {!shouldHideCartAndTopPage && (
        <>
        <Cart />
        <TopPage />
        {/* <TestComponent /> */}
        </>
      )}
      <Routes>
        <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Homepage />
          </ProtectedRoute>
          } 
        />
        <Route path="/product-page" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout-page" element={<CheckoutPage />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup-choice" element={<SignUpChoice />} />
        <Route path="/signup-company" element={<SignUpCompany />} />
        <Route path="/signup-individual" element={<SignUpIndividual />} />
        <Route path="/contact-page" element={<ContactPage />} />
        <Route path="/admin-page" element={<AdminPage />} />
      </Routes>
    </>
  );

};

const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;
