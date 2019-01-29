import axios from 'axios';
import uuidv4 from 'uuid/v4';

const {
  getDocument,
  uploadDocument,
  uploadPdf,
  uploadPdfsForNewCase,
} = require('../../shared/src/persistence/awsS3Persistence');

import { assignWorkItems } from '../../shared/src/proxies/workitems/assignWorkItemsProxy';
import { createCase } from '../../shared/src/proxies/createCaseProxy';
import { downloadDocumentFile } from '../../shared/src/business/useCases/downloadDocumentFile.interactor';
import { fileRespondentDocument } from '../../shared/src/business/useCases/respondent/fileRespondentDocument.interactor';
import { getCase } from '../../shared/src/proxies/getCaseProxy';
import { getCasesByStatus } from '../../shared/src/proxies/getCasesByStatusProxy';
import { getCasesByUser } from '../../shared/src/proxies/getCasesByUserProxy';
import { getCasesForRespondent } from '../../shared/src/proxies/respondent/getCasesForRespondentProxy';
import { getCaseTypes } from '../../shared/src/business/useCases/getCaseTypes.interactor';
import { filePetition } from '../../shared/src/business/useCases/filePetition.interactor';
import { getProcedureTypes } from '../../shared/src/business/useCases/getProcedureTypes.interactor';
import { getTrialCities } from '../../shared/src/business/useCases/getTrialCities.interactor';
import { getUser } from '../../shared/src/business/useCases/getUser.interactor';
import { getUsersInSection } from '../../shared/src/business/useCases/getUsersInSection.interactor';
import { getInternalUsers } from '../../shared/src/business/useCases/getInternalUsers.interactor';
import { getWorkItem } from '../../shared/src/proxies/workitems/getWorkItemProxy';
import { getWorkItems } from '../../shared/src/proxies/workitems/getWorkItemsProxy';
import { getWorkItemsBySection } from '../../shared/src/proxies/workitems/getWorkItemsBySectionProxy';
import { sendPetitionToIRS } from '../../shared/src/proxies/sendPetitionToIRSProxy';
import { updateCase } from '../../shared/src/proxies/updateCaseProxy';
import { updateWorkItem } from '../../shared/src/proxies/workitems/updateWorkItemProxy';
import { forwardWorkItem } from '../../shared/src/proxies/workitems/forwardWorkItemProxy';
import { validatePetition } from '../../shared/src/business/useCases/validatePetition.interactor';
import { validateCaseDetail } from '../../shared/src/business/useCases/validateCaseDetail.interactor';
import { createDocument } from '../../shared/src/proxies/documents/createDocumentProxy';

import Petition from '../../shared/src/business/entities/Petition';
import ErrorFactory from './presenter/errors/ErrorFactory';

let user;

const getCurrentUser = () => {
  return user;
};
const setCurrentUser = newUser => {
  user = newUser;
};

function decorateWithTryCatch(useCases) {
  function decorate(method) {
    return function() {
      const response = method.apply(
        null,
        Array.prototype.slice.call(arguments),
      );
      if (response && response.then) {
        response.catch(ErrorFactory);
      }
      return response;
    };
  }

  Object.keys(useCases).forEach(key => {
    useCases[key] = decorate(useCases[key]);
  });

  return useCases;
}

const applicationContext = {
  getBaseUrl: () => {
    return process.env.API_URL || 'http://localhost:3000/v1';
  },
  getError: e => {
    return ErrorFactory.getError(e);
  },
  getHttpClient: () => axios,
  getUniqueId: () => {
    return uuidv4();
  },
  getEntityConstructors: () => ({
    Petition,
  }),
  getPersistenceGateway: () => {
    return {
      getDocument,
      saveCase: updateCase,
      uploadDocument,
      uploadPdf,
      uploadPdfsForNewCase,
    };
  },
  getUseCases: () =>
    decorateWithTryCatch({
      assignWorkItems,
      createDocument,
      createCase,
      downloadDocumentFile,
      fileRespondentDocument,
      filePetition,
      forwardWorkItem,
      getCase,
      getCasesByStatus,
      getCasesByUser,
      getCasesForRespondent,
      getCaseTypes,
      getInternalUsers,
      getProcedureTypes,
      getTrialCities,
      getUser,
      getUsersInSection,
      getWorkItem,
      getWorkItems,
      getWorkItemsBySection,
      sendPetitionToIRS,
      updateCase,
      updateWorkItem,
      validatePetition,
      validateCaseDetail,
    }),
  getCurrentUser,
  setCurrentUser,
};

export default applicationContext;
