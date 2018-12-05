import persistenceGateway from '../../../shared/src/persistence/awsPersistenceGateway';

import { createCase } from '../../../shared/src/proxies/createCaseProxy';
import { getCase } from '../../../shared/src/proxies/getCaseProxy';
import { getCasesByStatus } from '../../../shared/src/proxies/getCasesByStatusProxy';
import { getCasesByUser } from '../../../shared/src/proxies/getCasesByUserProxy';
import { getUser } from '../../../shared/src/business/useCases/getUser';
import { sendPetitionToIRS } from '../../../shared/src/proxies/sendPetitionToIRSProxy';
import { updateCase } from '../../../shared/src/proxies/updateCaseProxy';
import { uploadCasePdfs } from '../../../shared/src/business/useCases/uploadCasePdfs';

/**
 * Context for the dev environment
 */
const applicationContext = {
  getBaseUrl: () => {
    return process.env.API_URL || 'http://localhost:3000/v1';
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
      sendPetitionToIRS,
      updateCase,
      uploadCasePdfs,
    };
  },
};

export default applicationContext;
