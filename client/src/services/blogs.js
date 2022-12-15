import axios from 'axios';
const baseUrl = '/api/blogs';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const addNew = async (payload, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  };

  const response = await axios.post(baseUrl, payload, config);
  return response.data;
};

const update = async (id, payload) => {
  const response = await axios.put(`${baseUrl}/${id}`, payload);
  return response.data;
};

const deleteBlog = async (id, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response;
};

export default { getAll, addNew, update, deleteBlog };