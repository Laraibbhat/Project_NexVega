import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FilterModal from "./FilterModal";

const CandidateList = ({ isAdmin = false }) => {
  const [candidateList, setCandidatesList] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    skills: "",
    location: "",
    experience: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const result = await axios.get("http://localhost:5000/candidates");
        setCandidatesList(result.data);
      } catch (error) {
        console.error("Failed to fetch candidates", error);
      }
    };
    fetchCandidates();
  }, []);

  useEffect(() => {
    let filtered = candidateList;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (candidate) =>
          candidate.firstName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (candidate.skills || []).some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          candidate.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.yearsOfExperience.toString().includes(searchTerm)
      );
    }

    // Apply column filters
    if (filters.name) {
      filtered = filtered.filter(
        (candidate) =>
          candidate.firstName
            .toLowerCase()
            .includes(filters.name.toLowerCase()) ||
          candidate.lastName.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    if (filters.skills) {
      filtered = filtered.filter((candidate) => {
        const skills = String(candidate.skills || ""); // Ensure skills is a string and handle null/undefined
        const skillsArray = skills
          .split(",")
          .map((skill) => skill.trim().toLowerCase());
        return skillsArray.includes(filters.skills.toLowerCase());
      });
    }
    if (filters.location) {
      filtered = filtered.filter((candidate) =>
        candidate.location
          .toLowerCase()
          .includes(filters.location.toLowerCase())
      );
    }
    if (filters.experience) {
      filtered = filtered.filter((candidate) =>
        candidate.yearsOfExperience.toString().includes(filters.experience)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered = filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredCandidates(filtered);
  }, [candidateList, filters, searchTerm, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prevSortConfig) => ({
      key,
      direction: prevSortConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      name: "",
      skills: "",
      location: "",
      experience: "",
    });
    setSearchTerm(""); // Also clear the search term
  };

  const handleButtonClick = () => {
    navigate("/add");
  };

  const handleRowClick = (candidate) => {
    navigate("/profile", { state: candidate });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Determine if any filters are applied
  const isAnyFilterApplied =
    Object.values(filters).some((value) => value !== "") || searchTerm !== "";

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-4 py-2 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <button
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
            onClick={() => setIsModalOpen(true)}
          >
            Filter
          </button>
          {isAnyFilterApplied && (
            <button
              className="ml-4 px-4 py-2 bg-red-500 text-white rounded-md shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-300"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
        {isAdmin && (
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
            onClick={handleButtonClick}
          >
            Add New Candidate
          </button>
        )}
      </motion.div>

      <FilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <motion.table
        className="table-auto w-full bg-white shadow-md rounded-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <thead className="bg-gray-200 text-gray-700">
          <tr className="text-left">
            <th className="px-6 py-3">
              <div className="flex items-center">
                <span>Full Name</span>
                <button
                  onClick={() => handleSort("firstName")}
                  className="ml-2 px-2 py-1 text-blue-500 hover:text-blue-700"
                >
                  {sortConfig.key === "firstName"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : "▲▼"}
                </button>
              </div>
            </th>
            <th className="px-6 py-3">
              <div className="flex items-center">
                <span>Skills</span>
                <button
                  onClick={() => handleSort("skills")}
                  className="ml-2 px-2 py-1 text-blue-500 hover:text-blue-700"
                >
                  {sortConfig.key === "skills"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : "▲▼"}
                </button>
              </div>
            </th>
            <th className="px-6 py-3">
              <div className="flex items-center">
                <span>Experience</span>
                <button
                  onClick={() => handleSort("yearsOfExperience")}
                  className="ml-2 px-2 py-1 text-blue-500 hover:text-blue-700"
                >
                  {sortConfig.key === "yearsOfExperience"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : "▲▼"}
                </button>
              </div>
            </th>
            <th className="px-6 py-3">
              <div className="flex items-center">
                <span>Location</span>
                <button
                  onClick={() => handleSort("location")}
                  className="ml-2 px-2 py-1 text-blue-500 hover:text-blue-700"
                >
                  {sortConfig.key === "location"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : "▲▼"}
                </button>
              </div>
            </th>
            {isAdmin && <th className="px-6 py-3">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredCandidates.map((candidate) => (
            <motion.tr
              key={candidate._id}
              className="border-b border-gray-300 hover:bg-gray-100 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => handleRowClick(candidate)}
            >
              <td className="px-6 py-4">
                {candidate.firstName} {candidate.lastName}
              </td>
              <td className="px-6 py-4">{candidate?.skills.join(" ")}</td>
              <td className="px-6 py-4">{candidate.yearsOfExperience} years</td>
              <td className="px-6 py-4">{candidate.location}</td>
              {isAdmin && (
                <td className="px-6 py-4 flex space-x-2">
                  <button
                    className="mr-4 px-4 py-2 bg-yellow-500 text-white rounded-md shadow-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-300"
                    // onClick={() => handleRowClick(candidate)}
                  >
                    View Profile
                  </button>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  );
};

export default CandidateList;
