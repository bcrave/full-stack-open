import axios from "axios";
const baseUrl = "/api/people";

const getAll = async () => {
  const req = axios.get(baseUrl);
  return await req.then((res) => res.data);
};

const getOne = async (name) => {
  const req = axios.get(baseUrl, { name });
  return await req.then((res) => res.data);
};

const create = async (newObject) => {
  const req = axios.post(baseUrl, newObject);
  return await req.then((res) => res.data);
};

const update = async (id, newObject) => {
  const req = axios.put(`${baseUrl}/${id}`, newObject);
  return await req.then((res) => res.data);
};

const remove = async (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default {
  getAll,
  getOne,
  create,
  update,
  remove,
};
