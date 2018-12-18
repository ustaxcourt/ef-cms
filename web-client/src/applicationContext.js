const {
  getDocument,
  uploadDocument,
  uploadPdf,
  uploadPdfsForNewCase,
} = require('../../shared/src/persistence/awsS3Persistence');

import { createCase } from '../../shared/src/proxies/createCaseProxy';
import { downloadDocumentFile } from '../../shared/src/business/useCases/downloadDocumentFile.interactor';
import { fileAnswer } from '../../shared/src/business/useCases/respondent/fileAnswer.interactor';
import { fileStipulatedDecision } from '../../shared/src/business/useCases/respondent/fileStipulatedDecision.interactor';
import { getCase } from '../../shared/src/proxies/getCaseProxy';
import { getCasesByStatus } from '../../shared/src/proxies/getCasesByStatusProxy';
import { getCasesByUser } from '../../shared/src/proxies/getCasesByUserProxy';
import { getCasesForRespondent } from '../../shared/src/proxies/respondent/getCasesForRespondentProxy';
import { getUser } from '../../shared/src/business/useCases/getUser.interactor';
import { getWorkItem } from '../../shared/src/proxies/workitems/getWorkItemProxy';
import { getWorkItems } from '../../shared/src/proxies/workitems/getWorkItemsProxy';
import { sendPetitionToIRS } from '../../shared/src/proxies/sendPetitionToIRSProxy';
import { updateCase } from '../../shared/src/proxies/updateCaseProxy';
import { updateWorkItem } from '../../shared/src/proxies/workitems/updateWorkItemProxy';
import { uploadCasePdfs } from '../../shared/src/business/useCases/uploadCasePdfs.interactor';
import { associateRespondentDocumentToCase } from '../../shared/src/proxies/respondent/associateRespondentDocumentToCaseProxy';

import Case from '../../shared/src/business/entities/Case';

const applicationContext = {
  getBaseUrl: () => {
    return process.env.API_URL || 'http://localhost:3000/v1';
  },
  getPersistenceGateway: () => {
    return {
      getDocument,
      saveCase: updateCase,
      uploadDocument,
      uploadPdf,
      uploadPdfsForNewCase,
    };
  },
  getUseCases: () => {
    return {
      createCase,
      downloadDocumentFile,
      fileAnswer,
      getCase,
      getCasesByStatus,
      getCasesByUser,
      getCasesForRespondent,
      getUser,
      getWorkItem,
      getWorkItems,
      sendPetitionToIRS,
      updateCase,
      updateWorkItem,
      uploadCasePdfs,
      associateRespondentDocumentToCase,
    };
  },
  getUseCaseForDocumentUpload: (documentType, role) => {
    if (role === 'respondent') {
      switch (documentType) {
        case Case.documentTypes.answer:
          return fileAnswer;
        case Case.documentTypes.stipulatedDecision:
          return fileStipulatedDecision;
      }
    }
  },
};

export default applicationContext;
