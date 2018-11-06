const API_URL = 'http://localhost:3000/v1';

/**
 * Context for the dev environment
 */
const dev = {
  getBaseUrl: () => {
    return API_URL;
  },
};

export default dev;
