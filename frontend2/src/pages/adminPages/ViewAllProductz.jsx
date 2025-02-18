import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../component/Sidebar";

const ViewAllProducts = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;
    const navigate = useNavigate();

    // Mock product data
    const products = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `Product ${index + 1}`,
        price: (Math.random() * 10000).toFixed(2),
        quantity: Math.floor(Math.random() * 100),
    }));

    // Filter products based on search query
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination Logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            <Sidebar />
            <div className="flex-1 p-6">
                <h2 className="text-green-400 text-2xl font-bold mb-6 text-center">View All Products</h2>

                {/* Search Bar */}
                <div className="mb-4 flex justify-center">
                    <input
                        type="text"
                        placeholder="Search product..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-2 w-1/2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-green-400"
                    />
                </div>

                {/* Product Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-800">
                            <th className="p-2">ID</th>
                            <th className="p-2">Name</th>
                            <th className="p-2">Price (₦)</th>
                            <th className="p-2">Quantity</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentProducts.map((product) => (
                            <tr
                                key={product.id}
                                className="border-b border-gray-700 cursor-pointer hover:bg-gray-700"
                                onClick={() => navigate(`/product/${product.id}`)}
                            >
                                <td className="p-2">{product.id}</td>
                                <td className="p-2">{product.name}</td>
                                <td className="p-2">₦{product.price}</td>
                                <td className="p-2">{product.quantity}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            className={`px-3 py-1 rounded ${
                                currentPage === i + 1 ? "bg-green-500" : "bg-gray-700"
                            }`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewAllProducts;
