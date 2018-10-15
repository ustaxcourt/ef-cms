const API_URL = 'http://localhost:3000';

/**
 * Context for the dev environment
 */
const devEnvironment = {
  getBaseUrl: () => {
    return API_URL;
  },
};

export default devEnvironment;
