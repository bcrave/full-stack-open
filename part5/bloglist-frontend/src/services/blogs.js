import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const res = await axios.get(baseUrl);
  return res.data;
};

const getById = async (id) => {
  const res = await axios.get(`${baseUrl}/${id}`);
  return res.data;
}

const create = async (blog) => {
  const config = {
    headers: { Authorization: token },
  };

  const res = await axios.post(baseUrl, blog, config);
  return res.data;
};

const update = async (id, blog) => {
  const res = await axios.put(`${baseUrl}/${id}`, blog);
  return res.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const res = await axios.delete(`${baseUrl}/${id}`, config);
  return res;
};
export default { getAll, getById, create, update, remove, setToken };
