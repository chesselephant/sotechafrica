import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../component/Sidebar";
import { FaLock, FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
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

    // ✅ Handle password change request
    const handlePasswordChange = async () => {
        if (!oldPassword || !newPassword) {
            toast.warn("Please fill in all fields", { autoClose: 3000 });
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You are not authenticated!", { autoClose: 3000 });
                setLoading(false);
                return;
            }

            const decoded = jwtDecode(token);
            const userId = decoded?.userId;

            if (!userId) {
                toast.error("Invalid user session. Please log in again.", { autoClose: 3000 });
                setLoading(false);
                return;
            }

            const response = await axios.post(
                "http://localhost:5000/api/operators/change-password",
                { userId, oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success("Password changed successfully!", { autoClose: 3000 });
                setOldPassword("");
                setNewPassword("");
            } else {
                toast.error(response.data.message || "Failed to change password", { autoClose: 3000 });
            }
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error(error.response?.data?.message || "Server error", { autoClose: 3000 });
        }

        setLoading(false);
    };

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            <Sidebar />
            <div className="flex-1 p-6 flex flex-col items-center justify-center">
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

                {/* Password Change Form */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-xl font-bold text-center mb-4">Change Password</h2>

                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Old Password</label>
                        <input
                            type="password"
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded outline-none"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Enter old password"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">New Password</label>
                        <input
                            type="password"
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded outline-none"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                    </div>

                    <button
                        className="w-full bg-green-500 hover:bg-green-600 p-2 rounded text-white flex items-center justify-center space-x-2 disabled:bg-gray-600"
                        onClick={handlePasswordChange}
                        disabled={loading} // Disable button while request is processing
                    >
                        <FaLock />
                        <span>{loading ? "Changing..." : "Change Password"}</span>
                    </button>
                </div>
            </div>
            <ToastContainer position="top-right" />
        </div>
    );
};

export default ChangePassword;
