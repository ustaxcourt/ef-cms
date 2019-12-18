import {
  getCognitoLoginUrl,
  getUniqueId,
} from '../../shared/src/sharedAppContext.js';

import { AddPractitionerFactory } from '../../shared/src/business/entities/caseAssociation/AddPractitionerFactory';
import { AddRespondent } from '../../shared/src/business/entities/caseAssociation/AddRespondent';
import {
  CHAMBERS_SECTION,
  CHAMBERS_SECTIONS,
  SECTIONS,
} from '../../shared/src/business/entities/WorkQueue';
import { Case } from '../../shared/src/business/entities/cases/Case';
import { CaseAssociationRequestFactory } from '../../shared/src/business/entities/CaseAssociationRequestFactory';
import { CaseDeadline } from '../../shared/src/business/entities/CaseDeadline';
import { CaseExternal } from '../../shared/src/business/entities/cases/CaseExternal';
import { CaseExternalInformationFactory } from '../../shared/src/business/entities/cases/CaseExternalInformationFactory';
import { CaseInternal } from '../../shared/src/business/entities/cases/CaseInternal';
import { CaseSearch } from '../../shared/src/business/entities/cases/CaseSearch';
import { ContactFactory } from '../../shared/src/business/entities/contacts/ContactFactory';
import { CourtIssuedDocumentFactory } from '../../shared/src/business/entities/courtIssuedDocument/CourtIssuedDocumentFactory';
import { DocketEntryFactory } from '../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { Document } from '../../shared/src/business/entities/Document';
import { EditPractitionerFactory } from '../../shared/src/business/entities/caseAssociation/EditPractitionerFactory';
import { ErrorFactory } from './presenter/errors/ErrorFactory';
import { ExternalDocumentFactory } from '../../shared/src/business/entities/externalDocument/ExternalDocumentFactory';
import { ExternalDocumentInformationFactory } from '../../shared/src/business/entities/externalDocument/ExternalDocumentInformationFactory';
import { ForwardMessage } from '../../shared/src/business/entities/ForwardMessage';
import { SERVICE_STAMP_OPTIONS } from '../../shared/src/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import {
  compareISODateStrings,
  compareStrings,
} from '../../shared/src/business/utilities/sortFunctions';
import { fetchPendingItemsInteractor } from '../../shared/src/proxies/pendingItems/fetchPendingItemsProxy';
import { generatePrintablePendingReportInteractor } from '../../shared/src/proxies/pendingItems/generatePrintablePendingReportProxy';
const {
  getJudgeForUserChambersInteractor,
} = require('../../shared/src/business/useCases/users/getJudgeForUserChambersInteractor');
import { InitialWorkItemMessage } from '../../shared/src/business/entities/InitialWorkItemMessage';
import {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from '../../shared/src/persistence/s3/getUploadPolicy';
import { NewTrialSession } from '../../shared/src/business/entities/trialSessions/NewTrialSession';
import { Note } from '../../shared/src/business/entities/notes/Note';
import { Order } from '../../shared/src/business/entities/orders/Order';
import { OrderWithoutBody } from '../../shared/src/business/entities/orders/OrderWithoutBody';
import { ROLE_PERMISSIONS } from '../../shared/src/authorization/authorizationClientService';
import { TrialSession } from '../../shared/src/business/entities/trialSessions/TrialSession';
import { TrialSessionWorkingCopy } from '../../shared/src/business/entities/trialSessions/TrialSessionWorkingCopy';
import { User } from '../../shared/src/business/entities/User';
import { addCaseToTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/addCaseToTrialSessionProxy';
import { addConsolidatedCaseInteractor } from '../../shared/src/proxies/addConsolidatedCaseProxy';
import { addCoversheetInteractor } from '../../shared/src/proxies/documents/addCoversheetProxy';
import { archiveDraftDocumentInteractor } from '../../shared/src/proxies/archiveDraftDocumentProxy';
import { assignWorkItemsInteractor } from '../../shared/src/proxies/workitems/assignWorkItemsProxy';
import { associatePractitionerWithCaseInteractor } from '../../shared/src/proxies/manualAssociation/associatePractitionerWithCaseProxy';
import { associateRespondentWithCaseInteractor } from '../../shared/src/proxies/manualAssociation/associateRespondentWithCaseProxy';
import { authorizeCodeInteractor } from '../../shared/src/business/useCases/authorizeCodeInteractor';
import { batchDownloadTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/batchDownloadTrialSessionProxy';
import { blockCaseFromTrialInteractor } from '../../shared/src/proxies/blockCaseFromTrialProxy';
import { caseAdvancedSearchInteractor } from '../../shared/src/proxies/caseAdvancedSearchProxy';
import {
  compareCasesByDocketNumber,
  formatCase as formatCaseForTrialSession,
  formattedTrialSessionDetails,
} from '../../shared/src/business/utilities/getFormattedTrialSessionDetails';
import { completeDocketEntryQCInteractor } from '../../shared/src/proxies/editDocketEntry/completeDocketEntryQCProxy';
import { completeWorkItemInteractor } from '../../shared/src/proxies/workitems/completeWorkItemProxy';
import {
  constants,
  setServiceIndicatorsForCase,
} from '../../shared/src/business/utilities/setServiceIndicatorsForCase';
import { createCaseDeadlineInteractor } from '../../shared/src/proxies/caseDeadline/createCaseDeadlineProxy';
import { createCaseFromPaperInteractor } from '../../shared/src/proxies/createCaseFromPaperProxy';
import { createCaseInteractor } from '../../shared/src/proxies/createCaseProxy';
import { createCourtIssuedOrderPdfFromHtmlInteractor } from '../../shared/src/proxies/courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlProxy';
import {
  createISODateString,
  formatDateString,
  formatNow,
  isStringISOFormatted,
  prepareDateFromString,
} from '../../shared/src/business/utilities/DateHandler';
import { createTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/createTrialSessionProxy';
import { createWorkItemInteractor } from '../../shared/src/proxies/workitems/createWorkItemProxy';
import { deleteCaseDeadlineInteractor } from '../../shared/src/proxies/caseDeadline/deleteCaseDeadlineProxy';
import { deleteCaseNoteInteractor } from '../../shared/src/proxies/caseNote/deleteCaseNoteProxy';
import { deleteCounselFromCaseInteractor } from '../../shared/src/proxies/caseAssociation/deleteCounselFromCaseProxy';
import { deleteProceduralNoteInteractor } from '../../shared/src/proxies/proceduralNote/deleteProceduralNoteProxy';
import { fileCourtIssuedDocketEntryInteractor } from '../../shared/src/proxies/documents/fileCourtIssuedDocketEntryProxy';
import { fileCourtIssuedOrderInteractor } from '../../shared/src/proxies/courtIssuedOrder/fileCourtIssuedOrderProxy';
import { fileDocketEntryInteractor } from '../../shared/src/proxies/documents/fileDocketEntryProxy';
import { fileExternalDocumentForConsolidatedInteractor } from '../../shared/src/proxies/documents/fileExternalDocumentForConsolidatedProxy';
import { fileExternalDocumentInteractor } from '../../shared/src/proxies/documents/fileExternalDocumentProxy';
import { filePetitionFromPaperInteractor } from '../../shared/src/business/useCases/filePetitionFromPaperInteractor';
import { filePetitionInteractor } from '../../shared/src/business/useCases/filePetitionInteractor';
import {
  formatCase,
  formatCaseDeadlines,
  formatDocument,
  getFormattedCaseDetail,
  sortDocketRecords,
} from '../../shared/src/business/utilities/getFormattedCaseDetail';
import { forwardWorkItemInteractor } from '../../shared/src/proxies/workitems/forwardWorkItemProxy';
import { generateCaseAssociationDocumentTitleInteractor } from '../../shared/src/business/useCases/caseAssociationRequest/generateCaseAssociationDocumentTitleInteractor';
import { generateCourtIssuedDocumentTitleInteractor } from '../../shared/src/business/useCases/courtIssuedDocument/generateCourtIssuedDocumentTitleInteractor';
import { generateDocketRecordPdfInteractor } from '../../shared/src/proxies/generateDocketRecordPdfProxy';
import { generateDocumentTitleInteractor } from '../../shared/src/business/useCases/externalDocument/generateDocumentTitleInteractor';
import { generatePDFFromJPGDataInteractor } from '../../shared/src/business/useCases/generatePDFFromJPGDataInteractor';
import { generatePrintableFilingReceiptInteractor } from '../../shared/src/proxies/generatePrintableFilingReceiptProxy';
import { generateSignedDocumentInteractor } from '../../shared/src/business/useCases/generateSignedDocumentInteractor';
import { generateTrialCalendarPdfInteractor } from '../../shared/src/proxies/trialSessions/generateTrialCalendarPdfUrlProxy';
import { getAllCaseDeadlinesInteractor } from '../../shared/src/proxies/caseDeadline/getAllCaseDeadlinesProxy';
import { getBlockedCasesInteractor } from '../../shared/src/proxies/getBlockedCasesProxy';
import { getCalendaredCasesForTrialSessionInteractor } from '../../shared/src/proxies/trialSessions/getCalendaredCasesForTrialSessionProxy';
import { getCaseDeadlinesForCaseInteractor } from '../../shared/src/proxies/caseDeadline/getCaseDeadlinesForCaseProxy';
import { getCaseInteractor } from '../../shared/src/proxies/getCaseProxy';
import { getCaseNoteInteractor } from '../../shared/src/proxies/caseNote/getCaseNoteProxy';
import { getCaseTypesInteractor } from '../../shared/src/business/useCases/getCaseTypesInteractor';
import { getCasesByUserInteractor } from '../../shared/src/proxies/getCasesByUserProxy';
import { getConsolidatedCasesByCaseInteractor } from '../../shared/src/proxies/getConsolidatedCasesByCaseProxy';
import { getConsolidatedCasesByUserInteractor } from '../../shared/src/proxies/getConsolidatedCasesByUserProxy';
import { getDocument } from '../../shared/src/persistence/s3/getDocument';
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
import { getInternalUsersInteractor } from '../../shared/src/proxies/users/getInternalUsersProxy';
import { getItem } from '../../shared/src/persistence/localStorage/getItem';
import { getItemInteractor } from '../../shared/src/business/useCases/getItemInteractor';
import { getNotificationsInteractor } from '../../shared/src/proxies/users/getNotificationsProxy';
import { getPractitionersBySearchKeyInteractor } from '../../shared/src/proxies/users/getPractitionersBySearchKeyProxy';
import { getProcedureTypesInteractor } from '../../shared/src/business/useCases/getProcedureTypesInteractor';
import { getRespondentsBySearchKeyInteractor } from '../../shared/src/proxies/users/getRespondentsBySearchKeyProxy';
import { getSentMessagesForSectionInteractor } from '../../shared/src/proxies/workitems/getSentMessagesForSectionProxy';
import { getSentMessagesForUserInteractor } from '../../shared/src/proxies/workitems/getSentMessagesForUserProxy';
import { getTrialSessionDetailsInteractor } from '../../shared/src/proxies/trialSessions/getTrialSessionDetailsProxy';
import { getTrialSessionWorkingCopyInteractor } from '../../shared/src/proxies/trialSessions/getTrialSessionWorkingCopyProxy';
import { getTrialSessionsInteractor } from '../../shared/src/proxies/trialSessions/getTrialSessionsProxy';
import { getUserInteractor } from '../../shared/src/proxies/users/getUserProxy';
import { getUserPermissions } from '../../shared/src/authorization/getUserPermissions';
import { getUsersInSectionInteractor } from '../../shared/src/proxies/users/getUsersInSectionProxy';
import { getWorkItemInteractor } from '../../shared/src/proxies/workitems/getWorkItemProxy';
import { loadPDFForSigningInteractor } from '../../shared/src/business/useCases/loadPDFForSigningInteractor';
import { prioritizeCaseInteractor } from '../../shared/src/proxies/prioritizeCaseProxy';
import { recallPetitionFromIRSHoldingQueueInteractor } from '../../shared/src/proxies/recallPetitionFromIRSHoldingQueueProxy';
import { refreshTokenInteractor } from '../../shared/src/business/useCases/refreshTokenInteractor';
import { removeCaseFromTrialInteractor } from '../../shared/src/proxies/trialSessions/removeCaseFromTrialProxy';
import { removeItem } from '../../shared/src/persistence/localStorage/removeItem';
import { removeItemInteractor } from '../../shared/src/business/useCases/removeItemInteractor';
import { runBatchProcessInteractor } from '../../shared/src/proxies/runBatchProcessProxy';
import { runTrialSessionPlanningReportInteractor } from '../../shared/src/proxies/trialSessions/runTrialSessionPlanningReportProxy';
import { saveCaseDetailInternalEditInteractor } from '../../shared/src/proxies/saveCaseDetailInternalEditProxy';
import { saveIntermediateDocketEntryInteractor } from '../../shared/src/proxies/editDocketEntry/saveIntermediateDocketEntryProxy';
import { saveProceduralNoteInteractor } from '../../shared/src/proxies/proceduralNote/saveProceduralNoteProxy';
import { sendPetitionToIRSHoldingQueueInteractor } from '../../shared/src/proxies/sendPetitionToIRSHoldingQueueProxy';
import { serveCourtIssuedDocumentInteractor } from '../../shared/src/proxies/serveCourtIssuedDocumentProxy';
import { setItem } from '../../shared/src/persistence/localStorage/setItem';
import { setItemInteractor } from '../../shared/src/business/useCases/setItemInteractor';
import { setTrialSessionAsSwingSessionInteractor } from '../../shared/src/proxies/trialSessions/setTrialSessionAsSwingSessionProxy';
import { setTrialSessionCalendarInteractor } from '../../shared/src/proxies/trialSessions/setTrialSessionCalendarProxy';
import { setWorkItemAsReadInteractor } from '../../shared/src/proxies/workitems/setWorkItemAsReadProxy';
import { signDocumentInteractor } from '../../shared/src/proxies/documents/signDocumentProxy';
import { submitCaseAssociationRequestInteractor } from '../../shared/src/proxies/documents/submitCaseAssociationRequestProxy';
import { submitPendingCaseAssociationRequestInteractor } from '../../shared/src/proxies/documents/submitPendingCaseAssociationRequestProxy';
import { tryCatchDecorator } from './tryCatchDecorator';
import { unblockCaseFromTrialInteractor } from '../../shared/src/proxies/unblockCaseFromTrialProxy';
import { unprioritizeCaseInteractor } from '../../shared/src/proxies/unprioritizeCaseProxy';
import { updateCaseContextInteractor } from '../../shared/src/proxies/updateCaseContextProxy';
import { updateCaseDeadlineInteractor } from '../../shared/src/proxies/caseDeadline/updateCaseDeadlineProxy';
import { updateCaseNoteInteractor } from '../../shared/src/proxies/caseNote/updateCaseNoteProxy';
import { updateCaseTrialSortTagsInteractor } from '../../shared/src/proxies/updateCaseTrialSortTagsProxy';
import { updateCounselOnCaseInteractor } from '../../shared/src/proxies/caseAssociation/updateCounselOnCaseProxy';
import { updateCourtIssuedDocketEntryInteractor } from '../../shared/src/proxies/documents/updateCourtIssuedDocketEntryProxy';
import { updateCourtIssuedOrderInteractor } from '../../shared/src/proxies/courtIssuedOrder/updateCourtIssuedOrderProxy';
import { updateDocketEntryInteractor } from '../../shared/src/proxies/documents/updateDocketEntryProxy';
import { updatePrimaryContactInteractor } from '../../shared/src/proxies/updatePrimaryContactProxy';
import { updateTrialSessionWorkingCopyInteractor } from '../../shared/src/proxies/trialSessions/updateTrialSessionWorkingCopyProxy';
import { updateUserContactInformationInteractor } from '../../shared/src/proxies/users/updateUserContactInformationProxy';
import { uploadDocument } from '../../shared/src/persistence/s3/uploadDocument';
import { uploadDocumentInteractor } from '../../shared/src/business/useCases/externalDocument/uploadDocumentInteractor';
import { uploadExternalDocumentsInteractor } from '../../shared/src/business/useCases/externalDocument/uploadExternalDocumentsInteractor';
import { uploadOrderDocumentInteractor } from '../../shared/src/business/useCases/externalDocument/uploadOrderDocumentInteractor';
import { uploadPdf } from '../../shared/src/persistence/s3/uploadPdf';
import { validateAddPractitionerInteractor } from '../../shared/src/business/useCases/caseAssociation/validateAddPractitionerInteractor';
import { validateAddRespondentInteractor } from '../../shared/src/business/useCases/caseAssociation/validateAddRespondentInteractor';
import { validateCaseAdvancedSearchInteractor } from '../../shared/src/business/useCases/validateCaseAdvancedSearchInteractor';
import { validateCaseAssociationRequestInteractor } from '../../shared/src/business/useCases/caseAssociationRequest/validateCaseAssociationRequestInteractor';
import { validateCaseDeadlineInteractor } from '../../shared/src/business/useCases/caseDeadline/validateCaseDeadlineInteractor';
import { validateCaseDetailInteractor } from '../../shared/src/business/useCases/validateCaseDetailInteractor';
import { validateCourtIssuedDocketEntryInteractor } from '../../shared/src/business/useCases/courtIssuedDocument/validateCourtIssuedDocketEntryInteractor';
import { validateDocketEntryInteractor } from '../../shared/src/business/useCases/docketEntry/validateDocketEntryInteractor';
import { validateEditPractitionerInteractor } from '../../shared/src/business/useCases/caseAssociation/validateEditPractitionerInteractor';
import { validateExternalDocumentInformationInteractor } from '../../shared/src/business/useCases/externalDocument/validateExternalDocumentInformationInteractor';
import { validateExternalDocumentInteractor } from '../../shared/src/business/useCases/externalDocument/validateExternalDocumentInteractor';
import { validateForwardMessageInteractor } from '../../shared/src/business/useCases/workitems/validateForwardMessageInteractor';
import { validateInitialWorkItemMessageInteractor } from '../../shared/src/business/useCases/workitems/validateInitialWorkItemMessageInteractor';
import { validateNoteInteractor } from '../../shared/src/business/useCases/caseNote/validateNoteInteractor';
import { validateOrderWithoutBodyInteractor } from '../../shared/src/business/useCases/courtIssuedOrder/validateOrderWithoutBodyInteractor';
import { validatePdfInteractor } from '../../shared/src/proxies/documents/validatePdfProxy';
import { validatePetitionFromPaperInteractor } from '../../shared/src/business/useCases/validatePetitionFromPaperInteractor';
import { validatePetitionInteractor } from '../../shared/src/business/useCases/validatePetitionInteractor';
import { validatePrimaryContactInteractor } from '../../shared/src/business/useCases/validatePrimaryContactInteractor';
import { validateStartCaseWizardInteractor } from '../../shared/src/business/useCases/startCase/validateStartCaseWizardInteractor';
import { validateTrialSessionInteractor } from '../../shared/src/business/useCases/trialSessions/validateTrialSessionInteractor';
import { validateUserContactInteractor } from '../../shared/src/business/useCases/users/validateUserContactInteractor';
import { verifyPendingCaseForUserInteractor } from '../../shared/src/proxies/verifyPendingCaseForUserProxy';
import { virusScanPdfInteractor } from '../../shared/src/proxies/documents/virusScanPdfProxy';
import axios from 'axios';
import deepFreeze from 'deep-freeze';

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
  addCaseToTrialSessionInteractor,
  addConsolidatedCaseInteractor,
  addCoversheetInteractor,
  archiveDraftDocumentInteractor,
  assignWorkItemsInteractor,
  associatePractitionerWithCaseInteractor,
  associateRespondentWithCaseInteractor,
  authorizeCodeInteractor,
  batchDownloadTrialSessionInteractor,
  blockCaseFromTrialInteractor,
  caseAdvancedSearchInteractor,
  completeDocketEntryQCInteractor,
  completeWorkItemInteractor,
  createCaseDeadlineInteractor,
  createCaseFromPaperInteractor,
  createCaseInteractor,
  createCourtIssuedOrderPdfFromHtmlInteractor,
  createTrialSessionInteractor,
  createWorkItemInteractor,
  deleteCaseDeadlineInteractor,
  deleteCaseNoteInteractor,
  deleteCounselFromCaseInteractor,
  deleteProceduralNoteInteractor,
  fetchPendingItemsInteractor,
  fileCourtIssuedDocketEntryInteractor,
  fileCourtIssuedOrderInteractor,
  fileDocketEntryInteractor,
  fileExternalDocumentForConsolidatedInteractor,
  fileExternalDocumentInteractor,
  filePetitionFromPaperInteractor,
  filePetitionInteractor,
  forwardWorkItemInteractor,
  generateCaseAssociationDocumentTitleInteractor,
  generateCourtIssuedDocumentTitleInteractor,
  generateDocketRecordPdfInteractor,
  generateDocumentTitleInteractor,
  generatePDFFromJPGDataInteractor,
  generatePrintableFilingReceiptInteractor,
  generatePrintablePendingReportInteractor,
  generateSignedDocumentInteractor,
  generateTrialCalendarPdfInteractor,
  getAllCaseDeadlinesInteractor,
  getBlockedCasesInteractor,
  getCalendaredCasesForTrialSessionInteractor,
  getCaseDeadlinesForCaseInteractor,
  getCaseInteractor,
  getCaseNoteInteractor,
  getCaseTypesInteractor,
  getCasesByUserInteractor,
  getConsolidatedCasesByCaseInteractor,
  getConsolidatedCasesByUserInteractor,
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
  getJudgeForUserChambersInteractor,
  getNotificationsInteractor,
  getPractitionersBySearchKeyInteractor,
  getProcedureTypesInteractor,
  getRespondentsBySearchKeyInteractor,
  getSentMessagesForSectionInteractor,
  getSentMessagesForUserInteractor,
  getTrialSessionDetailsInteractor,
  getTrialSessionWorkingCopyInteractor,
  getTrialSessionsInteractor,
  getUserInteractor,
  getUsersInSectionInteractor,
  getWorkItemInteractor,
  loadPDFForSigningInteractor,
  prioritizeCaseInteractor,
  recallPetitionFromIRSHoldingQueueInteractor,
  refreshTokenInteractor,
  removeCaseFromTrialInteractor,
  removeItemInteractor,
  runBatchProcessInteractor,
  runTrialSessionPlanningReportInteractor,
  saveCaseDetailInternalEditInteractor,
  saveIntermediateDocketEntryInteractor,
  saveProceduralNoteInteractor,
  sendPetitionToIRSHoldingQueueInteractor,
  serveCourtIssuedDocumentInteractor,
  setItemInteractor,
  setTrialSessionAsSwingSessionInteractor,
  setTrialSessionCalendarInteractor,
  setWorkItemAsReadInteractor,
  signDocumentInteractor,
  submitCaseAssociationRequestInteractor,
  submitPendingCaseAssociationRequestInteractor,
  unblockCaseFromTrialInteractor,
  unprioritizeCaseInteractor,
  updateCaseContextInteractor,
  updateCaseDeadlineInteractor,
  updateCaseNoteInteractor,
  updateCaseTrialSortTagsInteractor,
  updateCounselOnCaseInteractor,
  updateCourtIssuedDocketEntryInteractor,
  updateCourtIssuedOrderInteractor,
  updateDocketEntryInteractor,
  updatePrimaryContactInteractor,
  updateTrialSessionWorkingCopyInteractor,
  updateUserContactInformationInteractor,
  uploadDocumentInteractor,
  uploadExternalDocumentsInteractor,
  uploadOrderDocumentInteractor,
  validateAddPractitionerInteractor,
  validateAddRespondentInteractor,
  validateCaseAdvancedSearchInteractor,
  validateCaseAssociationRequestInteractor,
  validateCaseDeadlineInteractor,
  validateCaseDetailInteractor,
  validateCourtIssuedDocketEntryInteractor,
  validateDocketEntryInteractor,
  validateEditPractitionerInteractor,
  validateExternalDocumentInformationInteractor,
  validateExternalDocumentInteractor,
  validateForwardMessageInteractor,
  validateInitialWorkItemMessageInteractor,
  validateNoteInteractor,
  validateOrderWithoutBodyInteractor,
  validatePdfInteractor,
  validatePetitionFromPaperInteractor,
  validatePetitionInteractor,
  validatePrimaryContactInteractor,
  validateStartCaseWizardInteractor,
  validateTrialSessionInteractor,
  validateUserContactInteractor,
  verifyPendingCaseForUserInteractor,
  virusScanPdfInteractor: args =>
    process.env.SKIP_VIRUS_SCAN ? null : virusScanPdfInteractor(args),
};
tryCatchDecorator(allUseCases);

const applicationContext = {
  convertBlobToUInt8Array: async blob => {
    return new Uint8Array(await new Response(blob).arrayBuffer());
  },
  getBaseUrl: () => {
    return process.env.API_URL || 'http://localhost:3000';
  },
  getCaseCaptionNames: Case.getCaseCaptionNames,
  getChiefJudgeNameForSigning: () => 'Maurice B. Foley',
  getCognitoClientId: () => {
    return process.env.COGNITO_CLIENT_ID || '6tu6j1stv5ugcut7dqsqdurn8q';
  },
  getCognitoLoginUrl,
  getCognitoRedirectUrl: () => {
    return process.env.COGNITO_REDIRECT_URI || 'http://localhost:1234/log-in';
  },
  getCognitoTokenUrl: () => {
    return (
      process.env.COGNITO_TOKEN_URL ||
      'https://auth-dev-flexion-efcms.auth.us-east-1.amazoncognito.com/oauth2/token'
    );
  },
  getConstants: () =>
    (process.env.USTC_DEBUG ? i => i : deepFreeze)({
      BUSINESS_TYPES: ContactFactory.BUSINESS_TYPES,
      CASE_CAPTION_POSTFIX: Case.CASE_CAPTION_POSTFIX,
      CASE_SEARCH_PAGE_SIZE: CaseSearch.CASE_SEARCH_PAGE_SIZE,
      CATEGORIES: Document.CATEGORIES,
      CATEGORY_MAP: Document.CATEGORY_MAP,
      CHAMBERS_SECTION,
      CHAMBERS_SECTIONS,
      COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
      COURT_ISSUED_EVENT_CODES: Document.COURT_ISSUED_EVENT_CODES,
      ESTATE_TYPES: ContactFactory.ESTATE_TYPES,
      INTERNAL_CATEGORY_MAP: Document.INTERNAL_CATEGORY_MAP,
      MAX_FILE_SIZE_BYTES,
      MAX_FILE_SIZE_MB,
      ORDER_TYPES_MAP: Order.ORDER_TYPES,
      OTHER_TYPES: ContactFactory.OTHER_TYPES,
      PARTY_TYPES: ContactFactory.PARTY_TYPES,
      REFRESH_INTERVAL: 20 * MINUTES,
      ROLE_PERMISSIONS,
      SECTIONS,
      SERVICE_INDICATOR_TYPES: constants,
      SERVICE_STAMP_OPTIONS,
      SESSION_DEBOUNCE: 250,
      SESSION_MODAL_TIMEOUT: 5 * MINUTES, // 5 minutes
      SESSION_TIMEOUT:
        (process.env.SESSION_TIMEOUT &&
          parseInt(process.env.SESSION_TIMEOUT)) ||
        55 * MINUTES, // 55 minutes
      STATUS_TYPES: Case.STATUS_TYPES,
      STATUS_TYPES_MANUAL_UPDATE: Case.STATUS_TYPES_MANUAL_UPDATE,
      STATUS_TYPES_WITH_ASSOCIATED_JUDGE:
        Case.STATUS_TYPES_WITH_ASSOCIATED_JUDGE,
      TRIAL_CITIES: TrialSession.TRIAL_CITIES,
      TRIAL_SESSION_TYPES: TrialSession.SESSION_TYPES,
      TRIAL_STATUS_TYPES: TrialSessionWorkingCopy.TRIAL_STATUS_TYPES,
      US_STATES: ContactFactory.US_STATES,
      USER_ROLES: User.ROLES,
    }),
  getCurrentUser,
  getCurrentUserPermissions: () => {
    const user = getCurrentUser();
    return getUserPermissions(user);
  },
  getCurrentUserToken,
  getEntityConstructors: () => ({
    AddPractitionerFactory,
    AddRespondent,
    Case,
    CaseAssociationRequestFactory,
    CaseDeadline,
    CaseExternal,
    CaseExternalInformationFactory,
    CaseInternal,
    ContactFactory,
    CourtIssuedDocumentFactory,
    DocketEntryFactory,
    Document,
    EditPractitionerFactory,
    ExternalDocumentFactory,
    ExternalDocumentInformationFactory,
    ForwardMessage,
    InitialWorkItemMessage,
    NewTrialSession,
    Note,
    OrderWithoutBody,
    User,
  }),
  getError: e => {
    return ErrorFactory.getError(e);
  },
  getFileReader: () => FileReader,
  getHttpClient: () => axios,
  getPdfJs: async () => {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    return pdfjsLib;
  },
  getPdfStyles: async () => {
    const pdfStyles = await import('../../shared/src/tools/pdfStyles.js');
    return pdfStyles;
  },
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
  getScanner: async () => {
    if (process.env.NO_SCANNER) {
      const scanner = await import(
        '../../shared/src/persistence/dynamsoft/getScannerMockInterface'
      );
      return scanner.getScannerInterface();
    } else {
      const scanner = await import(
        '../../shared/src/persistence/dynamsoft/getScannerInterface'
      );
      return scanner.getScannerInterface();
    }
  },
  getScannerResourceUri: () => {
    return (
      process.env.SCANNER_RESOURCE_URI || 'http://localhost:10000/Resources'
    );
  },
  getUniqueId,
  getUseCases: () => allUseCases,
  getUserPermissions,
  getUtilities: () => {
    return {
      compareCasesByDocketNumber,
      compareISODateStrings,
      compareStrings,
      createISODateString,
      formatCase,
      formatCaseDeadlines,
      formatCaseForTrialSession,
      formatDateString,
      formatDocument,
      formatNow,
      formattedTrialSessionDetails,
      getFormattedCaseDetail,
      isExternalUser: User.isExternalUser,
      isInternalUser: User.isInternalUser,
      isStringISOFormatted,
      prepareDateFromString,
      setServiceIndicatorsForCase,
      sortDocketRecords,
    };
  },
  setCurrentUser,
  setCurrentUserToken,
};

export { applicationContext };
