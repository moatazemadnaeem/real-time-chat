import axios from "axios";
const getToken = () => {
  return sessionStorage.getItem("jwt");
};
const AxiosInstance = axios.create({
  baseURL: "http://localhost:9000/api/",
  headers: {
    authentication: getToken(),
  },
});
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    console.log('interceptor',token);

    if (token) {
      config.headers["authentication"] = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export { AxiosInstance };
