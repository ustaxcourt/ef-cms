import awsS3Persistence from '../../../business/src/persistence/awsS3Persistence';

import createCase from '../../../business/src/useCases/createCaseProxy';
import createDocumentMetadata from '../../../business/src/useCases/createDocumentMetadataProxy';
import getCase from '../../../business/src/useCases/getCaseProxy';
import getCasesByStatus from '../../../business/src/useCases/getCasesByStatusProxy';
import getCasesByUser from '../../../business/src/useCases/getCasesByUserProxy';
import getDocumentPolicy from '../../../business/src/useCases/getDocumentPolicyProxy';
import getUser from '../../../business/src/useCases/getUser';
import updateCase from '../../../business/src/useCases/updateCaseProxy';
import uploadToS3 from '../../../business/src/useCases/uploadToS3';

// import uploadCasePdfs from '../useCases/uploadCasePdfs';

/**
 * Context for the dev environment
 */
const applicationContext = {
  getBaseUrl: () => {
    return 'http://localhost:3000/v1';
  },
  getPersistenceGateway: () => {
    return awsS3Persistence;
  },
  getUseCases: () => {
    return {
      createCase,
      createDocumentMetadata,
      getCase,
      getCasesByStatus,
      getCasesByUser,
      getDocumentPolicy,
      getUser,
      updateCase,
      uploadToS3,
    };
  },
};

export default applicationContext;
