import { Link } from "react-router-dom";

const OperatorDashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-green-600">Operator Dashboard</h1>
      <p className="mt-2 text-gray-700">Welcome, Operator!</p>
      <Link to="/" className="mt-4 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700">
        Logout
      </Link>
    </div>
  );
};

export default OperatorDashboard;
