// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://govalyteams-byxuyh4b1-jeion-ahmeds-projects.vercel.app/api',
});

export default api;
