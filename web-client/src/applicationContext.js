import {
  BUSINESS_TYPES,
  COUNTRY_TYPES,
  ESTATE_TYPES,
  OTHER_TYPES,
  PARTY_TYPES,
} from '../../shared/src/business/entities/contacts/PetitionContact';
import {
  CASE_CAPTION_POSTFIX,
  Case,
  STATUS_TYPES,
} from '../../shared/src/business/entities/Case';
import { Document } from '../../shared/src/business/entities/Document';
import axios from 'axios';
import uuidv4 from 'uuid/v4';

const jsPDF = process.env.IS_TEST ? {} : require('jspdf');

import {
  createISODateString,
  formatDateString,
  isStringISOFormatted,
  prepareDateFromString,
} from '../../shared/src/business/utilities/DateHandler';

import {
  CATEGORIES,
  CATEGORY_MAP,
  INTERNAL_CATEGORY_MAP,
} from '../../shared/src/business/entities/Document';
const { getDocument } = require('../../shared/src/persistence/s3/getDocument');
const {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} = require('../../shared/src/persistence/s3/getUploadPolicy');
const { uploadPdf } = require('../../shared/src/persistence/s3/uploadPdf');
import {
  CHAMBERS_SECTION,
  CHAMBERS_SECTIONS,
  SECTIONS,
} from '../../shared/src/business/entities/WorkQueue';
import { CaseAssociationRequestFactory } from '../../shared/src/business/entities/CaseAssociationRequestFactory';
import { DocketEntryFactory } from '../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { ErrorFactory } from './presenter/errors/ErrorFactory';
import { ExternalDocumentFactory } from '../../shared/src/business/entities/externalDocument/ExternalDocumentFactory';
import { ExternalDocumentInformationFactory } from '../../shared/src/business/entities/externalDocument/ExternalDocumentInformationFactory';
import { ForwardMessage } from '../../shared/src/business/entities/ForwardMessage';
import { InitialWorkItemMessage } from '../../shared/src/business/entities/InitialWorkItemMessage';
import { Petition } from '../../shared/src/business/entities/Petition';
import { PetitionFromPaper } from '../../shared/src/business/entities/PetitionFromPaper';
import { TRIAL_CITIES } from '../../shared/src/business/entities/TrialCities';
import { TrialSession } from '../../shared/src/business/entities/TrialSession';
import { assignWorkItems } from '../../shared/src/proxies/workitems/assignWorkItemsProxy';
import { authorizeCode } from '../../shared/src/business/useCases/authorizeCodeInteractor';
import { generatePDFFromPNGData } from '../../shared/src/business/useCases/generatePDFFromPNGDataInteractor';

import { getItem as getItemUC } from '../../shared/src/business/useCases/getItemInteractor';
import { removeItem as removeItemUC } from '../../shared/src/business/useCases/removeItemInteractor';
import { setItem as setItemUC } from '../../shared/src/business/useCases/setItemInteractor';

import { getItem } from '../../shared/src/persistence/localStorage/getItem';
import { removeItem } from '../../shared/src/persistence/localStorage/removeItem';
import { setItem } from '../../shared/src/persistence/localStorage/setItem';

import { completeWorkItem } from '../../shared/src/proxies/workitems/completeWorkItemProxy';
import { createCase } from '../../shared/src/proxies/createCaseProxy';
import { createCaseFromPaper } from '../../shared/src/proxies/createCaseFromPaperProxy';
import { createCoverSheet } from '../../shared/src/proxies/documents/createCoverSheetProxy';
import { createDocument } from '../../shared/src/proxies/documents/createDocumentProxy';
import { createTrialSession } from '../../shared/src/proxies/trialSessions/createTrialSessionProxy';
import { createWorkItem } from '../../shared/src/proxies/workitems/createWorkItemProxy';
import { downloadDocumentFile } from '../../shared/src/business/useCases/downloadDocumentFileInteractor';
import { fileExternalDocument } from '../../shared/src/proxies/documents/fileExternalDocumentProxy';
import { filePetition } from '../../shared/src/business/useCases/filePetitionInteractor';
import { filePetitionFromPaper } from '../../shared/src/business/useCases/filePetitionFromPaperInteractor';
import { forwardWorkItem } from '../../shared/src/proxies/workitems/forwardWorkItemProxy';
import { generateCaseAssociationDocumentTitle } from '../../shared/src/business/useCases/caseAssociationRequest/generateCaseAssociationDocumentTitleInteractor';
import { generateDocumentTitle } from '../../shared/src/business/useCases/externalDocument/generateDocumentTitleInteractor';
import { generatePdfUrlFactory } from '../../shared/src/business/utilities/generatePdfUrlFactory';
import { getCalendaredCasesForTrialSession } from '../../shared/src/proxies/trialSessions/getCalendaredCasesForTrialSessionProxy';
import { getCase } from '../../shared/src/proxies/getCaseProxy';
import { getCaseTypes } from '../../shared/src/business/useCases/getCaseTypesInteractor';
import { getCasesByUser } from '../../shared/src/proxies/getCasesByUserProxy';
import { getEligibleCasesForTrialSession } from '../../shared/src/proxies/trialSessions/getEligibleCasesForTrialSessionProxy';
import { getFilingTypes } from '../../shared/src/business/useCases/getFilingTypesInteractor';
import { getInternalUsers } from '../../shared/src/proxies/users/getInternalUsesProxy';
import { getNotifications } from '../../shared/src/proxies/users/getNotificationsProxy';
import { getProcedureTypes } from '../../shared/src/business/useCases/getProcedureTypesInteractor';
import { getScannerInterface } from '../../shared/src/business/useCases/getScannerInterfaceInteractor';
import { getSentWorkItemsForSection } from '../../shared/src/proxies/workitems/getSentWorkItemsForSectionProxy';
import { getSentWorkItemsForUser } from '../../shared/src/proxies/workitems/getSentWorkItemsForUserProxy';
import { getTrialSessionDetails } from '../../shared/src/proxies/trialSessions/getTrialSessionDetailsProxy';
import { getTrialSessions } from '../../shared/src/proxies/trialSessions/getTrialSessionsProxy';
import { getUser } from '../../shared/src/business/useCases/getUserInteractor';
import { getUsersInSection } from '../../shared/src/proxies/users/getUsersInSectionProxy';
import { getWorkItem } from '../../shared/src/proxies/workitems/getWorkItemProxy';
import { getWorkItemsBySection } from '../../shared/src/proxies/workitems/getWorkItemsBySectionProxy';
import { getWorkItemsForUser } from '../../shared/src/proxies/workitems/getWorkItemsForUserProxy';
import { recallPetitionFromIRSHoldingQueue } from '../../shared/src/proxies/recallPetitionFromIRSHoldingQueueProxy';
import { refreshToken } from '../../shared/src/business/useCases/refreshTokenInteractor';
import { runBatchProcess } from '../../shared/src/proxies/runBatchProcessProxy';
import { sanitizePdf } from '../../shared/src/proxies/documents/sanitizePdfProxy';
import { sendPetitionToIRSHoldingQueue } from '../../shared/src/proxies/sendPetitionToIRSHoldingQueueProxy';
import { setCaseToReadyForTrial } from '../../shared/src/proxies/setCaseToReadyForTrialProxy';
import { setTrialSessionAsSwingSession } from '../../shared/src/proxies/trialSessions/setTrialSessionAsSwingSessionProxy';
import { setTrialSessionCalendar } from '../../shared/src/proxies/trialSessions/setTrialSessionCalendarProxy';
import { setWorkItemAsRead } from '../../shared/src/proxies/workitems/setWorkItemAsReadProxy';
import { submitCaseAssociationRequest } from '../../shared/src/proxies/documents/submitCaseAssociationRequestProxy';
import { submitPendingCaseAssociationRequest } from '../../shared/src/proxies/documents/submitPendingCaseAssociationRequestProxy';
import { tryCatchDecorator } from './tryCatchDecorator';
import { updateCase } from '../../shared/src/proxies/updateCaseProxy';
import { updateCaseTrialSortTags } from '../../shared/src/proxies/updateCaseTrialSortTagsProxy';
import { uploadExternalDocument } from '../../shared/src/business/useCases/externalDocument/uploadExternalDocumentInteractor';
import { uploadExternalDocuments } from '../../shared/src/business/useCases/externalDocument/uploadExternalDocumentsInteractor';
import { validateCaseAssociationRequest } from '../../shared/src/business/useCases/caseAssociationRequest/validateCaseAssociationRequestInteractor';
import { validateCaseDetail } from '../../shared/src/business/useCases/validateCaseDetailInteractor';
import { validateDocketEntry } from '../../shared/src/business/useCases/docketEntry/validateDocketEntryInteractor';
import { validateExternalDocument } from '../../shared/src/business/useCases/externalDocument/validateExternalDocumentInteractor';
import { validateExternalDocumentInformation } from '../../shared/src/business/useCases/externalDocument/validateExternalDocumentInformationInteractor';
import { validateForwardMessage } from '../../shared/src/business/useCases/workitems/validateForwardMessageInteractor';
import { validateInitialWorkItemMessage } from '../../shared/src/business/useCases/workitems/validateInitialWorkItemMessageInteractor';
import { validatePdf } from '../../shared/src/proxies/documents/validatePdfProxy';
import { validatePetition } from '../../shared/src/business/useCases/validatePetitionInteractor';
import { validatePetitionFromPaper } from '../../shared/src/business/useCases/validatePetitionFromPaperInteractor';
import { validateTrialSession } from '../../shared/src/business/useCases/trialSessions/validateTrialSessionInteractor';
import { verifyCaseForUser } from '../../shared/src/proxies/verifyCaseForUserProxy';
import { verifyPendingCaseForUser } from '../../shared/src/proxies/verifyPendingCaseForUserProxy';
import { virusScanPdf } from '../../shared/src/proxies/documents/virusScanPdfProxy';
const {
  uploadDocument,
} = require('../../shared/src/persistence/s3/uploadDocument');

const MINUTES = 60 * 1000;

let user;

const getCurrentUser = () => {
  return user;
};
const setCurrentUser = newUser => {
  user = newUser;
};

let token;
const getCurrentUserToken = () => {
  return token;
};
const setCurrentUserToken = newToken => {
  token = newToken;
};

const allUseCases = {
  assignWorkItems,
  authorizeCode,
  completeWorkItem,
  createCase,
  createCaseFromPaper,
  createCoverSheet,
  createDocument,
  createTrialSession,
  createWorkItem,
  downloadDocumentFile,
  fileExternalDocument,
  filePetition,
  filePetitionFromPaper,
  forwardWorkItem,
  generateCaseAssociationDocumentTitle,
  generateDocumentTitle,
  generatePDFFromPNGData,
  getCalendaredCasesForTrialSession,
  getCase,
  getCaseTypes,
  getCasesByUser,
  getEligibleCasesForTrialSession,
  getFilingTypes,
  getInternalUsers,
  getItem: getItemUC,
  getNotifications,
  getProcedureTypes,
  getSentWorkItemsForSection,
  getSentWorkItemsForUser,
  getTrialSessionDetails,
  getTrialSessions,
  getUser,
  getUsersInSection,
  getWorkItem,
  getWorkItemsBySection,
  getWorkItemsForUser,
  recallPetitionFromIRSHoldingQueue,
  refreshToken,
  removeItem: removeItemUC,
  runBatchProcess,
  sanitizePdf,
  sendPetitionToIRSHoldingQueue,
  setCaseToReadyForTrial,
  setItem: setItemUC,
  setTrialSessionAsSwingSession,
  setTrialSessionCalendar,
  setWorkItemAsRead,
  submitCaseAssociationRequest,
  submitPendingCaseAssociationRequest,
  updateCase,
  updateCaseTrialSortTags,
  uploadExternalDocument,
  uploadExternalDocuments,
  validateCaseAssociationRequest,
  validateCaseDetail,
  validateDocketEntry,
  validateExternalDocument,
  validateExternalDocumentInformation,
  validateForwardMessage,
  validateInitialWorkItemMessage,
  validatePdf,
  validatePetition,
  validatePetitionFromPaper,
  validateTrialSession,
  verifyCaseForUser,
  verifyPendingCaseForUser,
  virusScanPdf,
};
tryCatchDecorator(allUseCases);

const applicationContext = {
  getBaseUrl: () => {
    return process.env.API_URL || 'http://localhost:3000/v1';
  },
  getCaseCaptionNames: Case.getCaseCaptionNames,
  getCognitoClientId: () => {
    return process.env.COGNITO_CLIENT_ID || '6tu6j1stv5ugcut7dqsqdurn8q';
  },
  getCognitoLoginUrl: () => {
    if (process.env.COGNITO) {
      return 'https://auth-dev-flexion-efcms.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=6tu6j1stv5ugcut7dqsqdurn8q&redirect_uri=http%3A//localhost:1234/log-in';
    } else {
      return (
        process.env.COGNITO_LOGIN_URL ||
        'http://localhost:1234/mock-login?redirect_uri=http%3A//localhost%3A1234/log-in'
      );
    }
  },
  getCognitoRedirectUrl: () => {
    return process.env.COGNITO_REDIRECT_URI || 'http://localhost:1234/log-in';
  },
  getCognitoTokenUrl: () => {
    return (
      process.env.COGNITO_TOKEN_URL ||
      'https://auth-dev-flexion-efcms.auth.us-east-1.amazoncognito.com/oauth2/token'
    );
  },
  getConstants: () => ({
    BUSINESS_TYPES,
    CASE_CAPTION_POSTFIX,
    CATEGORIES,
    CATEGORY_MAP,
    CHAMBERS_SECTION,
    CHAMBERS_SECTIONS,
    COUNTRY_TYPES,
    DOCUMENT_TYPES_MAP: Document.initialDocumentTypes,
    ESTATE_TYPES,
    INTERNAL_CATEGORY_MAP,
    MAX_FILE_SIZE_BYTES,
    MAX_FILE_SIZE_MB,
    OTHER_TYPES,
    PARTY_TYPES,
    REFRESH_INTERVAL: 20 * MINUTES,
    SECTIONS,
    SESSION_DEBOUNCE: 250,
    SESSION_MODAL_TIMEOUT: 5 * MINUTES, // 5 minutes
    SESSION_TIMEOUT:
      (process.env.SESSION_TIMEOUT && parseInt(process.env.SESSION_TIMEOUT)) ||
      55 * MINUTES, // 55 minutes
    STATUS_TYPES,
    TRIAL_CITIES,
  }),
  getCurrentUser,
  getCurrentUserToken,
  getEntityConstructors: () => ({
    Case,
    CaseAssociationRequestFactory,
    DocketEntryFactory,
    ExternalDocumentFactory,
    ExternalDocumentInformationFactory,
    ForwardMessage,
    InitialWorkItemMessage,
    Petition,
    PetitionFromPaper,
    TrialSession,
  }),
  getError: e => {
    return ErrorFactory.getError(e);
  },
  getHttpClient: () => axios,
  getPersistenceGateway: () => {
    return {
      getDocument,
      getItem,
      removeItem,
      setItem,
      uploadDocument,
      uploadPdf,
    };
  },
  getScanner: getScannerInterface,
  getScannerResourceUri: () => {
    return (
      process.env.SCANNER_RESOURCE_URI || 'http://localhost:10000/Resources'
    );
  },
  getUniqueId: () => {
    return uuidv4();
  },
  getUseCases: () => allUseCases,
  getUtilities: () => {
    return {
      createISODateString,
      formatDateString,
      generatePdfUrl: generatePdfUrlFactory(jsPDF),
      isStringISOFormatted,
      prepareDateFromString,
    };
  },
  setCurrentUser,
  setCurrentUserToken,
};

export { applicationContext };
