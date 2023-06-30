import { login as loginDeployed } from './login';

export const getEnvironmentSpecificFunctions = () => {
  return {
    login: loginDeployed,
  };
};
