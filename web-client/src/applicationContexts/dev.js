import awsPersistenceGateway from '../persistence/awsPersistenceGateway';

const API_URL = 'http://localhost:3000/v1';

/**
 * Context for the dev environment
 */
const applicationContext = {
  getBaseUrl: () => {
    return API_URL;
  },
  getPersistenceGateway: () => {
    return awsPersistenceGateway;
  },
};

export default applicationContext;
