import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp, FaBox, FaChartBar, FaSignOutAlt, FaUserCog, FaLock } from "react-icons/fa";
import logo from "../assets/images/sotechlogo.png";


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleSubMenu = (menu) => setOpenSubMenu(openSubMenu === menu ? null : menu);

  return (
    <div className="relative">
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleSidebar} 
        className="md:hidden p-3 text-white fixed top-4 left-4 bg-gray-800 rounded">
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 bg-gray-900 text-white w-64 transform transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0 md:relative`}>
        
        {/* Logo */}
        <div className="flex items-center justify-center p-4 border-b border-gray-700">
          <img src={logo} alt="Logo" className="w-32 h-auto" />
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {/* Manage Users with Submenu */}
            <li>
              <button 
                className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded" 
                onClick={() => toggleSubMenu("users")}>
                <span className="flex items-center"><FaUserCog className="mr-2" /> Manage Users</span>
                {openSubMenu === "users" ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {openSubMenu === "users" && (
                <ul className="ml-6 space-y-1">
                  <li><Link to="/admin/create-operator" className="block p-2 hover:bg-gray-700 rounded">Create An Operator</Link></li>
                  <li><Link to="/admin/view-operators" className="block p-2 hover:bg-gray-700 rounded">View All Operators</Link></li>

                </ul>
              )}
            </li>

            {/* Manage Products with Submenu */}
            <li>
              <button 
                className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded" 
                onClick={() => toggleSubMenu("products")}>
                <span className="flex items-center"><FaBox className="mr-2" /> Manage Products</span>
                {openSubMenu === "products" ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {openSubMenu === "products" && (
                <ul className="ml-6 space-y-1">
                  <li><Link to="/admin/add-product" className="block p-2 hover:bg-gray-700 rounded">Create Product</Link></li>
                  <li><Link to="/admin/view-products" className="block p-2 hover:bg-gray-700 rounded">View All Products</Link></li>


                  <li><Link to="/admin/search-product" className="block p-2 hover:bg-gray-700 rounded">Search For Product</Link></li>
                </ul>
              )}
            </li>
            
            {/* Generate Reports with Submenu */}
            <li>
              <button 
                className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded" 
                onClick={() => toggleSubMenu("reports")}>
                <span className="flex items-center"><FaChartBar className="mr-2" /> Generate Reports</span>
                {openSubMenu === "reports" ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {openSubMenu === "reports" && (
                <ul className="ml-6 space-y-1">
                  <li><Link to="/admin/daily-issues" className="block p-2 hover:bg-gray-700 rounded">View Daily Issues</Link></li>
                  <li><Link to="/admin/weekly-issues" className="block p-2 hover:bg-gray-700 rounded">View Weekly Issues</Link></li>
                </ul>
              )}
            </li>
            
            {/* Change Password */}
            <li>
              <Link to="/admin/change-password" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaLock className="mr-2" /> Change Password
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
