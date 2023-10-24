import axios, { AxiosInstance } from 'axios';

let axiosClient: AxiosInstance;

export const getHttpClient = (): AxiosInstance => {
  const stackError = new Error();
  axiosClient = axiosClient || axios.create();

  axiosClient.interceptors.response.use(undefined, error => {
    error.stack = stackError.stack;
    throw error;
  });

  return axiosClient;
};
