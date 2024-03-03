import { AxiosInstance } from "../../axiosConfig/AxiosConfig";

export const chatApi=async(url='',method='',requestBody={},chatId='')=>{
    try {
    const { data } = await AxiosInstance[method](`chat/${url}`, {
        ...requestBody,
        chatId,
    });
        return data;
    } catch (error) {
        throw(
            error?.response || "Something went wrong please try again"
        );
    }
} 

