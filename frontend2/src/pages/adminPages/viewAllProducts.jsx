import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../component/Sidebar";
import { FaSearch, FaArrowLeft } from "react-icons/fa"; // ✅ Import Search & Back Icon
import { jwtDecode } from "jwt-decode"; // ✅ Correct import

const ViewAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const highlightedRef = useRef(null);
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(""); // ✅ Store user email

  // ✅ Extract user email from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect to login if token is missing
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setUserEmail(decodedToken.userEmail || "Admin");
    } catch (error) {
      console.error("Error decoding token:", error);
      setUserEmail("Admin");
    }
  }, [navigate]);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // Redirect to login page
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products/");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Filter products based on search query
  const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // ✅ Scroll to highlighted product if search query matches
  useEffect(() => {
    if (searchQuery && highlightedRef.current) {
      highlightedRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [searchQuery]);

  return (
      <div className="flex min-h-screen bg-gray-900 text-white">
        <Sidebar />
        <div className="flex-1 p-6">
          {/* ✅ Header (Same as AdminDashboard) */}
          <div className="flex justify-between items-center w-full max-w-3xl mb-6">
            <h1 className="text-2xl font-bold italic text-orange-400">
              Welcome, {userEmail}
            </h1>
            <div className="flex space-x-4">
              <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2"
                  onClick={() => navigate("/admin")} // ✅ Navigate back
              >
                <FaArrowLeft />
                <span>Back to Homepage</span>
              </button>
              <button
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                  onClick={handleLogout} // ✅ Logout action
              >
                Logout
              </button>
            </div>
          </div>

          {/* ✅ Products Section */}
          <h2 className="text-green-400 text-2xl font-bold mb-6 text-center">View All Products</h2>

          {/* ✅ Search Bar with Icon */}
          <div className="mb-2 flex justify-center relative w-1/2 mx-auto">
            <FaSearch className="absolute left-3 top-3 text-gray-400" /> {/* ✅ Search Icon */}
            <input
                type="text"
                placeholder="Search product by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 pl-10 w-full bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-green-400"
            />
          </div>

          {/* ✅ Caption Below Search Box */}
          <p className="text-center text-gray-400 text-sm mb-4">
            Click on any product to edit its information.
          </p>

          {/* ✅ Product Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
              <tr className="bg-gray-800">
                <th className="p-2">S/N</th> {/* ✅ Added Serial Number Column */}
                <th className="p-2">Name</th>
                <th className="p-2">Description</th>
                <th className="p-2">Price (₦)</th>
                <th className="p-2">Quantity</th>
              </tr>
              </thead>
              <tbody>
              {currentProducts.length > 0 ? (
                  currentProducts.map((product, index) => {
                    const isHighlighted = searchQuery && product.name.toLowerCase().includes(searchQuery.toLowerCase());
                    return (
                        <tr
                            key={product._id}
                            ref={isHighlighted ? highlightedRef : null}
                            className={`border-b border-gray-700 cursor-pointer ${
                                isHighlighted ? "bg-yellow-500 text-black" : "hover:bg-gray-700"
                            }`}
                            onClick={() => navigate(`/product/${product.name}`)}
                        >
                          <td className="p-2">{indexOfFirstProduct + index + 1}</td> {/* ✅ Serial Number Calculation */}
                          <td className="p-2">{product.name}</td>
                          <td className="p-2">{product.description}</td>
                          <td className="p-2">₦{parseFloat(product.price).toLocaleString()}</td>
                          <td className="p-2">{product.quantity}</td>
                        </tr>
                    );
                  })
              ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-400">No products found</td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>

          {/* ✅ Pagination */}
          {totalPages > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        className={`px-3 py-1 rounded ${
                            currentPage === i + 1 ? "bg-green-500" : "bg-gray-700"
                        }`}
                        onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                ))}
              </div>
          )}
        </div>
      </div>
  );
};

export default ViewAllProducts;
