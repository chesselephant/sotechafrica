import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../component/Sidebar";
import { FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import

const CreateOperator = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNum: "",
        role: "operator",
    });

    const [errors, setErrors] = useState({ name: "", email: "", phoneNum: "" });
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

    // ✅ Handle input changes and validation
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Validate fields
        if (name === "name") validateName(value);
        if (name === "email") validateEmail(value);
        if (name === "phoneNum") validatePhone(value);
    };

    const validateName = (name) => {
        const cleanedName = name.trim();
        const namePattern = /^([A-Za-z]{3,}\s)+[A-Za-z]{3,}$/;
        setErrors((prevErrors) => ({
            ...prevErrors,
            name: namePattern.test(cleanedName) ? "" : "Must have at least two words, each 3+ letters",
        }));
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setErrors((prevErrors) => ({
            ...prevErrors,
            email: emailPattern.test(email) ? "" : "Invalid email format",
        }));
    };

    const validatePhone = (phoneNum) => {
        const phonePattern = /^[0-9]{10,15}$/;
        setErrors((prevErrors) => ({
            ...prevErrors,
            phoneNum: phonePattern.test(phoneNum) ? "" : "Must be 10-15 digits (no spaces)",
        }));
    };

    // ✅ Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5000/api/operators/create-operator",
                formData,
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 201 || response.status === 200) {
                toast.success("✅ Operator Created Successfully!");
                handleClear();
            } else {
                throw new Error("Unexpected response from server.");
            }
        } catch (error) {
            console.error("Error creating operator:", error);
            toast.error(`❌ Failed to create operator: ${error.response?.data?.message || error.message}`);
        }
    };

    // ✅ Clear form fields
    const handleClear = () => {
        setFormData({ name: "", email: "", phoneNum: "", role: "operator" });
        setErrors({ name: "", email: "", phoneNum: "" });
    };

    const isFormValid =
        formData.name &&
        formData.email &&
        formData.phoneNum &&
        !errors.name &&
        !errors.email &&
        !errors.phoneNum;

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
                    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-green-400 text-xl font-bold text-center mb-4">Create New Operator</h2>

                        <input type="hidden" name="role" value={formData.role} />

                        {/* Name Field */}
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-400"
                                required
                            />
                            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Email Field */}
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-400"
                                required
                            />
                            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Phone Number Field */}
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNum"
                                value={formData.phoneNum}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-400"
                                required
                            />
                            {errors.phoneNum && <p className="text-red-400 text-sm mt-1">{errors.phoneNum}</p>}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={!isFormValid}
                                className={`w-full p-2 rounded transition ${
                                    isFormValid ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-500 text-gray-300 cursor-not-allowed"
                                }`}
                            >
                                Create Operator
                            </button>
                            <button
                                type="button"
                                onClick={handleClear}
                                className="w-full p-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition"
                            >
                                Clear
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default CreateOperator;
