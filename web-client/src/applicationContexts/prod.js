import awsPersistenceGateway from '../persistence/awsPersistenceGateway';

import createACase from '../../../business/src/useCases/createACaseProxy';
import getCaseDetail from '../useCases/getCaseDetail';
import getCases from '../useCases/getCases';
import getPetitionsClerkCaseList from '../useCases/getPetitionsClerkCaseList';
import getUser from '../../../business/src/useCases/getUser';
import updateCase from '../useCases/updateCase';
import uploadCasePdfs from '../useCases/uploadCasePdfs';

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
  useCases: {
    createACase,
    getCaseDetail,
    getCases,
    getPetitionsClerkCaseList,
    getUser,
    updateCase,
    uploadCasePdfs,
  },
};

export default applicationContext;
