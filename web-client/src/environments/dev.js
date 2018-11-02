const API_URL = 'https://7wjn89p2z4.execute-api.us-east-1.amazonaws.com/dev/v1';

/**
 * Context for the dev environment
 */
const dev = {
  getBaseUrl: () => {
    return API_URL;
  },
};

export default dev;
