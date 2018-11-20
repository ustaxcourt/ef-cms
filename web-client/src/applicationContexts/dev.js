import awsPersistenceGateway from '../persistence/awsPersistenceGateway';

import createCase from '../../../business/src/useCases/createCaseProxy';
import getCase from '../../../business/src/useCases/getCaseProxy';
import getCasesByStatus from '../../../business/src/useCases/getCasesByStatusProxy';
import getCasesByUser from '../../../business/src/useCases/getCasesByUserProxy';
import getUser from '../../../business/src/useCases/getUser';
import updateCase from '../../../business/src/useCases/updateCaseProxy';

import uploadCasePdfs from '../useCases/uploadCasePdfs';

/**
 * Context for the dev environment
 */
const applicationContext = {
  getBaseUrl: () => {
    return 'http://localhost:3000/v1';
  },
  getPersistenceGateway: () => {
    return awsPersistenceGateway;
  },
  getUseCases: () => {
    return {
      createCase,
      getCase,
      getCasesByUser,
      getCasesByStatus,
      getUser,
      updateCase,
      uploadCasePdfs,
    };
  },
};

export default applicationContext;
