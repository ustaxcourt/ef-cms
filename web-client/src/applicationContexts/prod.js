import awsPersistenceGateway from '../../../shared/src/persistence/awsPersistenceGateway';

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
    return awsPersistenceGateway;
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
