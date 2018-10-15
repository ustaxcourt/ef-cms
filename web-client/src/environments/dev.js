const API_URL = 'http://localhost:3000/v1';

/**
 * Context for the dev environment
 */
const devEnvironment = {
  getBaseUrl: () => {
    return API_URL;
  },
};

export default devEnvironment;
