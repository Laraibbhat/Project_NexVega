import React, { useEffect, useState } from "react";
import CandidateList from "./CandidateList";
import axios from "axios";
import ResultsChart from "./ResultCharts";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline"; // Ensure you have @heroicons/react installed

const AdminDashboard = () => {
  const [candidatesList, setCandidatesList] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      const result = await axios.get("http://localhost:5000/candidates");
      setCandidatesList(result.data);
    };
    fetchCandidates();
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl  font-bold mb-4">Admin Dashboard</h1>

      <div className=" mb-2 cursor-pointer p-4" onClick={toggleExpand}>
        {isExpanded ? (
          <ChevronDownIcon className="h-6 w-6 text-white-500" />
        ) : (
          <ChevronRightIcon className="h-6 w-6 text-white-500" />
        )}
      </div>
      {isExpanded && (
        <div className=" bg-gray-100 mb-4 flex items-center justify-center">
          <ResultsChart data={candidatesList} />
        </div>
      )}
      <CandidateList isAdmin />
    </div>
  );
};

export default AdminDashboard;
