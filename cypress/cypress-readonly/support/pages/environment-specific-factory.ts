import {
  getRestApi as getRestApiDeployed,
  getUserToken as getUserTokenDeployed,
  login as loginDeployed,
} from './login';

export const getEnvironmentSpecificFunctions = () => {
  return {
    getRestApi: getRestApiDeployed,
    getUserToken: getUserTokenDeployed,
    login: loginDeployed,
  };
};
