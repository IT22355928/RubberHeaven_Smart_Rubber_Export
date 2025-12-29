import { useState, useEffect } from "react";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useUser() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>();
  const [error, setError] = useState('');

  useEffect(() => {
    const subscription = async () => {
      const accessToken = await AsyncStorage.getItem("access_token");
      const refreshToken = await AsyncStorage.getItem("refresh_token");
      await axios
        .get(`${SERVER_URI}/me`, {
          headers: {
            "access-token": accessToken,
            "refresh-token": refreshToken,
          },
        })
        .then((res:any) => {
          setUser(res.data.user);
          setLoading(false);
        })
        .catch((error: any) => {
         setError(error?.message);
         setLoading(false);
        });
    };

    subscription();
  }, []);

  return { loading, user, error };
}
