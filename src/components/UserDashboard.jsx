import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function UserDashboard() {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { userId, username } = location.state || {};

  // Check if userId is not passed or not
  useEffect(() => {
    if (!userId) {
      setError("No user ID provided.");
      setLoading(false);
      return;
    }

    async function fetchSheets() {
      try {
        console.log("Fetching sheets for userId:", userId); // Debug userId
        const response = await axios.get(`http://localhost:5000/api/sheets/user/${userId}`);
        
        if (response.data && Array.isArray(response.data)) {
          console.log("Fetched sheets:", response.data); // Debug API response
          setSheets(response.data);
        } else {
          setError("No sheets found for this user.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sheets:", error);
        setError("Failed to fetch sheets. Please try again.");
        setLoading(false);
      }
    }

    fetchSheets();
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className="p-8">
      <h2 className="text-3xl mb-4">Welcome, {username}!</h2>
      <div className="space-y-4">
        {sheets.length > 0 ? (
          sheets.map((sheet) => (
            <div key={sheet._id} className="bg-white p-4 rounded shadow-md">
              <a
                href={sheet.sheetUrl}
                className="text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Sheet
              </a>
            </div>
          ))
        ) : (
          <p>No sheets assigned to you</p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
