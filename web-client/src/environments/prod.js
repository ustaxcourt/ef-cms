const API_URL = process.env.API_URL || 'http://localhost:8080';

/**
 * Context for the prod environment
 */
const prodEnvironment = {
  getBaseUrl: () => {
    return API_URL;
  },
};

export default prodEnvironment;
