import React, { useState } from "react";
import Sidebar from "../../component/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch } from "react-icons/fa";

const mockProducts = [
  { id: 1, name: "Laptop", description: "Gaming Laptop", price: 150000, quantity: 5, image: "/images/laptop.jpg" },
  { id: 2, name: "Phone", description: "Smartphone", price: 70000, quantity: 10, image: "/images/phone.jpg" },
  { id: 3, name: "Tablet", description: "Android Tablet", price: 50000, quantity: 8, image: "/images/tablet.jpg" }
];

const UpdateProduct = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [product, setProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);
  const [newImage, setNewImage] = useState(null);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear product details while searching
    setProduct(null);
    setEditedProduct(null);

    if (value.length > 0) {
      const suggestions = mockProducts
        .filter(p => p.name.toLowerCase().includes(value.toLowerCase()))
        .map(p => p.name);
      setFilteredSuggestions(suggestions);
    } else {
      setFilteredSuggestions([]);
    }
  };

  // Handle search execution
  const handleSearch = () => {
    const foundProduct = mockProducts.find(p => p.name.toLowerCase() === searchTerm.toLowerCase());
    if (foundProduct) {
      setProduct(foundProduct);
      setEditedProduct({ ...foundProduct });
      setFilteredSuggestions([]); // Clear suggestions
    } else {
      setProduct(null);
      setEditedProduct(null);
      toast.error("Product not found");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setEditedProduct({ ...editedProduct, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(URL.createObjectURL(file));
      setEditedProduct({ ...editedProduct, image: file.name }); // Mock image name update
    }
  };

  // Handle update action
  const handleUpdate = () => {
    if (editedProduct) {
      toast.success("Product updated successfully");
    } else {
      toast.error("Internal server error, edit unsuccessful");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-center">Update Product</h1>

        {/* Search Input */}
        <div className="relative flex justify-center mt-6">
          <input
            type="text"
            placeholder="Search for a product"
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-gray-700 text-white p-2 rounded-l-md w-1/2"
          />
          <button onClick={handleSearch} className="bg-blue-500 p-2 rounded-r-md">
            <FaSearch />
          </button>
          
          {/* Autocomplete Suggestions */}
          {filteredSuggestions.length > 0 && (
            <ul className="absolute bg-gray-800 text-white w-1/2 mt-10 rounded shadow-md">
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-700"
                  onClick={() => {
                    setSearchTerm(suggestion);
                    setFilteredSuggestions([]);
                    handleSearch();
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Product Edit Form */}
        {editedProduct && (
          <div className="mt-6 bg-gray-800 p-6 rounded-md">
            <h2 className="text-xl mb-4">Edit Product Details</h2>

            {/* Display Product Image */}
            {editedProduct.image && (
              <div className="flex justify-center mb-4">
                <img
                  src={newImage || editedProduct.image}
                  alt="Product"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}

            {/* Name */}
            <label className="block text-gray-300 mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={editedProduct.name}
              onChange={handleChange}
              className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
            />

            {/* Description */}
            <label className="block text-gray-300 mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={editedProduct.description}
              onChange={handleChange}
              className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
            />

            {/* Price */}
            <label className="block text-gray-300 mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={editedProduct.price}
              onChange={handleChange}
              className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
            />

            {/* Quantity */}
            <label className="block text-gray-300 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={editedProduct.quantity}
              onChange={handleChange}
              className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
            />

            {/* Image Upload */}
            <label className="block text-gray-300 mb-1">Change Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
            />

            {/* Update Button */}
            <button onClick={handleUpdate} className="bg-green-500 p-2 rounded w-full mt-2">
              Update Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateProduct;
