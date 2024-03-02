import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { apiPrivate } from "../api/services/Api";

function useAxiosPrivate() {
  const { authTokens, refresh } = useAuth();

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
        if (
          (err?.response?.status === 403 || err?.response?.status === 401) &&
          !prevRequest?.sent
        ) {
          prevRequest.sent = true;
          console.log(authTokens?.refresh);
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return apiPrivate(prevRequest);
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
