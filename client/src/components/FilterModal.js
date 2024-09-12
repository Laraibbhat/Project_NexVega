import React, { useState } from "react";
import { motion } from "framer-motion";

const FilterModal = ({ isOpen, onClose, filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h2 className="text-lg font-semibold mb-4">Filter Candidates</h2>
        <div className="space-y-4">
          {Object.keys(localFilters).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="font-medium">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type="text"
                name={key}
                value={localFilters[key]}
                onChange={handleChange}
                className="mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder={`Filter by ${key}`}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
            onClick={handleApply}
          >
            Apply
          </button>
          <button
            className="ml-2 px-4 py-2 bg-gray-300 text-black rounded-md shadow-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FilterModal;
