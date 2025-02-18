import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../component/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowLeft } from "react-icons/fa";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import

const EditProduct = () => {
    const { name } = useParams();
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

    // State variables
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        quantity: "",
        imageUrl: ""
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState("");

    // Fetch product details
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                console.log(`Fetching product: http://localhost:5000/api/products/${name}`);
                const response = await axios.get(`http://localhost:5000/api/products/${name}`);

                if (response.data.success && response.data.data) {
                    const productData = response.data.data;
                    setProduct(productData);
                    setFormData({
                        name: productData.name || "",
                        description: productData.description || "",
                        price: productData.price || "",
                        quantity: productData.quantity || "",
                        imageUrl: productData.imageUrl || "https://via.placeholder.com/150" // Default placeholder
                    });
                    setPreviewImage(productData.imageUrl || "https://via.placeholder.com/150");
                } else {
                    throw new Error("Invalid product data structure");
                }
            } catch (err) {
                console.error("Error fetching product:", err.response ? err.response.data : err.message);
                setError("Product not found");
            } finally {
                setLoading(false);
            }
        };

        if (name) fetchProduct();
    }, [name]);

    // Handle input changes (except file input)
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file); // Store file for form submission
            setPreviewImage(URL.createObjectURL(file)); // Create preview URL
        }
    };

    const API_BASE_URL = "http://localhost:5000"; // Ensure this matches your backend

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const updateData = new FormData();
        updateData.append("name", formData.name);
        updateData.append("description", formData.description);
        updateData.append("price", formData.price);
        updateData.append("quantity", formData.quantity);

        if (selectedImage) {
            updateData.append("imageUrl", selectedImage);
        }

        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/products/${product._id}`, // ✅ Ensure this matches your backend
                updateData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            console.log("✅ API Response:", response.data);

            if (response.data.success) {
                toast.success("🎉 Product updated successfully!", { position: "top-right" });
                navigate(`/admin/view-products`);
            } else {
                throw new Error(response.data.message || "Failed to update product");
            }
        } catch (err) {
            console.error("🔥 Error updating product:", err.response ? err.response.data : err.message);
            toast.error("❌ Failed to update product. Try again!", { position: "top-right" });
        }
    };

    if (loading) {
        return <p className="text-center text-gray-400">Loading product details...</p>;
    }

    if (error || !product) {
        return <p className="text-center text-red-400">{error}</p>;
    }

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

                {/* Edit Form */}
                <div className="flex justify-center">
                    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
                        <h2 className="text-green-400 text-xl font-bold text-center mb-4">Edit Product</h2>

                        <label className="block mb-2">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white mb-4"
                            required
                        />

                        <label className="block mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white mb-4"
                            required
                        />

                        <label className="block mb-2">Price (₦)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white mb-4"
                            required
                        />

                        <label className="block mb-2">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white mb-4"
                            required
                        />

                        <label className="block mb-2">Change Product Image</label>
                        <input
                            type="file"
                            name="imageUrl"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full p-2 bg-gray-700 text-white rounded mb-4"
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full mt-4"
                        >
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default EditProduct;
