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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
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
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Welcome, {username}!
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            Designation: {designation || "Not Assigned"}
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6 mt-6">
          {sheets.length > 0 ? (
            sheets.map((sheet) => (
              <motion.div
                key={sheet._id}
                className="card shadow-lg bg-white transition-transform hover:scale-105 hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="card-body p-4 sm:p-6">
                  <h3 className="card-title text-base sm:text-lg font-semibold">{sheet.sheetName}</h3>
                  <a
                    href={sheet.sheetUrl}
                    className="btn btn-primary mt-4 w-full sm:w-auto"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Sheet
                  </a>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center">
              <p className="text-sm sm:text-lg text-gray-600">No sheets assigned to you</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
