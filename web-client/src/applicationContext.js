import axios from 'axios';
import uuidv4 from 'uuid/v4';

const {
  getDocument,
  uploadDocument,
  uploadPdf,
  uploadPdfsForNewCase,
} = require('../../shared/src/persistence/awsS3Persistence');

import { assignWorkItems } from '../../shared/src/proxies/workitems/assignWorkItemsProxy';
import { associateDocumentToCase } from '../../shared/src/proxies/associateDocumentToCaseProxy';
import { associateRespondentDocumentToCase } from '../../shared/src/proxies/respondent/associateRespondentDocumentToCaseProxy';
import { createCase } from '../../shared/src/proxies/createCaseProxy';
import { downloadDocumentFile } from '../../shared/src/business/useCases/downloadDocumentFile.interactor';
import { fileRespondentDocument } from '../../shared/src/business/useCases/respondent/fileRespondentDocument.interactor';
import { getCase } from '../../shared/src/proxies/getCaseProxy';
import { getCasesByStatus } from '../../shared/src/proxies/getCasesByStatusProxy';
import { getCasesByUser } from '../../shared/src/proxies/getCasesByUserProxy';
import { getCasesForRespondent } from '../../shared/src/proxies/respondent/getCasesForRespondentProxy';
import { getUser } from '../../shared/src/business/useCases/getUser.interactor';
import { getUsersInSection } from '../../shared/src/business/useCases/getUsersInSection.interactor';
import { getWorkItem } from '../../shared/src/proxies/workitems/getWorkItemProxy';
import { getWorkItems } from '../../shared/src/proxies/workitems/getWorkItemsProxy';
import { getWorkItemsBySection } from '../../shared/src/proxies/workitems/getWorkItemsBySectionProxy';
import { sendPetitionToIRS } from '../../shared/src/proxies/sendPetitionToIRSProxy';
import { updateCase } from '../../shared/src/proxies/updateCaseProxy';
import { updateWorkItem } from '../../shared/src/proxies/workitems/updateWorkItemProxy';
import { uploadCasePdfs } from '../../shared/src/business/useCases/uploadCasePdfs.interactor';
import { forwardWorkItem } from '../../shared/src/proxies/workitems/forwardWorkItemProxy';

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
      associateDocumentToCase,
      associateRespondentDocumentToCase,
      createCase,
      downloadDocumentFile,
      fileRespondentDocument,
      getCase,
      getCasesByStatus,
      getCasesByUser,
      getCasesForRespondent,
      getUser,
      getUsersInSection,
      getWorkItem,
      getWorkItems,
      getWorkItemsBySection,
      sendPetitionToIRS,
      updateCase,
      updateWorkItem,
      uploadCasePdfs,
      forwardWorkItem,
    };
  },
};

export default applicationContext;
