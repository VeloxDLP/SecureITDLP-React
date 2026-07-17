// Only authentication-related APIs live here.

import { API_ENDPOINTS } from "../constants/api";
import axiosClient from "./axiosClient";
// import { API_ENDPOINTS } from "./endpoints";

export const loginApi = (username, password) => {

  return axiosClient.post(
    API_ENDPOINTSNTS.LOGIN,
    {
      username,
      password,
    }
  );

};