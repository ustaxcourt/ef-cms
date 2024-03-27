import { Agent } from 'http';
import axios, { AxiosInstance } from 'axios';

let axiosClient: AxiosInstance;

export const getHttpClient = (): AxiosInstance => {
  /*
  We are creating this error and interceptor to get around a known issue with axios stack traces: https://github.com/axios/axios/issues/2387.
  When axios throws an error, the stack trace does not show who called axios. This helps accurately display a stack trace when axios throws an error.
  */
  const stackError = new Error(); // Look at the stack trace for more information on the error.
  axiosClient =
    axiosClient ||
    axios.create({
      httpAgent: new Agent({ keepAlive: false }),
    });

  axiosClient.interceptors.response.use(undefined, error => {
    error.stack = stackError.stack;
    throw error;
  });

  return axiosClient;
};
