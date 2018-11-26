import awsPersistenceGateway from '../persistence/awsPersistenceGateway';

import createCase from '../../../business/src/useCases/createCaseProxy';
import createDocumentMetadata from '../../../business/src/useCases/createDocumentMetadataProxy';
import getCase from '../../../business/src/useCases/getCaseProxy';
import getCasesByStatus from '../../../business/src/useCases/getCasesByStatusProxy';
import getCasesByUser from '../../../business/src/useCases/getCasesByUserProxy';
import getDocumentPolicy from '../../../business/src/useCases/getDocumentPolicyProxy';
import getUser from '../../../business/src/useCases/getUser';
import updateCase from '../../../business/src/useCases/updateCaseProxy';
import uploadToS3 from '../../../business/src/useCases/uploadToS3';

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
    createCase,
    createDocumentMetadata,
    getCase,
    getCasesByStatus,
    getCasesByUser,
    getDocumentPolicy,
    getUser,
    updateCase,
    uploadToS3,
  },
};

export default applicationContext;
