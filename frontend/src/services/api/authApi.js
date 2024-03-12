import { AxiosInstance } from "../../axiosConfig/AxiosConfig";
export const authApiCall = async (url, method = "post", bodyData = {}) => {
  try {
    const response = await AxiosInstance[method](`users/${url}`, bodyData);
    if (response) {
      return response;
    }
  } catch (error) {
    throw new Error(
      error?.response?.data?.msg || "Something went wrong please try again."
    );
  }
};
