import persistenceGateway from '../persistence/localPersistenceGateway';

const API_URL = 'http://localhost:3000/v1';

/**
 * Context for the dev environment
 */
const mock = {
  getBaseUrl: () => {
    return API_URL;
  },
  getPersistenceGateway: () => {
    return persistenceGateway;
  },
};

export default mock;
