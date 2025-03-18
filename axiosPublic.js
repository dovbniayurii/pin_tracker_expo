import axios from 'axios';
const API_URL = 'http://108.181.199.70:7000';
const axiosPublic = axios.create({
  baseURL: API_URL,
});

export default axiosPublic;
