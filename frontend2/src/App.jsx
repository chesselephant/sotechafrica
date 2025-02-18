import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import CreateOperator from "./pages/adminPages/createOperator";
import ViewAllOperators from "./pages/adminPages/ViewAllOperators";
import CreateProduct from "./pages/adminPages/CreateProduct";
import ViewAllProducts from "./pages/adminPages/viewAllProducts";
import SearchProduct from "./pages/adminPages/SearchProduct";
import ChangePassword from "./pages/adminPages/ChangePassword";
import UpdateProduct from "./pages/adminPages/UpdateProduct";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./component/ProtectedRoute.jsx"
import ProductDetail from "./pages/adminPages/ProductDetail";
import EditProduct from "./pages/adminPages/EditProduct.jsx";
import { useEffect } from 'react'
import axios from 'axios'
function App() {
  useEffect(() => {
    let token = localStorage.getItem("token");

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("Token set in headers:", token); // Debugging log
    } else {
      console.warn("No token found!");
    }
  }, []);


  return (
      <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Admin Routes - Only accessible to "admin" role */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/create-operator" element={<CreateOperator />} />
            <Route path="/admin/view-operators" element={<ViewAllOperators />} />
            <Route path="/admin/add-product" element={<CreateProduct />} />
            <Route path="/admin/view-products" element={<ViewAllProducts />} />
            <Route path="/admin/search-product" element={<SearchProduct />} />
            <Route path="/admin/change-password" element={<ChangePassword />} />
            <Route path="/admin/update-product" element={<UpdateProduct />} />
            <Route path="/product/:name" element={<EditProduct />} />

          </Route>

          {/* Operator Routes - Only accessible to "operator" role */}
          <Route element={<ProtectedRoute allowedRoles={["operator"]} />}>
            <Route path="/operator" element={<OperatorDashboard />} />
          </Route>
        </Routes>
          </Router>
      </>
  );
}

export default App;
