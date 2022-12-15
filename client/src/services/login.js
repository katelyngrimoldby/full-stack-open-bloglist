import axios from 'axios';
const baseUrl = '/api/login';

const login = async (payload) => {
  const response = await axios.post(baseUrl, payload);
  return response.data;
};

export default login;