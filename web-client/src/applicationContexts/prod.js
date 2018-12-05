import awsPersistenceGateway from '../../../shared/src/persistence/awsPersistenceGateway';

import { createCase } from '../../../shared/src/business/useCases/createCaseProxy';
import { getCase } from '../../../shared/src/business/useCases/getCaseProxy';
import { getCasesByStatus } from '../../../shared/src/business/useCases/getCasesByStatusProxy';
import { getCasesByUser } from '../../../shared/src/business/useCases/getCasesByUserProxy';
import { getUser } from '../../../shared/src/business/useCases/getUser';
import { sendPetitionToIRS } from '../../../shared/src/business/useCases/sendPetitionToIRSProxy';
import { updateCase } from '../../../shared/src/business/useCases/updateCaseProxy';
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
