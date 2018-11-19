import awsPersistenceGateway from '../persistence/awsPersistenceGateway';

import createCase from '../../../business/src/useCases/createCaseProxy';
import getCaseDetail from '../useCases/getCaseDetail';
import getCases from '../useCases/getCases';
import getPetitionsClerkCaseList from '../useCases/getPetitionsClerkCaseList';
import getUser from '../../../business/src/useCases/getUser';
import updateCase from '../useCases/updateCase';
import uploadCasePdfs from '../useCases/uploadCasePdfs';

const API_URL = 'https://efcms-dev.ustc-case-mgmt.flexion.us/v1';

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
  getUseCases: () => {
    return {
      createCase,
      getCaseDetail,
      getCases,
      getPetitionsClerkCaseList,
      getUser,
      updateCase,
      uploadCasePdfs,
    };
  },
};

export default applicationContext;
