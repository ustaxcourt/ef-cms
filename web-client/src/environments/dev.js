const API_URL = 'http://localhost:8080';

/**
 * Context for the dev environment
 */
const devEnvironment = {
  getBaseUrl: () => {
    return API_URL;
  },
};

export default devEnvironment;
