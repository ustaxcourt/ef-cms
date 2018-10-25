// const API_URL = 'http://localhost:3000/v1';
const API_URL =
  'https://fvtnozpme2.execute-api.us-east-1.amazonaws.com/will/v1';

/**
 * Context for the dev environment
 */
const dev = {
  getBaseUrl: () => {
    return API_URL;
  },
};

export default dev;
