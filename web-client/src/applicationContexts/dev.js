import awsPersistenceGateway from '../persistence/awsPersistenceGateway';

import createCase from '../../../business/src/useCases/createCaseProxy';
import getCase from '../../../business/src/useCases/getCase';
import getCases from '../../../business/src/useCases/getCases';
import getUser from '../../../business/src/useCases/getUser';
import updateCase from '../../../business/src/useCases/updateCase';

import getPetitionsClerkCaseList from '../useCases/getPetitionsClerkCaseList';

import uploadCasePdfs from '../useCases/uploadCasePdfs';

/**
 * Context for the dev environment
 */
const applicationContext = {
  getBaseUrl: () => {
    return 'https://efcms-dev.ustc-case-mgmt.flexion.us/v1';
  },
  getPersistenceGateway: () => {
    return awsPersistenceGateway;
  },
  getUseCases: () => {
    return {
      createCase,
      getCase,
      getCases,
      getPetitionsClerkCaseList,
      getUser,
      updateCase,
      uploadCasePdfs,
    };
  },
};

export default applicationContext;
