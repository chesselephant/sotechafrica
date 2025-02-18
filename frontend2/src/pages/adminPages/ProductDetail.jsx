import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../component/Sidebar";
import { FaArrowLeft } from "react-icons/fa"; // Import back arrow icon
import { jwtDecode } from "jwt-decode"; // ✅ Correct import
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetail = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageLoading, setImageLoading] = useState(true); // State to track image loading
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
        const fetchProduct = async () => {
            try {
                console.log(`Fetching product: http://localhost:5000/api/products/${name}`);
                const response = await axios.get(`http://localhost:5000/api/products/${name}`);

                // ✅ Extract `data` correctly from response
                if (response.data.success && response.data.data) {
                    console.log("Fetched Product:", response.data.data);
                    setProduct(response.data.data);
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

    useEffect(() => {
        console.log("Updated product state:", product);
    }, [product]);

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

                {/* Product Details */}
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold mb-4">{product.name || "No Name Available"}</h1>

                    {/* Image with Loading Spinner */}
                    <div className="relative w-60 h-60">
                        {imageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                <div className="border-4 border-gray-300 border-t-green-500 rounded-full w-12 h-12 animate-spin"></div>
                            </div>
                        )}
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className={`w-60 h-60 rounded-lg mb-4 ${imageLoading ? "hidden" : "block"}`}
                                onLoad={() => setImageLoading(false)}
                                onError={() => setImageLoading(false)}
                            />
                        ) : (
                            <p className="text-red-400">No Image Available</p>
                        )}
                    </div>

                    <p className="text-lg text-gray-300">{product.description || "No Description Available"}</p>
                    <p className="text-xl text-green-400 mt-3">
                        Price: ₦{product.price ? parseFloat(product.price).toLocaleString() : "0"}
                    </p>
                    <p className="text-lg text-yellow-400 mt-1">Quantity: {product.quantity ?? "0"}</p>

                    {/* Edit Button */}
                    <button
                        onClick={() => navigate(`/product/edit/${product.name}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-6"
                    >
                        Edit Product Detail
                    </button>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default ProductDetail;
