import { closeScannerSetupDialogIfExists as closeScannerSetupDialogDeployed } from './create-paper-case';
import { closeScannerSetupDialogIfExists as closeScannerSetupDialogLocal } from './create-paper-case-local';

import { login as loginDeployed } from './login';
import { login as loginLocal } from './local-login';

const SMOKETESTS_LOCAL = Cypress.env('SMOKETESTS_LOCAL');

export const getEnvironmentSpecificFunctions = () => {
  if (SMOKETESTS_LOCAL) {
    return {
      closeScannerSetupDialogIfExists: closeScannerSetupDialogLocal,
      login: loginLocal,
    };
  } else {
    return {
      closeScannerSetupDialogIfExists: closeScannerSetupDialogDeployed,
      login: loginDeployed,
    };
  }
};
