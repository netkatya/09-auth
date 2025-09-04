import axios, { type AxiosResponse } from "axios";

const nextServer = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});
