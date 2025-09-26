import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5555", 
});

export default API;
