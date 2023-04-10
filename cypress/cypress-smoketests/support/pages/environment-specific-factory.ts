const {
  closeScannerSetupDialog: closeScannerSetupDialogDeployed,
} = require('./create-paper-case');
const {
  closeScannerSetupDialog: closeScannerSetupDialogLocal,
} = require('./create-paper-case-local');
const {
  getRestApi: getRestApiDeployed,
  getUserToken: getUserTokenDeployed,
  login: loginDeployed,
} = require('./login');
const {
  getRestApi: getRestApiLocal,
  getUserToken: getUserTokenLocal,
  login: loginLocal,
} = require('./local-login');

const SMOKETESTS_LOCAL = Cypress.env('SMOKETESTS_LOCAL');

exports.getEnvironmentSpecificFunctions = () => {
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
