import axios from 'axios';
import uuidv4 from 'uuid/v4';

const {
  getDocument,
  uploadDocument,
  uploadPdf,
  uploadPdfsForNewCase,
} = require('../../shared/src/persistence/awsS3Persistence');

import { createCase } from '../../shared/src/proxies/createCaseProxy';
import { downloadDocumentFile } from '../../shared/src/business/useCases/downloadDocumentFile.interactor';
import { fileRespondentDocument } from '../../shared/src/business/useCases/respondent/fileRespondentDocument.interactor';
import { fileGenericDocument } from '../../shared/src/business/useCases/fileGenericDocument.interactor';
import { getCase } from '../../shared/src/proxies/getCaseProxy';
import { getCasesByStatus } from '../../shared/src/proxies/getCasesByStatusProxy';
import { getCasesByUser } from '../../shared/src/proxies/getCasesByUserProxy';
import { getCasesForRespondent } from '../../shared/src/proxies/respondent/getCasesForRespondentProxy';
import { getUser } from '../../shared/src/business/useCases/getUser.interactor';
import { getWorkItem } from '../../shared/src/proxies/workitems/getWorkItemProxy';
import { getUsersInSection } from '../../shared/src/business/useCases/getUsersInSection.interactor';
import { getWorkItems } from '../../shared/src/proxies/workitems/getWorkItemsProxy';
import { sendPetitionToIRS } from '../../shared/src/proxies/sendPetitionToIRSProxy';
import { updateCase } from '../../shared/src/proxies/updateCaseProxy';
import { updateWorkItem } from '../../shared/src/proxies/workitems/updateWorkItemProxy';
import { uploadCasePdfs } from '../../shared/src/business/useCases/uploadCasePdfs.interactor';
import { associateRespondentDocumentToCase } from '../../shared/src/proxies/respondent/associateRespondentDocumentToCaseProxy';
import { associateDocumentToCase } from '../../shared/src/proxies/associateDocumentToCaseProxy';
import { getWorkItemsBySection } from '../../shared/src/proxies/workitems/getWorkItemsBySectionProxy';
import { assignWorkItems } from '../../shared/src/proxies/workitems/assignWorkItemsProxy';

const applicationContext = {
  getBaseUrl: () => {
    return process.env.API_URL || 'http://localhost:3000/v1';
  },
  getHttpClient: () => axios,
  getUniqueId: () => {
    return uuidv4();
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
      assignWorkItems,
      createCase,
      downloadDocumentFile,
      getUsersInSection,
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
      associateDocumentToCase,
      fileRespondentDocument,
      fileGenericDocument,
      getWorkItemsBySection,
    };
  },
};

export default applicationContext;
