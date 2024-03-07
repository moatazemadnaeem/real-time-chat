import { useEffect } from "react";
import { AxiosInstance } from "../axiosConfig/AxiosConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  req_user,
  success_get_user,
  failuare_get_user,
} from "../redux/features/user/createUserSlice";
export function useAuth() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        dispatch(req_user());
        const { data } = await AxiosInstance.get("users/current-user");
        if (data) {
          dispatch(success_get_user(data));
        }
      } catch (error) {
        dispatch(
          failuare_get_user(
            error?.response?.data?.msg || "Something went wrong!"
          )
        );
      }
    };
    getCurrentUser();
  }, []);

  return { user, loading, error };
}
