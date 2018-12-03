import awsPersistenceGateway from '../../../business/src/persistence/awsPersistenceGateway';

import { createCase } from '../../../business/src/useCases/createCaseProxy';
import { getCase } from '../../../business/src/useCases/getCaseProxy';
import { getCasesByStatus } from '../../../business/src/useCases/getCasesByStatusProxy';
import { getCasesByUser } from '../../../business/src/useCases/getCasesByUserProxy';
import { getUser } from '../../../business/src/useCases/getUser';
import { sendPetitionToIRS } from '../../../business/src/useCases/sendPetitionToIRSProxy';
import { updateCase } from '../../../business/src/useCases/updateCaseProxy';
import { uploadCasePdfs } from '../../../business/src/useCases/uploadCasePdfs';

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
