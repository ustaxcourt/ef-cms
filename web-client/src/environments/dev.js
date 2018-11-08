// import awsPersistenceGateway from '../persistence/awsPersistenceGateway';
import localPersistenceGateway from '../persistence/localPersistenceGateway';

const API_URL = 'http://localhost:3000/v1';

/**
 * Context for the dev environment
 */
const dev = {
  getBaseUrl: () => {
    return API_URL;
  },
  getPersistenceGateway: () => {
    return localPersistenceGateway;
  },
};

export default dev;
