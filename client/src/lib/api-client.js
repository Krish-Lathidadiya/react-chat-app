import axios from "axios";
import { HOST } from "@/utils/constants";

console.log("host", HOST);

export const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true, 
});
