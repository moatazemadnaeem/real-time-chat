import { AxiosInstance } from "../../axiosConfig/AxiosConfig";
export const authApiCall = async (url, bodyData) => {
  try {
    const user = await AxiosInstance.post(`users/${url}`, bodyData);
    if (user) {
      return user;
    }
  } catch (error) {
    console.log(error)
    throw new Error(
      error?.response?.data?.msg || "Something went wrong please try again."
    );
  }
};
