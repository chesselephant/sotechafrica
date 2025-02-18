import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../component/Sidebar";
import { FaEye, FaEdit, FaArrowLeft } from "react-icons/fa";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import

const ViewAllOperators = () => {
  const [operators, setOperators] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const operatorsPerPage = 10;
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

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/operators/getalloperator");
        setOperators(response.data.data); // Assuming API returns { success: true, data: [...] }
      } catch (error) {
        console.error("Error fetching operators:", error);
      }
    };

    fetchOperators();
  }, []);

  // ✅ Pagination Logic
  const indexOfLastOperator = currentPage * operatorsPerPage;
  const indexOfFirstOperator = indexOfLastOperator - operatorsPerPage;
  const currentOperators = operators.slice(indexOfFirstOperator, indexOfLastOperator);
  const totalPages = Math.ceil(operators.length / operatorsPerPage);

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

          {/* ✅ Operators List */}
          <h2 className="text-center text-green-400 text-2xl mb-6">View All Operators</h2>

          {operators.length === 0 ? (
              <p className="text-center text-gray-400 text-lg">No Operator has been registered just yet</p>
          ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-gray-800">
                      <th className="p-3">S/N</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentOperators.map((operator, index) => (
                        <tr
                            key={operator._id}
                            className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}
                        >
                          <td className="p-3">{indexOfFirstOperator + index + 1}</td>
                          <td className="p-3">{operator.name}</td>
                          <td className="p-3">{operator.email}</td>
                          <td className="p-3">{operator.phoneNum}</td>
                          <td
                              className={`p-3 ${
                                  operator.status === "Active" ? "text-green-500" : "text-red-500"
                              }`}
                          >
                            {operator.status}
                          </td>
                          <td className="p-3 flex gap-3">
                            <Link to={`/operator/view/${operator._id}`} className="text-blue-400 hover:text-blue-600">
                              <FaEye size={18} />
                            </Link>
                            <Link to={`/operator/edit/${operator._id}`} className="text-yellow-400 hover:text-yellow-600">
                              <FaEdit size={18} />
                            </Link>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>

                {/* ✅ Pagination - Only Show If More Than 10 Operators */}
                {operators.length > 10 && (
                    <div className="flex justify-center mt-4">
                      {Array.from({ length: totalPages }, (_, i) => (
                          <button
                              key={i}
                              className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? "bg-green-500" : "bg-gray-700"}`}
                              onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </button>
                      ))}
                    </div>
                )}
              </>
          )}
        </div>
      </div>
  );
};

export default ViewAllOperators;
