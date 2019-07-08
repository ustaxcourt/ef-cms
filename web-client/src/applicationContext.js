import { Case } from '../../shared/src/business/entities/cases/Case';
import { ContactFactory } from '../../shared/src/business/entities/contacts/ContactFactory';
import { Document } from '../../shared/src/business/entities/Document';
import { Order } from '../../shared/src/business/entities/orders/Order';
import {
  createISODateString,
  formatDateString,
  isStringISOFormatted,
  prepareDateFromString,
} from '../../shared/src/business/utilities/DateHandler';
import axios from 'axios';
import uuidv4 from 'uuid/v4';
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
import { CaseExternal } from '../../shared/src/business/entities/cases/CaseExternal';
import { CaseInternal } from '../../shared/src/business/entities/cases/CaseInternal';
import { DocketEntryFactory } from '../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { ErrorFactory } from './presenter/errors/ErrorFactory';
import { ExternalDocumentFactory } from '../../shared/src/business/entities/externalDocument/ExternalDocumentFactory';
import { ExternalDocumentInformationFactory } from '../../shared/src/business/entities/externalDocument/ExternalDocumentInformationFactory';
import { ForwardMessage } from '../../shared/src/business/entities/ForwardMessage';
import { InitialWorkItemMessage } from '../../shared/src/business/entities/InitialWorkItemMessage';
import { OrderWithoutBody } from '../../shared/src/business/entities/orders/OrderWithoutBody';
import { TrialSession } from '../../shared/src/business/entities/TrialSession';
import { assignWorkItemsInteractor } from '../../shared/src/proxies/workitems/assignWorkItemsProxy';
import { authorizeCodeInteractor } from '../../shared/src/business/useCases/authorizeCodeInteractor';
import { completeWorkItemInteractor } from '../../shared/src/proxies/workitems/completeWorkItemProxy';
import { createCaseFromPaperInteractor } from '../../shared/src/proxies/createCaseFromPaperProxy';
import { createCaseInteractor } from '../../shared/src/proxies/createCaseProxy';
import { createCourtIssuedOrderPdfFromHtmlInteractor } from '../../shared/src/proxies/courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlProxy';
import { createCoverSheetInteractor } from '../../shared/src/proxies/documents/createCoverSheetProxy';
import { createDocumentInteractor } from '../../shared/src/proxies/documents/createDocumentProxy';
import { createTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/createTrialSessionProxy';
import { createWorkItemInteractor } from '../../shared/src/proxies/workitems/createWorkItemProxy';
import { downloadDocumentFileInteractor } from '../../shared/src/business/useCases/downloadDocumentFileInteractor';
import { fileExternalDocumentInteractor } from '../../shared/src/proxies/documents/fileExternalDocumentProxy';
import { filePetitionFromPaperInteractor } from '../../shared/src/business/useCases/filePetitionFromPaperInteractor';
import { filePetitionInteractor } from '../../shared/src/business/useCases/filePetitionInteractor';
import { forwardWorkItemInteractor } from '../../shared/src/proxies/workitems/forwardWorkItemProxy';
import { generateCaseAssociationDocumentTitleInteractor } from '../../shared/src/business/useCases/caseAssociationRequest/generateCaseAssociationDocumentTitleInteractor';
import { generateDocumentTitleInteractor } from '../../shared/src/business/useCases/externalDocument/generateDocumentTitleInteractor';
import { generatePDFFromPNGDataInteractor } from '../../shared/src/business/useCases/generatePDFFromPNGDataInteractor';
import { generateSignedDocumentInteractor } from '../../shared/src/business/useCases/generateSignedDocumentInteractor';
import { getCalendaredCasesForTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/getCalendaredCasesForTrialSessionProxy';
import { getCaseInteractor } from '../../shared/src/proxies/getCaseProxy';
import { getCaseTypesInteractor } from '../../shared/src/business/useCases/getCaseTypesInteractor';
import { getCasesByUserInteractor } from '../../shared/src/proxies/getCasesByUserProxy';
import { getDocumentQCBatchedForSectionInteractor } from '../../shared/src/proxies/workitems/getDocumentQCBatchedForSectionProxy';
import { getDocumentQCBatchedForUserInteractor } from '../../shared/src/proxies/workitems/getDocumentQCBatchedForUserProxy';
import { getDocumentQCInboxForSectionInteractor } from '../../shared/src/proxies/workitems/getDocumentQCInboxForSectionProxy';
import { getDocumentQCInboxForUserInteractor } from '../../shared/src/proxies/workitems/getDocumentQCInboxForUserProxy';
import { getDocumentQCServedForSectionInteractor } from '../../shared/src/proxies/workitems/getDocumentQCServedForSectionProxy';
import { getDocumentQCServedForUserInteractor } from '../../shared/src/proxies/workitems/getDocumentQCServedForUserProxy';
import { getEligibleCasesForTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/getEligibleCasesForTrialSessionProxy';
import { getFilingTypesInteractor } from '../../shared/src/business/useCases/getFilingTypesInteractor';
import { getInboxMessagesForSectionInteractor } from '../../shared/src/proxies/workitems/getInboxMessagesForSectionProxy';
import { getInboxMessagesForUserInteractor } from '../../shared/src/proxies/workitems/getInboxMessagesForUserProxy';
import { getInternalUsersInteractor } from '../../shared/src/proxies/users/getInternalUsesProxy';
import { getItem } from '../../shared/src/persistence/localStorage/getItem';
import { getItemInteractor } from '../../shared/src/business/useCases/getItemInteractor';
import { getNotificationsInteractor } from '../../shared/src/proxies/users/getNotificationsProxy';
import { getProcedureTypesInteractor } from '../../shared/src/business/useCases/getProcedureTypesInteractor';
import { getScannerInterface } from '../../shared/src/business/useCases/getScannerInterfaceInteractor';
import { getSentMessagesForSectionInteractor } from '../../shared/src/proxies/workitems/getSentMessagesForSectionProxy';
import { getSentMessagesForUserInteractor } from '../../shared/src/proxies/workitems/getSentMessagesForUserProxy';
import { getTrialSessionDetailsInteractor } from '../../shared/src/proxies/trialSessions/getTrialSessionDetailsProxy';
import { getTrialSessionsInteractor } from '../../shared/src/proxies/trialSessions/getTrialSessionsProxy';
import { getUserInteractor } from '../../shared/src/business/useCases/getUserInteractor';
import { getUsersInSectionInteractor } from '../../shared/src/proxies/users/getUsersInSectionProxy';
import { getWorkItemInteractor } from '../../shared/src/proxies/workitems/getWorkItemProxy';
import { loadPDFForSigningInteractor } from '../../shared/src/business/useCases/loadPDFForSigningInteractor';
import { recallPetitionFromIRSHoldingQueueInteractor } from '../../shared/src/proxies/recallPetitionFromIRSHoldingQueueProxy';
import { refreshTokenInteractor } from '../../shared/src/business/useCases/refreshTokenInteractor';
import { removeItem } from '../../shared/src/persistence/localStorage/removeItem';
import { removeItemInteractor } from '../../shared/src/business/useCases/removeItemInteractor';
import { runBatchProcessInteractor } from '../../shared/src/proxies/runBatchProcessProxy';
import { sanitizePdfInteractor } from '../../shared/src/proxies/documents/sanitizePdfProxy';
import { sendPetitionToIRSHoldingQueueInteractor } from '../../shared/src/proxies/sendPetitionToIRSHoldingQueueProxy';
import { setCaseToReadyForTrialInteractor } from '../../shared/src/proxies/setCaseToReadyForTrialProxy';
import { setItem } from '../../shared/src/persistence/localStorage/setItem';
import { setItemInteractor } from '../../shared/src/business/useCases/setItemInteractor';
import { setTrialSessionAsSwingSessionInteractor } from '../../shared/src/proxies/trialSessions/setTrialSessionAsSwingSessionProxy';
import { setTrialSessionCalendarInteractor } from '../../shared/src/proxies/trialSessions/setTrialSessionCalendarProxy';
import { setWorkItemAsReadInteractor } from '../../shared/src/proxies/workitems/setWorkItemAsReadProxy';
import { signDocumentInteractor } from '../../shared/src/proxies/documents/signDocumentProxy';
import { submitCaseAssociationRequestInteractor } from '../../shared/src/proxies/documents/submitCaseAssociationRequestProxy';
import { submitPendingCaseAssociationRequestInteractor } from '../../shared/src/proxies/documents/submitPendingCaseAssociationRequestProxy';
import { tryCatchDecorator } from './tryCatchDecorator';
import { updateCaseInteractor } from '../../shared/src/proxies/updateCaseProxy';
import { updateCaseTrialSortTagsInteractor } from '../../shared/src/proxies/updateCaseTrialSortTagsProxy';
import { uploadExternalDocumentInteractor } from '../../shared/src/business/useCases/externalDocument/uploadExternalDocumentInteractor';
import { uploadExternalDocumentsInteractor } from '../../shared/src/business/useCases/externalDocument/uploadExternalDocumentsInteractor';
import { validateCaseAssociationRequestInteractor } from '../../shared/src/business/useCases/caseAssociationRequest/validateCaseAssociationRequestInteractor';
import { validateCaseDetailInteractor } from '../../shared/src/business/useCases/validateCaseDetailInteractor';
import { validateDocketEntryInteractor } from '../../shared/src/business/useCases/docketEntry/validateDocketEntryInteractor';
import { validateExternalDocumentInformationInteractor } from '../../shared/src/business/useCases/externalDocument/validateExternalDocumentInformationInteractor';
import { validateExternalDocumentInteractor } from '../../shared/src/business/useCases/externalDocument/validateExternalDocumentInteractor';
import { validateForwardMessageInteractor } from '../../shared/src/business/useCases/workitems/validateForwardMessageInteractor';
import { validateInitialWorkItemMessageInteractor } from '../../shared/src/business/useCases/workitems/validateInitialWorkItemMessageInteractor';
import { validateOrderWithoutBodyInteractor } from '../../shared/src/business/useCases/courtIssuedOrder/validateOrderWithoutBodyInteractor';
import { validatePdfInteractor } from '../../shared/src/proxies/documents/validatePdfProxy';
import { validatePetitionFromPaperInteractor } from '../../shared/src/business/useCases/validatePetitionFromPaperInteractor';
import { validatePetitionInteractor } from '../../shared/src/business/useCases/validatePetitionInteractor';
import { validateTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/validateTrialSessionInteractor';
import { verifyCaseForUserInteractor } from '../../shared/src/proxies/verifyCaseForUserProxy';
import { verifyPendingCaseForUserInteractor } from '../../shared/src/proxies/verifyPendingCaseForUserProxy';
import { virusScanPdfInteractor } from '../../shared/src/proxies/documents/virusScanPdfProxy';

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
  assignWorkItemsInteractor,
  authorizeCodeInteractor,
  completeWorkItemInteractor,
  createCaseFromPaperInteractor,
  createCaseInteractor,
  createCourtIssuedOrderPdfFromHtmlInteractor,
  createCoverSheetInteractor,
  createDocumentInteractor,
  createTrialSessionInteractor,
  createWorkItemInteractor,
  downloadDocumentFileInteractor,
  fileExternalDocumentInteractor,
  filePetitionFromPaperInteractor,
  filePetitionInteractor,
  forwardWorkItemInteractor,
  generateCaseAssociationDocumentTitleInteractor,
  generateDocumentTitleInteractor,
  generatePDFFromPNGDataInteractor,
  generateSignedDocumentInteractor,
  getCalendaredCasesForTrialSessionInteractor,
  getCaseInteractor,
  getCaseTypesInteractor,
  getCasesByUserInteractor,
  getDocumentQCBatchedForSectionInteractor,
  getDocumentQCBatchedForUserInteractor,
  getDocumentQCInboxForSectionInteractor,
  getDocumentQCInboxForUserInteractor,
  getDocumentQCServedForSectionInteractor,
  getDocumentQCServedForUserInteractor,
  getEligibleCasesForTrialSessionInteractor,
  getFilingTypesInteractor,
  getInboxMessagesForSectionInteractor,
  getInboxMessagesForUserInteractor,
  getInternalUsersInteractor,
  getItemInteractor,
  getNotificationsInteractor,
  getProcedureTypesInteractor,
  getSentMessagesForSectionInteractor,
  getSentMessagesForUserInteractor,
  getTrialSessionDetailsInteractor,
  getTrialSessionsInteractor,
  getUserInteractor,
  getUsersInSectionInteractor,
  getWorkItemInteractor,
  loadPDFForSigningInteractor,
  recallPetitionFromIRSHoldingQueueInteractor,
  refreshTokenInteractor,
  removeItemInteractor,
  runBatchProcessInteractor,
  sanitizePdfInteractor,
  sendPetitionToIRSHoldingQueueInteractor,
  setCaseToReadyForTrialInteractor,
  setItemInteractor,
  setTrialSessionAsSwingSessionInteractor,
  setTrialSessionCalendarInteractor,
  setWorkItemAsReadInteractor,
  signDocumentInteractor,
  submitCaseAssociationRequestInteractor,
  submitPendingCaseAssociationRequestInteractor,
  updateCaseInteractor,
  updateCaseTrialSortTagsInteractor,
  uploadExternalDocumentInteractor,
  uploadExternalDocumentsInteractor,
  validateCaseAssociationRequestInteractor,
  validateCaseDetailInteractor,
  validateDocketEntryInteractor,
  validateExternalDocumentInformationInteractor,
  validateExternalDocumentInteractor,
  validateForwardMessageInteractor,
  validateInitialWorkItemMessageInteractor,
  validateOrderWithoutBodyInteractor,
  validatePdfInteractor,
  validatePetitionFromPaperInteractor,
  validatePetitionInteractor,
  validateTrialSessionInteractor,
  verifyCaseForUserInteractor,
  verifyPendingCaseForUserInteractor,
  virusScanPdfInteractor,
};
tryCatchDecorator(allUseCases);

const applicationContext = {
  getBaseUrl: () => {
    return process.env.API_URL || 'http://localhost:3000';
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
    BUSINESS_TYPES: ContactFactory.BUSINESS_TYPES,
    CASE_CAPTION_POSTFIX: Case.CASE_CAPTION_POSTFIX,
    CATEGORIES: Document.CATEGORIES,
    CATEGORY_MAP: Document.CATEGORY_MAP,
    CHAMBERS_SECTION,
    CHAMBERS_SECTIONS,
    COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
    DOCUMENT_TYPES_MAP: Document.initialDocumentTypes,
    ESTATE_TYPES: ContactFactory.ESTATE_TYPES,
    INTERNAL_CATEGORY_MAP: Document.INTERNAL_CATEGORY_MAP,
    MAX_FILE_SIZE_BYTES,
    MAX_FILE_SIZE_MB,
    ORDER_TYPES_MAP: Order.ORDER_TYPES,
    OTHER_TYPES: ContactFactory.OTHER_TYPES,
    PARTY_TYPES: ContactFactory.PARTY_TYPES,
    REFRESH_INTERVAL: 20 * MINUTES,
    SECTIONS,
    SESSION_DEBOUNCE: 250,
    SESSION_MODAL_TIMEOUT: 5 * MINUTES, // 5 minutes
    SESSION_TIMEOUT:
      (process.env.SESSION_TIMEOUT && parseInt(process.env.SESSION_TIMEOUT)) ||
      55 * MINUTES, // 55 minutes
    STATUS_TYPES: Case.STATUS_TYPES,
    TRIAL_CITIES: TrialSession.TRIAL_CITIES,
  }),
  getCurrentUser,
  getCurrentUserToken,
  getEntityConstructors: () => ({
    Case,
    CaseAssociationRequestFactory,
    CaseExternal,
    CaseInternal,
    DocketEntryFactory,
    ExternalDocumentFactory,
    ExternalDocumentInformationFactory,
    ForwardMessage,
    InitialWorkItemMessage,
    OrderWithoutBody,
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
      isStringISOFormatted,
      prepareDateFromString,
    };
  },
  setCurrentUser,
  setCurrentUserToken,
};

export { applicationContext };
