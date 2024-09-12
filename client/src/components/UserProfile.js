import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import avatar from "../assests/avatar.jpg";

const UserProfile = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Import useNavigate
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const candidate = location.state;
      if (candidate) {
        try {
          const result = await axios.get(
            `http://localhost:5000/user/profile?firstName=${candidate.firstName}&lastName=${candidate.lastName}`
          );
          setProfile(result.data);
        } catch (error) {
          console.error("Failed to fetch profile", error);
        }
        setLoading(false);
      }
    };
    fetchProfile();
  }, [location.state]);

  const onEdit = (candidate) => {
    console.log(JSON.stringify(candidate));
    navigate("/add", { state: candidate });
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile data available</div>;

  const containerVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      className="container mx-auto p-6 bg-gradient-to-br from-blue-200 via-white to-blue-300 rounded-lg shadow-lg relative"
      initial="hidden"
      animate="visible"
      variants={containerVariant}
    >
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          src={avatar}
          alt={profile.firstName}
          className="w-40 h-40 rounded-full border-4 border-blue-500 shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
        />

        <motion.h2
          className="text-4xl font-bold mt-4 text-blue-700"
          variants={itemVariant}
        >
          {`${profile.firstName} ${profile.lastName}`}
        </motion.h2>

        <motion.p
          className="mt-2 text-lg text-gray-700 text-center max-w-lg"
          variants={itemVariant}
        >
          {profile.bio || "Software Developer."}
        </motion.p>

        <motion.div
          className="mt-4 flex flex-wrap justify-center"
          variants={itemVariant}
        >
          {profile.skills?.map((skill, index) => (
            <motion.span
              key={index}
              className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium m-1 shadow-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center"
          variants={itemVariant}
        >
          <motion.div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-500">Location</p>
            <p className="text-xl font-semibold">{profile.location}</p>
          </motion.div>

          <motion.div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-500">Experience</p>
            <p className="text-xl font-semibold">
              {profile.yearsOfExperience} years
            </p>
          </motion.div>
        </motion.div>

        <motion.button
          onClick={() => onEdit(profile)}
          className="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Edit Profile
        </motion.button>
      </motion.div>

      <motion.div
        className="absolute inset-0 z-[-1] opacity-20"
        initial={{ x: "100vw", opacity: 0 }}
        animate={{ x: 0, opacity: 0.2 }}
        transition={{ duration: 1.5, type: "spring" }}
      >
        <div className="bg-blue-300 rounded-full h-64 w-64 absolute top-10 right-10 filter blur-xl"></div>
        <div className="bg-yellow-300 rounded-full h-40 w-40 absolute top-40 left-20 filter blur-xl"></div>
        <div className="bg-pink-300 rounded-full h-56 w-56 absolute bottom-20 right-0 filter blur-xl"></div>
      </motion.div>
    </motion.div>
  );
};

export default UserProfile;
