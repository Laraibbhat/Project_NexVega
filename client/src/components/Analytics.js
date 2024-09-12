import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

function Analytics() {
  const [candidateList, setCandidatesList] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      const result = await axios.get("http://localhost:5000/candidates");
      setCandidatesList(result.data);
    };
    fetchCandidates();
  }, []);

  const passCount = candidateList.filter(
    (candidate) => candidate.videoInterviewResult === "Pass"
  ).length;
  const failCount = candidateList.filter(
    (candidate) => candidate.videoInterviewResult === "Fail"
  ).length;
  const pendingCount = candidateList.filter(
    (candidate) => candidate.videoInterviewResult === "Pending"
  ).length;

  const videoInterviewData = [
    { name: "Pass", value: passCount },
    { name: "Fail", value: failCount },
    { name: "Pending", value: pendingCount },
  ];

  const COLORS = ["#4CAF50", "#F44336", "#FFC107"];

  const groupedData = [
    {
      name: "Pass",
      videoInterview: passCount,
      codingTest: candidateList.filter(
        (candidate) => candidate.codingResult === "Pass"
      ).length,
    },
    {
      name: "Fail",
      videoInterview: failCount,
      codingTest: candidateList.filter(
        (candidate) => candidate.codingResult === "Fail"
      ).length,
    },
  ];

  const skillFrequency = {};
  candidateList.forEach((candidate) => {
    candidate.skills.forEach((skill) => {
      if (!skillFrequency[skill]) {
        skillFrequency[skill] = 1;
      } else {
        skillFrequency[skill] += 1;
      }
    });
  });
  const skillsData = Object.entries(skillFrequency).map(([skill, count]) => ({
    name: skill,
    value: count,
  }));

  const experienceData = candidateList.reduce((acc, candidate) => {
    const experience = candidate.yearsOfExperience;
    if (!acc[experience]) {
      acc[experience] = 1;
    } else {
      acc[experience] += 1;
    }
    return acc;
  }, {});

  const yearsOfExperienceData = Object.entries(experienceData).map(
    ([experience, count]) => ({
      name: `${experience} years`,
      value: count,
    })
  );

  const locationData = candidateList.reduce((acc, candidate) => {
    const location = candidate.location;
    if (!acc[location]) {
      acc[location] = 1;
    } else {
      acc[location] += 1;
    }
    return acc;
  }, {});

  const locationDistributionData = Object.entries(locationData).map(
    ([location, count]) => ({
      name: location,
      value: count,
    })
  );

  const fadeInVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const chartVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInVariant}
      className="p-8"
    >
      <h1 className="text-2xl font-bold mb-8 text-white">
        Analytics Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          initial="hidden"
          animate="visible"
          variants={chartVariants}
        >
          <h2 className="text-xl font-semibold mb-4">
            Video Interview Results
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={videoInterviewData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {videoInterviewData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          initial="hidden"
          animate="visible"
          variants={chartVariants}
        >
          <h2 className="text-xl font-semibold mb-4">
            Passed and Failed Candidates
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={groupedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="videoInterview"
                fill="#8884d8"
                name="Video Interview"
              />
              <Bar dataKey="codingTest" fill="#82ca9d" name="Coding Test" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Additional Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* 1. Skills Distribution Pie Chart */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          initial="hidden"
          animate="visible"
          variants={chartVariants}
        >
          <h2 className="text-xl font-semibold mb-4">Skills Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={skillsData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#82ca9d"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 2. Years of Experience Distribution Bar Chart */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          initial="hidden"
          animate="visible"
          variants={chartVariants}
        >
          <h2 className="text-xl font-semibold mb-4">
            Years of Experience Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearsOfExperienceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* 3. Location-based Distribution */}
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md"
        initial="hidden"
        animate="visible"
        variants={chartVariants}
      >
        <h2 className="text-xl font-semibold mb-4">
          Location-based Candidate Distribution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={locationDistributionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#FFBB28" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}

export default Analytics;
