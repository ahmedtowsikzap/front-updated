import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';



function Login() {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { username, password });
      console.log("Login Response Data:", response.data);
      const { message, role, userId, username: dbUsername, designation } = response.data;

      alert(message);

      if (role === 'CEO' || role === 'Manager') {
        navigate('/admin', { state: { role, username: dbUsername } });
      } else if (role === 'User') {
        navigate('/user', { state: { userId, username: dbUsername, designation } });
      } else {
        alert('Unknown role. Please contact support.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      alert(errorMessage);
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center px-4"
      style={{ backgroundColor: '#E2136E' }}
    >
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Team Govaly</h2>
        <p className="text-center text-gray-500 mb-8">Please log in to your account</p>
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition-transform duration-200 focus:scale-105 animated-cursor"
            />
          </div>
          <div className="mb-6 relative">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <div className="flex items-center border border-gray-300 rounded focus-within:ring-2 focus-within:ring-pink-500 transition-transform duration-200 focus-within:scale-105">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 p-3 rounded-l focus:outline-none animated-cursor"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-3 text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white font-bold py-3 rounded hover:bg-pink-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
