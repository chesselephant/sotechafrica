import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../component/Sidebar";
import { FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("quantity", formData.quantity);
      if (formData.image) {
        data.append("imageUrl", formData.image);
      }

      const response = await axios.post(
          "http://localhost:5000/api/products/create",
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        toast.success("✅ Product created successfully!", { autoClose: 5000 });
        handleClear();
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      toast.error(`❌ Failed to create product: ${error.response?.data?.message || error.message}`, { autoClose: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Clear all fields
  const handleClear = () => {
    setFormData({ name: "", description: "", price: "", quantity: "", image: null });
    document.getElementById("imageInput").value = ""; // Reset file input
  };

  // ✅ Check if all required fields are filled
  const isFormValid =
      formData.name.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.price.trim() !== "" &&
      formData.quantity.trim() !== "";

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

          {/* ✅ Form Section */}
          <div className="flex justify-center">
            <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
              <h2 className="text-green-400 text-xl font-bold text-center mb-4">Create New Product</h2>

              <div className="mb-4">
                <label className="block text-sm mb-2">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Price</label>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Quantity</label>
                <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Image (Optional)</label>
                <input
                    type="file"
                    id="imageInput"
                    name="imageUrl"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between">
                <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className={`px-4 py-2 rounded transition ${
                        isFormValid && !isSubmitting ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 cursor-not-allowed"
                    }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>

                <button
                    type="button"
                    onClick={handleClear}
                    className="bg-red-500 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
  );
};

export default CreateProduct;
