import { closeScannerSetupDialog as closeScannerSetupDialogDeployed } from './create-paper-case';
import { closeScannerSetupDialog as closeScannerSetupDialogLocal } from './create-paper-case-local';

import {
  getRestApi as getRestApiDeployed,
  getUserToken as getUserTokenDeployed,
  login as loginDeployed,
} from './login';

import {
  getRestApi as getRestApiLocal,
  getUserToken as getUserTokenLocal,
  login as loginLocal,
} from './local-login';

const SMOKETESTS_LOCAL = Cypress.env('SMOKETESTS_LOCAL');

export const getEnvironmentSpecificFunctions = () => {
  if (SMOKETESTS_LOCAL) {
    return {
      closeScannerSetupDialog: closeScannerSetupDialogLocal,
      getRestApi: getRestApiLocal,
      getUserToken: getUserTokenLocal,
      login: loginLocal,
    };
  } else {
    return {
      closeScannerSetupDialog: closeScannerSetupDialogDeployed,
      getRestApi: getRestApiDeployed,
      getUserToken: getUserTokenDeployed,
      login: loginDeployed,
    };
  }
};
