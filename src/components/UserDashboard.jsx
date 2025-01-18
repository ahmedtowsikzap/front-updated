import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function UserDashboard() {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { userId, username, designation } = location.state || {};

  useEffect(() => {
    if (!userId) {
      setError("No user ID provided.");
      setLoading(false);
      return;
    }

    async function fetchSheets() {
      try {
        const response = await axios.get(`http://localhost:5000/api/sheets/user/${userId}`);
        if (response.data && Array.isArray(response.data)) {
          setSheets(response.data);
        } else {
          setError("No sheets found for this user.");
        }
      } catch (err) {
        setError("Failed to fetch sheets. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchSheets();
  }, [userId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="loading loading-spinner text-primary"
        ></motion.div>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-error shadow-lg max-w-xl mx-auto mt-10">
        <div>
          <span>{error}</span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-6">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <motion.h2
            className="text-4xl font-bold mb-2 text-gradient bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Welcome, {username}!
          </motion.h2>
          <p className="text-lg text-gray-700 mb-6">Designation: {designation || "Not Assigned"}</p>
        </div>
        <motion.div
          className="space-y-6 mt-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { delayChildren: 0.2, staggerChildren: 0.1 },
            },
          }}
        >
          {sheets.length > 0 ? (
            sheets.map((sheet) => (
              <motion.div
                key={sheet._id}
                className="card shadow-xl bg-white transition-transform hover:scale-105 hover:shadow-2xl"
                whileHover={{ scale: 1.02 }}
              >
                <div className="card-body">
                  <h3 className="card-title text-lg font-semibold">{sheet.sheetName}</h3>
                  <a
                    href={sheet.sheetUrl}
                    className="btn btn-primary mt-4"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Sheet
                  </a>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-lg text-gray-600">No sheets assigned to you</p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default UserDashboard;
