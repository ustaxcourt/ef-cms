import awsPersistenceGateway from '../persistence/awsPersistenceGateway';

const API_URL = process.env.API_URL || 'http://localhost:8080';

/**
 * Context for the prod environment
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
