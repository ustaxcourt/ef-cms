const {
  uploadPdf,
  uploadPdfsForNewCase,
  uploadDocument,
  getDocument,
} = require('../../../shared/src/persistence/awsS3Persistence');

import { createCase } from '../../../shared/src/proxies/createCaseProxy';
import { getCase } from '../../../shared/src/proxies/getCaseProxy';
import { getCasesByStatus } from '../../../shared/src/proxies/getCasesByStatusProxy';
import { getCasesByUser } from '../../../shared/src/proxies/getCasesByUserProxy';
import { getUser } from '../../../shared/src/business/useCases/getUser.interactor';
import { sendPetitionToIRS } from '../../../shared/src/proxies/sendPetitionToIRSProxy';
import { updateCase } from '../../../shared/src/proxies/updateCaseProxy';
import { uploadCasePdfs } from '../../../shared/src/business/useCases/uploadCasePdfs.interactor';
import { fileAnswer } from '../../../shared/src/business/useCases/respondent/fileAnswer.interactor';
import { getCasesForRespondent } from '../../../shared/src/proxies/respondent/getCasesForRespondentProxy';
import { downloadDocumentFile } from '../../../shared/src/business/useCases/downloadDocumentFile.interactor';

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
      getDocument,
      uploadPdfsForNewCase,
      uploadDocument,
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
      fileAnswer,
      getCasesForRespondent,
      downloadDocumentFile,
    };
  },
  getUseCaseForDocumentUpload: (documentType, role) => {
    if (role === 'respondent') {
      switch (documentType) {
        case 'Answer':
          return fileAnswer;
        default:
          return updateCase;
      }
    }
  },
};

export default applicationContext;
