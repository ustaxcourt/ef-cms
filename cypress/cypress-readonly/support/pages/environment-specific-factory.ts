const {
  getRestApi: getRestApiDeployed,
  getUserToken: getUserTokenDeployed,
  login: loginDeployed,
} = require('./login');

exports.getEnvironmentSpecificFunctions = () => {
  return {
    getRestApi: getRestApiDeployed,
    getUserToken: getUserTokenDeployed,
    login: loginDeployed,
  };
};
