import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate for redirection
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // ✅ Import jwtDecode to extract email
import {
    FaCartPlus, FaDollarSign, FaUsers,
    FaEye, FaEdit, FaTrash, FaArrowLeft, FaArrowRight
} from "react-icons/fa";
import Sidebar from "../component/Sidebar";

const AdminDashboard = () => {
    const [products, setProducts] = useState([]); // Store products
    const [operators, setOperators] = useState([]); // Store operators
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [currentPage, setCurrentPage] = useState(1);
    const [userEmail, setUserEmail] = useState(""); // ✅ Store user email
    const itemsPerPage = 10;
    const navigate = useNavigate(); // ✅ For redirection on logout

    // ✅ Fetch products and operators from API on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token"); // Get token
                if (!token) {
                    navigate("/"); // Redirect to login if token is missing
                    return;
                }

                // ✅ Extract email from token
                const decodedToken = jwtDecode(token);
                setUserEmail(decodedToken.userEmail || "Admin");

                const [productRes, operatorRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/products/", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get("http://localhost:5000/api/operators/getalloperator", {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setProducts(productRes.data); // Store products in state
                setOperators(operatorRes.data.data); // Store operators in state
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    // ✅ Logout function
    const handleLogout = () => {
        localStorage.clear(); // Clear all stored data
        navigate("/"); // Redirect to login page
    };

    // ✅ Format currency
    const formatCurrency = amount => new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(amount);

    // ✅ Calculate total store value
    const totalStoreValue = products.reduce((acc, product) => acc + (product.price * product.quantity), 0).toFixed(2);

    // ✅ Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const displayedProducts = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            <Sidebar />
            <div className="flex-1 p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold italic text-orange-400">
                        Welcome, {userEmail}
                    </h1>
                    <button
                        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                        onClick={handleLogout} // ✅ Logout action
                    >
                        Logout
                    </button>
                </div>

                {/* Inventory Stats */}
                <h2 className="text-green-400 text-xl mb-4">Inventory Stats</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-800 p-4 rounded text-center">
                        <FaCartPlus className="text-white text-2xl mx-auto" />
                        <p>Total Products</p>
                        <p className="text-2xl">{products.length}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded text-center">
                        <FaDollarSign className="text-white text-2xl mx-auto" />
                        <p>Total Store Value</p>
                        <p className="text-2xl">&#8358;{formatCurrency(totalStoreValue)}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded text-center">
                        <FaUsers className="text-white text-2xl mx-auto" />
                        <p>No. of Operators</p>
                        <p className="text-2xl">{operators.length}</p> {/* ✅ Display Number of Operators */}
                    </div>
                </div>

                {/* Loading and Error Handling */}
                {loading ? (
                    <p className="text-center text-yellow-400">Loading data...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <>
                        {/* Product Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                <tr className="bg-gray-800">
                                    <th className="p-2">S/N</th>
                                    <th className="p-2">Name</th>
                                    <th className="p-2">Price</th>
                                    <th className="p-2">Quantity</th>
                                    <th className="p-2">Value</th>
                                    <th className="p-2">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {displayedProducts.map((product, index) => (
                                    <tr key={product.id} className="border-b border-gray-700">
                                        <td className="p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td className="p-2">{product.name}</td>
                                        <td className="p-2">&#8358;{formatCurrency(product.price)}</td>
                                        <td className="p-2">{product.quantity}</td>
                                        <td className="p-2">&#8358;{formatCurrency(product.price * product.quantity)}</td>
                                        <td className="p-2 flex space-x-2">
                                            <FaEye className="text-blue-500 cursor-pointer" />
                                            <FaEdit className="text-yellow-500 cursor-pointer" />
                                            <FaTrash className="text-red-500 cursor-pointer" />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-between items-center mt-4 sticky bottom-0 bg-gray-900 p-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-600" : "bg-blue-500 hover:bg-blue-600"}`}
                            >
                                <FaArrowLeft />
                            </button>
                            <span className="text-lg">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-600" : "bg-blue-500 hover:bg-blue-600"}`}
                            >
                                <FaArrowRight />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
