import { useEffect } from "react";
import { apiPrivate } from "../api/services/Api";
import { useAuth } from "./useAuth";

function useAxiosPrivate() {
  const { authTokens, SignOut, refresh } = useAuth();

  useEffect(() => {
    const requestIntercept = apiPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${authTokens?.access}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const responseIntercept = apiPrivate.interceptors.response.use(
      (response) => response,
      async (err) => {
        const prevRequest = err?.config;
        if (err?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          console.log("old expired. New aT: " + newAccessToken);
          return apiPrivate(prevRequest);
        } else if (err?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          SignOut();
        }
        return Promise.reject(err);
      }
    );

    return () => {
      apiPrivate.interceptors.request.eject(requestIntercept);
      apiPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [
    authTokens,
    // refresh
  ]);

  return apiPrivate;
}

export default useAxiosPrivate;
