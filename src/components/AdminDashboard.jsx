import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  HiOutlineUpload,
  HiOutlineLink,
  HiOutlineUser,
  HiOutlineDocumentText
} from "react-icons/hi"; // Example: react-icons

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [selectedSheetUrl, setSelectedSheetUrl] = useState("");
  const [newSheetUrl, setNewSheetUrl] = useState("");
  const [newSheetName, setNewSheetName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [newDesignation, setNewDesignation] = useState("");

  const location = useLocation();
  const { username, role } = location.state || "";

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersResponse, sheetsResponse] = await Promise.all([
          axios.get("https://govalyteams.vercel.app/api/users"),
          axios.get("https://govalyteams.vercel.app/api/sheets"),
        ]);

        setUsers(usersResponse.data);
        setSheets(sheetsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const uploadSheet = async () => {
    if (!newSheetUrl.trim() || !newSheetName.trim()) {
      alert("Please enter both sheet name and sheet URL.");
      return;
    }

    try {
      const response = await axios.post(
        "https://govalyteams.vercel.app/api/sheets/create",
        {
          sheetUrl: newSheetUrl,
          sheetName: newSheetName,
        }
      );
      setSheets([...sheets, response.data.sheet]);
      alert("Sheet uploaded successfully!");
      setNewSheetUrl("");
      setNewSheetName("");
    } catch (error) {
      console.error("Error uploading sheet:", error);
      alert("Failed to upload sheet. Please try again.");
    }
  };

  const assignSheetToUser = async () => {
    if (!selectedUsername || !selectedSheetUrl) {
      alert("Please select both a user and a sheet.");
      return;
    }

    try {
      await axios.post("https://govalyteams.vercel.app/api/sheets/assign", {
        username: selectedUsername,
        sheetUrl: selectedSheetUrl,
        role,
      });
      window.location.reload();

      alert("Sheet assigned successfully!");
    } catch (error) {
      console.error("Error assigning sheet:", error);
      alert("Failed to assign sheet. Please try again.");
    }
  };

  const deleteSheet = async (sheetId) => {
    try {
      await axios.delete(`https://govalyteams.vercel.app/api/sheets/${sheetId}`, {
        data: { role },
      });
      setSheets(sheets.filter((sheet) => sheet._id !== sheetId));
      alert("Sheet deleted successfully!");
    } catch (error) {
      console.error("Error deleting sheet:", error);
      alert("Failed to delete sheet. Please try again.");
    }
  };

  const createUser = async () => {
    if (!newUsername || !newPassword || !newRole || !newDesignation) {
      alert("Please fill in all fields for the new user.");
      return;
    }

    try {
      const response = await axios.post(
        "https://govalyteams.vercel.app/api/users/create",
        {
          username: newUsername,
          password: newPassword,
          role: newRole,
          designation: newDesignation,
        }
      );
      setUsers([...users, response.data.user]);
      alert("User created successfully!");
      setNewUsername("");
      setNewPassword("");
      setNewRole("");
      setNewDesignation("");

      window.location.reload();
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-screen-lg mx-auto bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-4xl font-semibold text-gray-800 mb-6">
          Welcome <strong>{username}</strong>
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Role: <strong>{role}</strong>
        </p>

        {role !== "CEO" && role !== "Manager" ? (
          <p className="text-red-500 font-semibold text-lg">
            You do not have permission to access admin features.
          </p>
        ) : (
          <>
            {errorMessage && (
              <p className="text-red-500 mb-4">{errorMessage}</p>
            )}

            <div className="space-y-8">
              {/* Upload Sheet Section */}
              <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                <motion.h3
                  className="text-2xl font-semibold text-gray-800 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Upload a New Sheet
                </motion.h3>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center mb-4">
                    <HiOutlineUpload className="text-gray-600 mr-3" />
                    <input
                      type="text"
                      value={newSheetName}
                      onChange={(e) => setNewSheetName(e.target.value)}
                      placeholder="Enter Sheet Name"
                      className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center mb-4">
                    <HiOutlineLink className="text-gray-600 mr-3" />
                    <input
                      type="text"
                      value={newSheetUrl}
                      onChange={(e) => setNewSheetUrl(e.target.value)}
                      placeholder="Enter Google Sheets URL"
                      className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </motion.div>

                <motion.button
                  onClick={uploadSheet}
                  className="bg-green-500 text-white p-3 rounded-lg w-full hover:bg-green-600 transition-all duration-300 flex items-center justify-center space-x-3"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <HiOutlineUpload className="text-white" />
                  <span>Upload Sheet</span>
                </motion.button>
              </div>

              {/* Assign Sheet Section */}
              <div className="bg-green-50 p-6 rounded-lg shadow-md">
                <motion.h3
                  className="text-2xl font-semibold text-gray-800 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Assign Sheet to User
                </motion.h3>

                {/* User Selection */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center mb-4">
                    <HiOutlineUser className="text-gray-600 mr-3" />
                    <select
                      onChange={(e) => setSelectedUsername(e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                      value={selectedUsername}
                    >
                      <option value="">Select User</option>
                      {users.map((user) => (
                        <option key={user._id} value={user.username}>
                          {user.username}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>

                {/* Sheet Selection */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center mb-4">
                    <HiOutlineDocumentText className="text-gray-600 mr-3" />
                    <select
                      onChange={(e) => setSelectedSheetUrl(e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                      value={selectedSheetUrl}
                    >
                      <option value="">Select Sheet</option>
                      {sheets.map((sheet) => (
                        <option key={sheet._id} value={sheet.sheetUrl}>
                          {sheet.sheetName}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>

                {/* Button with Animation */}
                <motion.button
                  onClick={assignSheetToUser}
                  className="bg-blue-500 text-white p-3 rounded-lg w-full hover:bg-blue-600 transition-all duration-300 flex items-center justify-center space-x-3"
                  disabled={!selectedUsername || !selectedSheetUrl}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <HiOutlineDocumentText className="text-white" />
                  <span>Assign Sheet</span>
                </motion.button>
              </div>

              {/* Create New User Section */}
              <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Create a New User
                </h3>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter Username"
                  className="p-3 border border-gray-300 rounded-lg w-full mb-4"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="p-3 border border-gray-300 rounded-lg w-full mb-4"
                />
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg w-full mb-4"
                >
                  <option value="">Select Role</option>
                  <option value="User">User</option>
                </select>
                <input
                  type="text"
                  value={newDesignation}
                  onChange={(e) => setNewDesignation(e.target.value)}
                  placeholder="Enter Designation"
                  className="p-3 border border-gray-300 rounded-lg w-full mb-4"
                />
                <button
                  onClick={createUser}
                  className="bg-purple-500 text-white p-3 rounded-lg"
                >
                  Create User
                </button>
              </div>

              {/* Sheets Table */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Sheets and Assignments
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300 table-auto">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left">Sheet Name</th>
                        <th className="px-6 py-3 text-left">Sheet Actions</th>
                        <th className="px-6 py-3 text-left">Assigned Users</th>
                        <th className="px-6 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sheets.map((sheet) => (
                        <tr
                          key={sheet._id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-6 py-3 text-sm md:text-base">
                            {sheet.sheetName}
                          </td>
                          <td className="px-6 py-3 text-sm md:text-base">
                            <button
                              onClick={() =>
                                window.open(sheet.sheetUrl, "_blank")
                              } // Open URL in a new tab
                              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300 w-full sm:w-auto"
                            >
                              View Sheet
                            </button>
                          </td>
                          <td className="px-6 py-3 text-sm md:text-base">
                            {sheet.assignedTo.length > 0
                              ? sheet.assignedTo
                                  .map((userId) => {
                                    const user = users.find(
                                      (user) => user._id === userId
                                    );
                                    return user ? user.username : "Unknown";
                                  })
                                  .join(", ")
                              : "No users assigned"}
                          </td>
                          <td className="px-6 py-3 text-sm md:text-base">
                            <div className="flex justify-center items-center space-x-3">
                              <button
                                onClick={() => deleteSheet(sheet._id)}
                                className="bg-red-500 text-white p-2  rounded-lg hover:bg-red-600 transition duration-300 w-full sm:w-auto"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
