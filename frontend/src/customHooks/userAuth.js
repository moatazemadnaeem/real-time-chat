import { useEffect, useState } from "react";
import { AxiosInstance } from "../axiosConfig/AxiosConfig";
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data } = await AxiosInstance.get("users/current-user");
        if (data) {
          setUser(data);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    getCurrentUser();
  }, []);

  return { user, loading };
}
