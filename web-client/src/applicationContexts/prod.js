import awsPersistenceGateway from '../../../shared/src/persistence/awsPersistenceGateway';

import createCase from '../../../shared/src/useCases/createCaseProxy';
import getCase from '../../../shared/src/useCases/getCaseProxy';
import getCasesByStatus from '../../../shared/src/useCases/getCasesByStatusProxy';
import getCasesByUser from '../../../shared/src/useCases/getCasesByUserProxy';
import getUser from '../../../shared/src/useCases/getUser';
import updateCase from '../../../shared/src/useCases/updateCaseProxy';
import uploadCasePdfs from '../../../shared/src/useCases/uploadCasePdfs';

/**
 * Context for the prod environment
 */
const applicationContext = {
  getBaseUrl: () => {
    return process.env.API_URL || 'http://localhost:8080';
  },
  getPersistenceGateway: () => {
    return awsPersistenceGateway;
  },
  getUseCases: () => {
    return {
      createCase,
      getCase,
      getCasesByStatus,
      getCasesByUser,
      getUser,
      updateCase,
      uploadCasePdfs,
    };
  },
};

export default applicationContext;
