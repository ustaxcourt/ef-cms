import { login as loginDeployed } from './login';
import { login as loginLocal } from './local-login';

const SMOKETESTS_LOCAL = Cypress.env('SMOKETESTS_LOCAL');

export const getEnvironmentSpecificFunctions = () => {
  if (SMOKETESTS_LOCAL) {
    return {
      login: loginLocal,
    };
  } else {
    return {
      login: loginDeployed,
    };
  }
};
