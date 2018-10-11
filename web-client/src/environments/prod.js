const API_URL = process.env.API_URL || 'http://localhost:8080';

const prodEnvironment = {
  getBaseUrl: () => {
    return API_URL;
  },
};

export default prodEnvironment;
