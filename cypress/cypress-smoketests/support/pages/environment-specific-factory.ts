import { closeScannerSetupDialog as closeScannerSetupDialogDeployed } from './create-paper-case';
import { closeScannerSetupDialog as closeScannerSetupDialogLocal } from './create-paper-case-local';

import { login as loginDeployed } from './login';
import { login as loginLocal } from './local-login';

const SMOKETESTS_LOCAL = Cypress.env('SMOKETESTS_LOCAL');

export const getEnvironmentSpecificFunctions = () => {
  if (SMOKETESTS_LOCAL) {
    return {
      closeScannerSetupDialog: closeScannerSetupDialogLocal,
      login: loginLocal,
    };
  } else {
    return {
      closeScannerSetupDialog: closeScannerSetupDialogDeployed,
      login: loginDeployed,
    };
  }
};
