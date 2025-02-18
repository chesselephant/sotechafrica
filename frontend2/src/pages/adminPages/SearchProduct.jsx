import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../component/Sidebar";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import

const SearchProduct = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products from backend
  const [userEmail, setUserEmail] = useState(""); // ✅ Store user email
  const navigate = useNavigate(); // ✅ Use navigate for redirection

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

  // ✅ Fetch all products from backend when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products/");
        setAllProducts(response.data); // Store all products
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setProduct(null);
    setError("");

    if (value) {
      // Filter suggestions from API data
      const filteredSuggestions = allProducts.filter((p) =>
          p.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault(); // Prevents page reload

    if (!searchTerm) {
      toast.warn("Please enter a product name");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/products/${searchTerm}`);
      setProduct(response.data.data);
      toast.success("Product found!");
      setError("");
    } catch (error) {
      toast.error("Product not found!");
      setError("Product not found");
      setProduct(null);
    }

    // Hide suggestions after search
    setSuggestions([]);
  };

  const handleInputClick = () => {
    setSuggestions([]); // Hide suggestions when input is clicked
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

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

          {/* ✅ Search Section */}
          <h1 className="text-2xl font-bold text-center mb-4">Search Product</h1>
          <div className="flex justify-center items-center relative">
            <input
                type="text"
                placeholder="Enter product name"
                value={searchTerm}
                onChange={handleSearchChange}
                onClick={handleInputClick} // Hide suggestions when input is clicked
                onKeyDown={handleKeyPress} // Hide suggestions when Enter is pressed
                className="px-4 py-2 rounded-l bg-gray-800 text-white outline-none"
            />
            <button
                type="button" // Prevents form submission behavior
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 rounded-r hover:bg-blue-700"
            >
              <FaSearch />
            </button>

            {/* ✅ Suggestion Dropdown */}
            {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-gray-800 rounded mt-1 shadow-lg">
                  {suggestions.map((s, index) => (
                      <li
                          key={index}
                          className="cursor-pointer hover:bg-gray-700 p-2"
                          onClick={() => {
                            setSearchTerm(s.name);
                            setSuggestions([]); // Hide suggestions on selection
                          }}
                      >
                        {s.name}
                      </li>
                  ))}
                </ul>
            )}
          </div>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          {/* ✅ Product Display Section */}
          {product && (
              <div className="mt-6 flex justify-center">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
                  <img
                      src={product.imageUrl || "https://via.placeholder.com/150"} // Use product image if available
                      alt={product.name}
                      className="w-32 h-32 mx-auto mb-4 rounded"
                  />
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-gray-300">
                    Price: <span className="text-green-400 font-bold">&#8358;{product.price.toLocaleString()}</span>
                  </p>
                  <p className="text-gray-300">
                    Quantity: <span className="text-yellow-400 font-bold">{product.quantity}</span>
                  </p>
                </div>
              </div>
          )}

          {/* Toast Container */}
          <ToastContainer position="top-right" autoClose={2000} />
        </div>
      </div>
  );
};

export default SearchProduct;
