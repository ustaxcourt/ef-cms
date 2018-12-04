import persistenceGateway from '../../../shared/src/persistence/awsPersistenceGateway';

import createCase from '../../../shared/src/useCases/createCaseProxy';
import getCase from '../../../shared/src/useCases/getCaseProxy';
import getCasesByStatus from '../../../shared/src/useCases/getCasesByStatusProxy';
import getCasesByUser from '../../../shared/src/useCases/getCasesByUserProxy';
import getUser from '../../../shared/src/useCases/getUser';
import updateCase from '../../../shared/src/useCases/updateCaseProxy';
import uploadCasePdfs from '../../../shared/src/useCases/uploadCasePdfs';

/**
 * Context for the dev environment
 */
const applicationContext = {
  getBaseUrl: () => {
    return 'http://localhost:3000/v1';
  },
  getPersistenceGateway: () => {
    return persistenceGateway;
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
