import awsPersistenceGateway from '../persistence/awsPersistenceGateway';

import createCase from '../../../business/src/useCases/createCaseProxy';
import getCase from '../../../business/src/useCases/getCase';
import getCases from '../../../business/src/useCases/getCases';
import getUser from '../../../business/src/useCases/getUser';
import updateCase from '../../../business/src/useCases/updateCase';
import getCasesByUser from '../../../business/src/useCases/getCasesByUserProxy';
import getPetitionsClerkCaseList from '../useCases/getPetitionsClerkCaseList';

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
      getCases,
      getCasesByUser,
      getPetitionsClerkCaseList,
      getUser,
      updateCase,
      uploadCasePdfs,
    };
  },
};

export default applicationContext;
