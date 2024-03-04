import axios, { Axios } from "axios";

function getAxios() {
  const axiosInstance = new Axios({
    baseURL: process.env.QMAP_BASEURL,
    headers: {
      "Q-API-Key": process.env.Q_API_KEY,
      "Content-Type": "application/json",
    },
  });

  return axiosInstance;
}

export default getAxios;
