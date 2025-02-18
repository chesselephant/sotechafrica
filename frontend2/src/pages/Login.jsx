import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // ✅ Import Toast
import "react-toastify/dist/ReactToastify.css"; // ✅ Import Toast CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const URL = "http://localhost:5000"
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${URL}/api/operators/login-users`, {
        email,
        password
      });

      const { token, role } = response.data;

      // Store the token in local storage (if using authentication)
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`


      // Redirect user based on role
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "operator") {
        navigate("/operator");
      } else {
        toast.error("Invalid user role!", { autoClose: 5000 }); // Toast for unexpected roles
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Incorrect credentials!", { autoClose: 5000 }); // ✅ Show toast for 5 seconds
    }
  };

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-blue-600">
            SoTechafrica Store House
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700">Email Address</label>
              <input
                  type="email"
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                  type="password"
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
            </div>
            <button
                type="submit"
                className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              Login
            </button>
          </form>
        </div>

        {/* Toast Container */}
        <ToastContainer position="top-right" />
      </div>
  );
};

export default Login;
