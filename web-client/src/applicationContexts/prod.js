const {
  uploadPdf,
  uploadPdfsForNewCase
} = require('../../../shared/src/persistence/awsS3Persistence');
const {
  getDownloadPolicyUrl,
} = require('../../../shared/src/proxies/getDownloadPolicyUrlProxy');
const {
  getUploadPolicy,
} = require('../../../shared/src/proxies/getUploadPolicyProxy');

import { createCase } from '../../../shared/src/proxies/createCaseProxy';
import { getCase } from '../../../shared/src/proxies/getCaseProxy';
import { getCasesByStatus } from '../../../shared/src/proxies/getCasesByStatusProxy';
import { getCasesByUser } from '../../../shared/src/proxies/getCasesByUserProxy';
import { getUser } from '../../../shared/src/business/useCases/getUser';
import { sendPetitionToIRS } from '../../../shared/src/proxies/sendPetitionToIRSProxy';
import { updateCase } from '../../../shared/src/proxies/updateCaseProxy';
import { uploadCasePdfs } from '../../../shared/src/business/useCases/uploadCasePdfs';

/**
 * Context for the prod environment
 */
const applicationContext = {
  getBaseUrl: () => {
    return process.env.API_URL || 'http://localhost:8080';
  },
  getPersistenceGateway: () => {
    return {
      uploadPdf,
      getDownloadPolicyUrl,
      getUploadPolicy,
      uploadPdfsForNewCase
    };
  },
  getUseCases: () => {
    return {
      createCase,
      getCase,
      getCasesByStatus,
      getCasesByUser,
      getUser,
      sendPetitionToIRS,
      updateCase,
      uploadCasePdfs,
    };
  },
};

export default applicationContext;
