import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";  // ✅ Correct import

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem("token");

    if (!token) return <Navigate to="/" replace />;

    try {
        const decoded = jwtDecode(token); // ✅ Use jwtDecode instead of jwt_decode
        const currentTime = Date.now() / 1000; // Convert to seconds

        if (decoded.exp < currentTime) {
            localStorage.removeItem("token"); // Token expired, remove it
            return <Navigate to="/" replace />;
        }

        // Check if the user's role is allowed
        if (allowedRoles && !allowedRoles.includes(decoded.role)) {
            return <Navigate to="/" replace />;
        }

        return <Outlet />;
    } catch (error) {
        console.error("Invalid Token", error);
        localStorage.removeItem("token"); // Invalid token, remove it
        return <Navigate to="/" replace />;
    }
};

export default ProtectedRoute;
