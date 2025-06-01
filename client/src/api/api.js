import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // Change this if your backend runs elsewhere
});

export default API;
