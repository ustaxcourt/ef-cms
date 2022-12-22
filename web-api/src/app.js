/* eslint-disable max-lines */
const cors = require('cors');
const createApplicationContext = require('./applicationContext');
const express = require('express');
const logger = require('./logger');
const { getCurrentInvoke } = require('@vendia/serverless-express');
const { lambdaWrapper } = require('./lambdaWrapper');
const { set } = require('lodash');
const applicationContext = createApplicationContext({});

const app = express();

const allowAccessOriginFunction = (origin, callback) => {
  //Origin header wasn't provided
  if (!origin || origin === '') {
    callback(null, '*');
    return;
  }

  //if the backend is running locally or if an official deployed front-end called the backend, parrot out the Origin
  //this is required for the browser to support receiving and sending cookies
  if (process.env.IS_LOCAL || origin.includes(process.env.EFCMS_DOMAIN)) {
    callback(null, origin);
    return;
  }

  //some unknown front-end called us
  callback(null, '*');
};

const defaultCorsOptions = {
  origin: allowAccessOriginFunction,
};

const authCorsOptions = {
  ...defaultCorsOptions,
  credentials: true,
};

app.use('/auth', cors(authCorsOptions));
app.use(cors(defaultCorsOptions));
app.use(express.json({ limit: '1200kb' }));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    // we added this to suppress error `Missing x-apigateway-event or x-apigateway-context header(s)` locally
    // aws-serverless-express/middleware plugin is looking for these headers, which are needed on the lambdas
    req.headers['x-apigateway-event'] = 'null';
    req.headers['x-apigateway-context'] = 'null';
  }
  return next();
});
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    const currentInvoke = getCurrentInvoke();
    set(currentInvoke, 'event.requestContext.identity.sourceIp', 'localhost');
  }
  next();
});
app.use(logger());

const {
  addCaseToTrialSessionLambda,
} = require('./trialSessions/addCaseToTrialSessionLambda');
const {
  addConsolidatedCaseLambda,
} = require('./cases/addConsolidatedCaseLambda');
const {
  addDeficiencyStatisticLambda,
} = require('./cases/addDeficiencyStatisticLambda');
const {
  addPetitionerToCaseLambda,
} = require('./cases/addPetitionerToCaseLambda');
const {
  appendAmendedPetitionFormLambda,
} = require('./courtIssuedOrder/appendAmendedPetitionFormLambda');
const {
  archiveCorrespondenceDocumentLambda,
} = require('./correspondence/archiveCorrespondenceDocumentLambda');
const {
  archiveDraftDocumentLambda,
} = require('./documents/archiveDraftDocumentLambda');
const {
  associateIrsPractitionerWithCaseLambda,
} = require('./manualAssociation/associateIrsPractitionerWithCaseLambda');
const {
  associatePrivatePractitionerWithCaseLambda,
} = require('./manualAssociation/associatePrivatePractitionerWithCaseLambda');
const {
  batchDownloadTrialSessionLambda,
} = require('./trialSessions/batchDownloadTrialSessionLambda');
const {
  blockCaseFromTrialLambda,
} = require('./cases/blockCaseFromTrialLambda');
const {
  caseAdvancedSearchLambda,
} = require('./cases/caseAdvancedSearchLambda');
const {
  checkEmailAvailabilityLambda,
} = require('./users/checkEmailAvailabilityLambda');
const {
  checkForReadyForTrialCasesLambda,
} = require('./cases/checkForReadyForTrialCasesLambda');
const {
  closeTrialSessionLambda,
} = require('./trialSessions/closeTrialSessionLambda');
const {
  completeDocketEntryQCLambda,
} = require('./documents/completeDocketEntryQCLambda');
const {
  completeWorkItemLambda,
} = require('./workitems/completeWorkItemLambda');
const {
  createCaseDeadlineLambda,
} = require('./caseDeadline/createCaseDeadlineLambda');
const {
  createCaseFromPaperLambda,
} = require('./cases/createCaseFromPaperLambda');
const {
  createCourtIssuedOrderPdfFromHtmlLambda,
} = require('./courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlLambda');
const {
  createPractitionerDocumentLambda,
} = require('./practitioners/createPractitionerDocumentLambda');
const {
  createPractitionerUserLambda,
} = require('./practitioners/createPractitionerUserLambda');
const {
  createTrialSessionLambda,
} = require('./trialSessions/createTrialSessionLambda');
const {
  deleteCaseDeadlineLambda,
} = require('./caseDeadline/deleteCaseDeadlineLambda');
const {
  deleteCounselFromCaseLambda,
} = require('./cases/deleteCounselFromCaseLambda');
const {
  deleteDeficiencyStatisticLambda,
} = require('./cases/deleteDeficiencyStatisticLambda');
const {
  deletePractitionerDocumentLambda,
} = require('./practitioners/deletePractitionerDocumentLambda');
const {
  deleteTrialSessionLambda,
} = require('./trialSessions/deleteTrialSessionLambda');
const {
  deleteUserCaseNoteLambda,
} = require('./caseNote/deleteUserCaseNoteLambda');
const {
  downloadPolicyUrlLambda,
} = require('./documents/downloadPolicyUrlLambda');
const {
  editPractitionerDocumentLambda,
} = require('./practitioners/editPractitionerDocumentLambda');
const {
  fetchPendingItemsLambda,
} = require('./pendingItems/fetchPendingItemsLambda');
const {
  fileAndServeCourtIssuedDocumentLambda,
} = require('./cases/fileAndServeCourtIssuedDocumentLambda');
const {
  fileCorrespondenceDocumentLambda,
} = require('./correspondence/fileCorrespondenceDocumentLambda');
const {
  fileCourtIssuedDocketEntryLambda,
} = require('./documents/fileCourtIssuedDocketEntryLambda');
const {
  fileCourtIssuedOrderToCaseLambda,
} = require('./documents/fileCourtIssuedOrderToCaseLambda');
const {
  fileExternalDocumentToCaseLambda,
} = require('./documents/fileExternalDocumentToCaseLambda');
const {
  fileExternalDocumentToConsolidatedCasesLambda,
} = require('./documents/fileExternalDocumentToConsolidatedCasesLambda');
const {
  generateDocketRecordPdfLambda,
} = require('./cases/generateDocketRecordPdfLambda');
const {
  generateDraftStampOrderLambda,
} = require('./documents/generateDraftStampOrderLambda');
const {
  generatePractitionerCaseListPdfLambda,
} = require('./cases/generatePractitionerCaseListPdfLambda');
const {
  generatePrintableCaseInventoryReportLambda,
} = require('./reports/generatePrintableCaseInventoryReportLambda');
const {
  generatePrintableFilingReceiptLambda,
} = require('./documents/generatePrintableFilingReceiptLambda');
const {
  generatePrintablePendingReportLambda,
} = require('./pendingItems/generatePrintablePendingReportLambda');
const {
  generateTrialCalendarPdfLambda,
} = require('./trialSessions/generateTrialCalendarPdfLambda');
const {
  getCalendaredCasesForTrialSessionLambda,
} = require('./trialSessions/getCalendaredCasesForTrialSessionLambda');
const {
  getCaseDeadlinesForCaseLambda,
} = require('./caseDeadline/getCaseDeadlinesForCaseLambda');
const {
  getCaseDeadlinesLambda,
} = require('./caseDeadline/getCaseDeadlinesLambda');
const {
  getCaseInventoryReportLambda,
} = require('./reports/getCaseInventoryReportLambda');
const {
  getCompletedMessagesForSectionLambda,
} = require('./messages/getCompletedMessagesForSectionLambda');
const {
  getCompletedMessagesForUserLambda,
} = require('./messages/getCompletedMessagesForUserLambda');
const {
  getConsolidatedCasesByCaseLambda,
} = require('./cases/getConsolidatedCasesByCaseLambda');
const {
  getDocumentContentsForDocketEntryLambda,
} = require('./documents/getDocumentContentsForDocketEntryLambda');
const {
  getDocumentDownloadUrlLambda,
} = require('./documents/getDocumentDownloadUrlLambda');
const {
  getDocumentDownloadUrlLambda: v1GetDocumentDownloadUrlLambda,
} = require('./v1/getDocumentDownloadUrlLambda');
const {
  getDocumentDownloadUrlLambda: v2GetDocumentDownloadUrlLambda,
} = require('./v2/getDocumentDownloadUrlLambda');
const {
  getDocumentQCInboxForSectionLambda,
} = require('./workitems/getDocumentQCInboxForSectionLambda');
const {
  getDocumentQCInboxForUserLambda,
} = require('./workitems/getDocumentQCInboxForUserLambda');
const {
  getDocumentQCServedForSectionLambda,
} = require('./workitems/getDocumentQCServedForSectionLambda');
const {
  getDocumentQCServedForUserLambda,
} = require('./workitems/getDocumentQCServedForUserLambda');
const {
  getEligibleCasesForTrialSessionLambda,
} = require('./trialSessions/getEligibleCasesForTrialSessionLambda');
const {
  getFeatureFlagValueLambda,
} = require('./featureFlag/getFeatureFlagValueLambda');
const {
  getGeneratePrintableTrialSessionCopyReportLambda,
} = require('./trialSessions/getGeneratePrintableTrialSessionCopyReportLambda');
const {
  getInboxMessagesForSectionLambda,
} = require('./messages/getInboxMessagesForSectionLambda');
const {
  getInboxMessagesForUserLambda,
} = require('./messages/getInboxMessagesForUserLambda');
const {
  getIrsPractitionersBySearchKeyLambda,
} = require('./users/getIrsPractitionersBySearchKeyLambda');
const {
  getMaintenanceModeLambda,
} = require('./maintenance/getMaintenanceModeLambda');
const {
  getMessagesForCaseLambda,
} = require('./messages/getMessagesForCaseLambda');
const {
  getOutboxMessagesForSectionLambda,
} = require('./messages/getOutboxMessagesForSectionLambda');
const {
  getOutboxMessagesForUserLambda,
} = require('./messages/getOutboxMessagesForUserLambda');
const {
  getPractitionerByBarNumberLambda,
} = require('./practitioners/getPractitionerByBarNumberLambda');
const {
  getPractitionerDocumentDownloadUrlLambda,
} = require('./practitioners/getPractitionerDocumentDownloadUrlLambda');
const {
  getPractitionerDocumentLambda,
} = require('./practitioners/getPractitionerDocumentLambda');
const {
  getPractitionerDocumentsLambda,
} = require('./practitioners/getPractitionerDocumentsLambda');
const {
  getPractitionersByNameLambda,
} = require('./practitioners/getPractitionersByNameLambda');
const {
  getPrivatePractitionersBySearchKeyLambda,
} = require('./users/getPrivatePractitionersBySearchKeyLambda');
const {
  getReconciliationReportLambda: v2GetReconciliationReportLambda,
} = require('./v2/getReconciliationReportLambda');
const {
  getStatusOfVirusScanLambda,
} = require('./documents/getStatusOfVirusScanLambda');
const {
  getTrialSessionDetailsLambda,
} = require('./trialSessions/getTrialSessionDetailsLambda');
const {
  getTrialSessionsForJudgeLambda,
} = require('./trialSessions/getTrialSessionsForJudgeLambda');
const {
  getTrialSessionsLambda,
} = require('./trialSessions/getTrialSessionsLambda');
const {
  getTrialSessionWorkingCopyLambda,
} = require('./trialSessions/getTrialSessionWorkingCopyLambda');
const {
  getUserCaseNoteForCasesLambda,
} = require('./caseNote/getUserCaseNoteForCasesLambda');
const {
  getUserPendingEmailLambda,
} = require('./users/getUserPendingEmailLambda');
const {
  getUserPendingEmailStatusLambda,
} = require('./users/getUserPendingEmailStatusLambda');
const {
  getUsersPendingEmailLambda,
} = require('./users/getUsersPendingEmailLambda');
const {
  opinionAdvancedSearchLambda,
} = require('./documents/opinionAdvancedSearchLambda');
const {
  orderAdvancedSearchLambda,
} = require('./documents/orderAdvancedSearchLambda');
const {
  privatePractitionerCaseAssociationLambda,
} = require('./cases/privatePractitionerCaseAssociationLambda');
const {
  privatePractitionerPendingCaseAssociationLambda,
} = require('./cases/privatePractitionerPendingCaseAssociationLambda');
const {
  removeCaseFromTrialLambda,
} = require('./trialSessions/removeCaseFromTrialLambda');
const {
  removeCasePendingItemLambda,
} = require('./cases/removeCasePendingItemLambda');
const {
  removeConsolidatedCasesLambda,
} = require('./cases/removeConsolidatedCasesLambda');
const {
  removePdfFromDocketEntryLambda,
} = require('./documents/removePdfFromDocketEntryLambda');
const {
  removePetitionerAndUpdateCaptionLambda,
} = require('./cases/removePetitionerAndUpdateCaptionLambda');
const {
  removeSignatureFromDocumentLambda,
} = require('./documents/removeSignatureFromDocumentLambda');
const {
  runTrialSessionPlanningReportLambda,
} = require('./trialSessions/runTrialSessionPlanningReportLambda');
const {
  saveCalendarNoteLambda,
} = require('./trialSessions/saveCalendarNoteLambda');
const {
  saveCaseDetailInternalEditLambda,
} = require('./cases/saveCaseDetailInternalEditLambda');
const {
  saveSignedDocumentLambda,
} = require('./documents/saveSignedDocumentLambda');
const {
  sealCaseContactAddressLambda,
} = require('./cases/sealCaseContactAddressLambda');
const {
  serveCourtIssuedDocumentLambda,
} = require('./cases/serveCourtIssuedDocumentLambda');
const {
  serveExternallyFiledDocumentLambda,
} = require('./documents/serveExternallyFiledDocumentLambda');
const {
  setNoticesForCalendaredTrialSessionLambda,
} = require('./trialSessions/setNoticesForCalendaredTrialSessionLambda');
const {
  setTrialSessionAsSwingSessionLambda,
} = require('./trialSessions/setTrialSessionAsSwingSessionLambda');
const {
  setTrialSessionCalendarLambda,
} = require('./trialSessions/setTrialSessionCalendarLambda');
const {
  setWorkItemAsReadLambda,
} = require('./workitems/setWorkItemAsReadLambda');
const {
  strikeDocketEntryLambda,
} = require('./documents/strikeDocketEntryLambda');
const {
  unblockCaseFromTrialLambda,
} = require('./cases/unblockCaseFromTrialLambda');
const {
  unsealDocketEntryLambda,
} = require('./documents/unsealDocketEntryLambda');
const {
  updateCaseDeadlineLambda,
} = require('./caseDeadline/updateCaseDeadlineLambda');
const {
  updateCaseTrialSortTagsLambda,
} = require('./cases/updateCaseTrialSortTagsLambda');
const {
  updateCorrespondenceDocumentLambda,
} = require('./correspondence/updateCorrespondenceDocumentLambda');
const {
  updateCounselOnCaseLambda,
} = require('./cases/updateCounselOnCaseLambda');
const {
  updateCourtIssuedDocketEntryLambda,
} = require('./documents/updateCourtIssuedDocketEntryLambda');
const {
  updateCourtIssuedOrderToCaseLambda,
} = require('./documents/updateCourtIssuedOrderToCaseLambda');
const {
  updateDeficiencyStatisticLambda,
} = require('./cases/updateDeficiencyStatisticLambda');
const {
  updateDocketEntryMetaLambda,
} = require('./documents/updateDocketEntryMetaLambda');
const {
  updateOtherStatisticsLambda,
} = require('./cases/updateOtherStatisticsLambda');
const {
  updatePetitionerInformationLambda,
} = require('./cases/updatePetitionerInformationLambda');
const {
  updatePractitionerUserLambda,
} = require('./practitioners/updatePractitionerUserLambda');
const {
  updateQcCompleteForTrialLambda,
} = require('./cases/updateQcCompleteForTrialLambda');
const {
  updateTrialSessionLambda,
} = require('./trialSessions/updateTrialSessionLambda');
const {
  updateTrialSessionWorkingCopyLambda,
} = require('./trialSessions/updateTrialSessionWorkingCopyLambda');
const {
  updateUserCaseNoteLambda,
} = require('./caseNote/updateUserCaseNoteLambda');
const {
  updateUserContactInformationLambda,
} = require('./users/updateUserContactInformationLambda');
const {
  updateUserPendingEmailLambda,
} = require('./users/updateUserPendingEmailLambda');
const {
  verifyPendingCaseForUserLambda,
} = require('./cases/verifyPendingCaseForUserLambda');
const {
  verifyUserPendingEmailLambda,
} = require('./users/verifyUserPendingEmailLambda');
const { addCoversheetLambda } = require('./documents/addCoversheetLambda');
const { addPaperFilingLambda } = require('./documents/addPaperFilingLambda');
const { advancedQueryLimiter } = require('./middleware/advancedQueryLimiter');
const { assignWorkItemsLambda } = require('./workitems/assignWorkItemsLambda');
const { authenticateUserLambda } = require('./auth/authenticateUserLambda');
const { completeMessageLambda } = require('./messages/completeMessageLambda');
const { createCaseLambda } = require('./cases/createCaseLambda');
const { createMessageLambda } = require('./messages/createMessageLambda');
const { createUserLambda } = require('./users/createUserLambda');
const { deleteAuthCookieLambda } = require('./auth/deleteAuthCookieLambda');
const { deleteCaseNoteLambda } = require('./caseNote/deleteCaseNoteLambda');
const { editPaperFilingLambda } = require('./documents/editPaperFilingLambda');
const { forwardMessageLambda } = require('./messages/forwardMessageLambda');
const { getBlockedCasesLambda } = require('./reports/getBlockedCasesLambda');
const { getCaseExistsLambda } = require('./cases/getCaseExistsLambda');
const { getCaseLambda } = require('./cases/getCaseLambda');
const { getCaseLambda: v1GetCaseLambda } = require('./v1/getCaseLambda');
const { getCaseLambda: v2GetCaseLambda } = require('./v2/getCaseLambda');
const { getCasesForUserLambda } = require('./cases/getCasesForUserLambda');
const { getInternalUsersLambda } = require('./users/getInternalUsersLambda');
const { getJudgeInSectionLambda } = require('./users/getJudgeInSectionLambda');
const { getMessageThreadLambda } = require('./messages/getMessageThreadLambda');
const { getNotificationsLambda } = require('./users/getNotificationsLambda');
const { getUploadPolicyLambda } = require('./documents/getUploadPolicyLambda');
const { getUserByIdLambda } = require('./users/getUserByIdLambda');
const { getUserCaseNoteLambda } = require('./caseNote/getUserCaseNoteLambda');
const { getUserLambda } = require('./users/getUserLambda');
const { getUsersInSectionLambda } = require('./users/getUsersInSectionLambda');
const { getWorkItemLambda } = require('./workitems/getWorkItemLambda');
const { ipLimiter } = require('./middleware/ipLimiter');
const { prioritizeCaseLambda } = require('./cases/prioritizeCaseLambda');
const { refreshAuthTokenLambda } = require('./auth/refreshAuthTokenLambda');
const { replyToMessageLambda } = require('./messages/replyToMessageLambda');
const { saveCaseNoteLambda } = require('./caseNote/saveCaseNoteLambda');
const { sealCaseLambda } = require('./cases/sealCaseLambda');
const { sealDocketEntryLambda } = require('./documents/sealDocketEntryLambda');
const { serveCaseToIrsLambda } = require('./cases/serveCaseToIrsLambda');
const { setForHearingLambda } = require('./trialSessions/setForHearingLambda');
const { setMessageAsReadLambda } = require('./messages/setMessageAsReadLambda');
const { swaggerJsonLambda } = require('./swagger/swaggerJsonLambda');
const { swaggerLambda } = require('./swagger/swaggerLambda');
const { unprioritizeCaseLambda } = require('./cases/unprioritizeCaseLambda');
const { unsealCaseLambda } = require('./cases/unsealCaseLambda');
const { updateCaseContextLambda } = require('./cases/updateCaseContextLambda');
const { updateCaseDetailsLambda } = require('./cases/updateCaseDetailsLambda');
const { updateContactLambda } = require('./cases/updateContactLambda');
const { userIdLimiter } = require('./middleware/userIdLimiter');
const { validatePdfLambda } = require('./documents/validatePdfLambda');

/**
 * Important note: order of routes DOES matter!
 * For example:
 *   app.get('/something/:id', getId);
 *     vs
 *   app.get('/something/more', getMore);
 *
 * If the routes are given to express in the above order, a request to
 *   `GET /something/more`
 * will match the first which will execute `getId` rather than `getMore`.
 * Always put "higher priority routes" before their competition.
 * Consider grouping the routes by request method.
 */

/**
 * api
 */
{
  app.get('/api/swagger', lambdaWrapper(swaggerLambda));
  app.get('/api/swagger.json', lambdaWrapper(swaggerJsonLambda));
  app.get('/api/notifications', lambdaWrapper(getNotificationsLambda));
  app.post(
    '/api/court-issued-order',
    lambdaWrapper(createCourtIssuedOrderPdfFromHtmlLambda),
  );
  app.post(
    '/api/docket-record-pdf',
    lambdaWrapper(generateDocketRecordPdfLambda),
  );
}

/**
 * case-deadlines
 */
{
  app.put(
    '/case-deadlines/:docketNumber/:caseDeadlineId',
    lambdaWrapper(updateCaseDeadlineLambda),
  );
  app.delete(
    '/case-deadlines/:docketNumber/:caseDeadlineId',
    lambdaWrapper(deleteCaseDeadlineLambda),
  );
  app.post(
    '/case-deadlines/:docketNumber',
    lambdaWrapper(createCaseDeadlineLambda),
  );
  app.get(
    '/case-deadlines/:docketNumber',
    lambdaWrapper(getCaseDeadlinesForCaseLambda),
  );
  app.get('/case-deadlines', lambdaWrapper(getCaseDeadlinesLambda));
}
/**
 * case-documents
 */
{
  //GET
  app.get(
    '/case-documents/:documentContentsId/document-contents',
    lambdaWrapper(getDocumentContentsForDocketEntryLambda),
  );
  app.get(
    '/case-documents/:docketNumber/:key/document-download-url',
    lambdaWrapper(getDocumentDownloadUrlLambda),
  );
  app.get(
    '/case-documents/:docketNumber/:key/download-policy-url',
    lambdaWrapper(downloadPolicyUrlLambda),
  );
  app.get(
    '/case-documents/opinion-search',
    ipLimiter({
      applicationContext,
      key: applicationContext.getConstants().ADVANCED_DOCUMENT_IP_LIMITER_KEY,
    }),
    userIdLimiter('opinion-search'),
    advancedQueryLimiter({
      applicationContext,
      key: applicationContext.getConstants().ADVANCED_DOCUMENT_LIMITER_KEY,
    }),
    lambdaWrapper(opinionAdvancedSearchLambda),
  );
  app.get(
    '/case-documents/order-search',
    ipLimiter({
      applicationContext,
      key: applicationContext.getConstants().ADVANCED_DOCUMENT_IP_LIMITER_KEY,
    }),
    userIdLimiter('order-search'),
    advancedQueryLimiter({
      applicationContext,
      key: applicationContext.getConstants().ADVANCED_DOCUMENT_LIMITER_KEY,
    }),
    lambdaWrapper(orderAdvancedSearchLambda),
  );
  // POST
  app.post(
    '/case-documents/:docketEntryId/append-pdf',
    lambdaWrapper(appendAmendedPetitionFormLambda),
  );
  app.post(
    '/case-documents/:subjectCaseDocketNumber/:docketEntryId/serve-court-issued',
    lambdaWrapper(serveCourtIssuedDocumentLambda, { isAsync: true }),
  );
  app.post(
    '/case-documents/:docketNumber/:docketEntryId/coversheet',
    lambdaWrapper(addCoversheetLambda),
  );
  app.post(
    '/case-documents/:docketNumber/:motionDocketEntryId/stamp',
    lambdaWrapper(generateDraftStampOrderLambda),
  );
  app.post(
    '/case-documents/:docketNumber/:docketEntryId/remove-signature',
    lambdaWrapper(removeSignatureFromDocumentLambda),
  );
  app.post(
    '/case-documents/:docketNumber/:docketEntryId/remove-pdf',
    lambdaWrapper(removePdfFromDocketEntryLambda),
  );
  app.post(
    '/case-documents/:docketNumber/:docketEntryId/sign',
    lambdaWrapper(saveSignedDocumentLambda),
  );
  app.post(
    '/case-documents/:subjectCaseDocketNumber/:docketEntryId/serve',
    lambdaWrapper(serveExternallyFiledDocumentLambda, { isAsync: true }),
  );
  app.post(
    '/case-documents/:docketNumber/external-document',
    lambdaWrapper(fileExternalDocumentToCaseLambda),
  );
  app.post(
    '/case-documents/consolidated/:leadDocketNumber/external-document',
    lambdaWrapper(fileExternalDocumentToConsolidatedCasesLambda),
  );
  app.post(
    '/async/case-documents/:docketNumber/paper-filing',
    lambdaWrapper(addPaperFilingLambda, { isAsync: true }),
  );
  app.post(
    '/case-documents/:docketNumber/court-issued-docket-entry',
    lambdaWrapper(fileCourtIssuedDocketEntryLambda),
  );
  app.post(
    '/async/case-documents/:subjectCaseDocketNumber/file-and-serve-court-issued-docket-entry',
    lambdaWrapper(fileAndServeCourtIssuedDocumentLambda, { isAsync: true }),
  );
  app.post(
    '/case-documents/:docketNumber/correspondence',
    lambdaWrapper(fileCorrespondenceDocumentLambda),
  );
  app.post(
    '/case-documents/:docketNumber/court-issued-order',
    lambdaWrapper(fileCourtIssuedOrderToCaseLambda),
  );

  // PUT
  app.put(
    '/case-documents/:docketNumber/court-issued-orders/:docketEntryId',
    lambdaWrapper(updateCourtIssuedOrderToCaseLambda),
  );
  app.put(
    '/case-documents/:docketNumber/paper-filing',
    lambdaWrapper(editPaperFilingLambda),
  );
  app.put(
    '/case-documents/:docketNumber/docket-entry-meta',
    lambdaWrapper(updateDocketEntryMetaLambda),
  );
  app.put(
    '/case-documents/:docketNumber/docket-entry-complete',
    lambdaWrapper(completeDocketEntryQCLambda),
  );
  app.put(
    '/case-documents/:docketNumber/court-issued-docket-entry',
    lambdaWrapper(updateCourtIssuedDocketEntryLambda),
  );
  app.put(
    '/case-documents/:docketNumber/correspondence/:correspondenceId',
    lambdaWrapper(updateCorrespondenceDocumentLambda),
  );
  app.put(
    '/case-documents/:docketNumber/:docketEntryId',
    lambdaWrapper(archiveDraftDocumentLambda),
  );
  app.put(
    '/case-documents/:docketNumber/:docketEntryId/strike',
    lambdaWrapper(strikeDocketEntryLambda),
  );
  app.put(
    '/case-documents/:docketNumber/:docketEntryId/seal',
    lambdaWrapper(sealDocketEntryLambda),
  );
  app.put(
    '/case-documents/:docketNumber/:docketEntryId/unseal',
    lambdaWrapper(unsealDocketEntryLambda),
  );

  // DELETE
  app.delete(
    '/case-documents/:docketNumber/correspondence/:correspondenceId',
    lambdaWrapper(archiveCorrespondenceDocumentLambda),
  );
}
/**
 * case-meta
 */
{
  app.put(
    '/case-meta/:docketNumber/update-case-trial-sort-tags',
    lambdaWrapper(updateCaseTrialSortTagsLambda),
  );
  app.post(
    '/case-meta/:docketNumber/block',
    lambdaWrapper(blockCaseFromTrialLambda),
  );
  app.delete(
    '/case-meta/:docketNumber/block',
    lambdaWrapper(unblockCaseFromTrialLambda),
  );
  app.post(
    '/case-meta/:docketNumber/high-priority',
    lambdaWrapper(prioritizeCaseLambda),
  );
  app.delete(
    '/case-meta/:docketNumber/high-priority',
    lambdaWrapper(unprioritizeCaseLambda),
  );
  app.put(
    '/case-meta/:docketNumber/case-context',
    lambdaWrapper(updateCaseContextLambda),
  );
  app.put(
    '/case-meta/:docketNumber/consolidate-case',
    lambdaWrapper(addConsolidatedCaseLambda),
  );
  app.delete(
    '/case-meta/:docketNumber/consolidate-case',
    lambdaWrapper(removeConsolidatedCasesLambda),
  );
  app.put(
    '/case-meta/:docketNumber/qc-complete',
    lambdaWrapper(updateQcCompleteForTrialLambda),
  );
  app.put('/case-meta/:docketNumber/seal', lambdaWrapper(sealCaseLambda));
  app.put('/case-meta/:docketNumber/unseal', lambdaWrapper(unsealCaseLambda));
  app.put(
    '/case-meta/:docketNumber/seal-address/:contactId',
    lambdaWrapper(sealCaseContactAddressLambda),
  );
  app.post(
    '/case-meta/:docketNumber/other-statistics',
    lambdaWrapper(updateOtherStatisticsLambda),
  );
  app.put(
    '/case-meta/:docketNumber/statistics/:statisticId',
    lambdaWrapper(updateDeficiencyStatisticLambda),
  );
  app.delete(
    '/case-meta/:docketNumber/statistics/:statisticId',
    lambdaWrapper(deleteDeficiencyStatisticLambda),
  );
  app.post(
    '/case-meta/:docketNumber/statistics',
    lambdaWrapper(addDeficiencyStatisticLambda),
  );
  app.post(
    '/case-meta/:docketNumber/add-petitioner',
    lambdaWrapper(addPetitionerToCaseLambda),
  );
  app.put(
    '/case-meta/:docketNumber/remove-petitioner/:contactId',
    lambdaWrapper(removePetitionerAndUpdateCaptionLambda),
  );
}
/**
 * case-notes
 */
{
  app.post(
    '/case-notes/batch-cases/user-notes',
    lambdaWrapper(getUserCaseNoteForCasesLambda),
  );
  app.get(
    '/case-notes/:docketNumber/user-notes',
    lambdaWrapper(getUserCaseNoteLambda),
  );
  app.put(
    '/case-notes/:docketNumber/user-notes',
    lambdaWrapper(updateUserCaseNoteLambda),
  );
  app.delete(
    '/case-notes/:docketNumber/user-notes',
    lambdaWrapper(deleteUserCaseNoteLambda),
  );
  app.delete('/case-notes/:docketNumber', lambdaWrapper(deleteCaseNoteLambda));
  app.put('/case-notes/:docketNumber', lambdaWrapper(saveCaseNoteLambda));
}
/**
 * case-parties
 */
{
  app.put(
    '/case-parties/:docketNumber/contact',
    lambdaWrapper(updateContactLambda),
  );
  app.post(
    '/case-parties/:docketNumber/associate-private-practitioner',
    lambdaWrapper(associatePrivatePractitionerWithCaseLambda),
  );
  app.post(
    '/case-parties/:docketNumber/associate-irs-practitioner',
    lambdaWrapper(associateIrsPractitionerWithCaseLambda),
  );
  app.put(
    '/case-parties/:docketNumber/counsel/:userId',
    lambdaWrapper(updateCounselOnCaseLambda),
  );
  app.delete(
    '/case-parties/:docketNumber/counsel/:userId',
    lambdaWrapper(deleteCounselFromCaseLambda),
  );
  app.put(
    '/case-parties/:docketNumber/case-details',
    lambdaWrapper(updateCaseDetailsLambda),
  );
  app.put(
    '/case-parties/:docketNumber/petitioner-info',
    lambdaWrapper(updatePetitionerInformationLambda),
  );
}
/**
 * cases
 */
{
  app.get('/cases', lambdaWrapper(getCasesForUserLambda));
  app.get('/cases/search', lambdaWrapper(caseAdvancedSearchLambda));
  app.post('/cases/paper', lambdaWrapper(createCaseFromPaperLambda));
  app.delete(
    '/cases/:docketNumber/remove-pending/:docketEntryId',
    lambdaWrapper(removeCasePendingItemLambda),
  );
  app.get(
    '/cases/:docketNumber/consolidated-cases',
    lambdaWrapper(getConsolidatedCasesByCaseLambda),
  );
  app.post(
    '/cases/:docketNumber/serve-to-irs',
    lambdaWrapper(serveCaseToIrsLambda),
  );
  app.put(
    '/cases/:docketNumber',
    lambdaWrapper(saveCaseDetailInternalEditLambda),
  );
  app.head('/cases/:docketNumber', lambdaWrapper(getCaseExistsLambda));
  app.get('/cases/:docketNumber', lambdaWrapper(getCaseLambda));
  app.post('/cases', lambdaWrapper(createCaseLambda));
}
/**
 * documents
 */
{
  app.post('/documents/:key/validate', lambdaWrapper(validatePdfLambda));
  app.get(
    '/documents/:key/upload-policy',
    lambdaWrapper(getUploadPolicyLambda),
  );
  app.post(
    '/documents/filing-receipt-pdf',
    lambdaWrapper(generatePrintableFilingReceiptLambda),
  );
}

app.get(
  '/documents/:key/virus-scan',
  lambdaWrapper(getStatusOfVirusScanLambda),
);

/**
 * messages
 */
{
  app.post(
    '/messages/:parentMessageId/reply',
    lambdaWrapper(replyToMessageLambda),
  );
  app.post(
    '/messages/:parentMessageId/forward',
    lambdaWrapper(forwardMessageLambda),
  );
  app.post(
    '/messages/:parentMessageId/complete',
    lambdaWrapper(completeMessageLambda),
  );
  app.post('/messages/:messageId/read', lambdaWrapper(setMessageAsReadLambda));
  app.get('/messages/:parentMessageId', lambdaWrapper(getMessageThreadLambda));
  app.get(
    '/messages/case/:docketNumber',
    lambdaWrapper(getMessagesForCaseLambda),
  );
  app.get(
    '/messages/inbox/section/:section',
    lambdaWrapper(getInboxMessagesForSectionLambda),
  );
  app.get(
    '/messages/inbox/:userId',
    lambdaWrapper(getInboxMessagesForUserLambda),
  );
  app.get(
    '/messages/outbox/section/:section',
    lambdaWrapper(getOutboxMessagesForSectionLambda),
  );
  app.get(
    '/messages/outbox/:userId',
    lambdaWrapper(getOutboxMessagesForUserLambda),
  );
  app.get(
    '/messages/completed/section/:section',
    lambdaWrapper(getCompletedMessagesForSectionLambda),
  );
  app.get(
    '/messages/completed/:userId',
    lambdaWrapper(getCompletedMessagesForUserLambda),
  );
  app.post('/messages', lambdaWrapper(createMessageLambda));
}

/**
 * practitioners
 */
{
  app.get(
    '/practitioners/:barNumber',
    lambdaWrapper(getPractitionerByBarNumberLambda),
  );
  app.get(
    '/practitioners/:barNumber/documents',
    lambdaWrapper(getPractitionerDocumentsLambda),
  );
  app.post(
    '/practitioners/:barNumber/documents',
    lambdaWrapper(createPractitionerDocumentLambda),
  );
  app.put(
    '/practitioners/:barNumber/documents',
    lambdaWrapper(editPractitionerDocumentLambda),
  );
  app.get(
    '/practitioner-documents/:barNumber/:practitionerDocumentFileId/document-download-url',
    lambdaWrapper(getPractitionerDocumentDownloadUrlLambda),
  );
  app.get(
    '/practitioner-documents/:barNumber/:practitionerDocumentFileId',
    lambdaWrapper(getPractitionerDocumentLambda),
  );
  app.delete(
    '/practitioner-documents/:barNumber/documents/:practitionerDocumentFileId',
    lambdaWrapper(deletePractitionerDocumentLambda),
  );
  app.put(
    '/async/practitioners/:barNumber',
    lambdaWrapper(updatePractitionerUserLambda, { isAsync: true }),
  );
  app.get(
    '/practitioners/:userId/printable-case-list',
    lambdaWrapper(generatePractitionerCaseListPdfLambda),
  );
  app.get('/practitioners', lambdaWrapper(getPractitionersByNameLambda));
  app.post('/practitioners', lambdaWrapper(createPractitionerUserLambda));
}

/**
 * reports
 */
{
  app.get(
    '/reports/blocked/:trialLocation',
    lambdaWrapper(getBlockedCasesLambda),
  );
  app.get(
    '/reports/case-inventory-report',
    lambdaWrapper(getCaseInventoryReportLambda),
  );
  app.get(
    '/reports/printable-case-inventory-report',
    lambdaWrapper(generatePrintableCaseInventoryReportLambda),
  );
  app.get('/reports/pending-items', lambdaWrapper(fetchPendingItemsLambda));
  app.get(
    '/reports/pending-report',
    lambdaWrapper(generatePrintablePendingReportLambda),
  );
  app.post(
    '/reports/trial-calendar-pdf',
    lambdaWrapper(generateTrialCalendarPdfLambda),
  );
  app.post(
    '/reports/planning-report',
    lambdaWrapper(runTrialSessionPlanningReportLambda),
  );
}

/**
 * sections
 */
app.get(
  '/sections/:section/document-qc/served',
  lambdaWrapper(getDocumentQCServedForSectionLambda),
);
app.get('/sections/:section/users', lambdaWrapper(getUsersInSectionLambda));
app.get(
  '/sections/:section/document-qc/inbox',
  lambdaWrapper(getDocumentQCInboxForSectionLambda),
);
app.get('/sections/:section/judge', lambdaWrapper(getJudgeInSectionLambda));

/**
 * trial-sessions
 */
{
  app.post(
    '/async/trial-sessions/:trialSessionId/generate-notices',
    lambdaWrapper(setNoticesForCalendaredTrialSessionLambda, { isAsync: true }),
  );
  app.post(
    '/trial-sessions/:trialSessionId/set-swing-session',
    lambdaWrapper(setTrialSessionAsSwingSessionLambda),
  );
  app.get(
    '/trial-sessions/:trialSessionId/eligible-cases',
    lambdaWrapper(getEligibleCasesForTrialSessionLambda),
  );
  app.post(
    '/trial-sessions/:trialSessionId/set-calendar',
    lambdaWrapper(setTrialSessionCalendarLambda),
  );
  app.get(
    '/trial-sessions/:trialSessionId/get-calendared-cases',
    lambdaWrapper(getCalendaredCasesForTrialSessionLambda),
  );
  app.get(
    '/trial-sessions/:trialSessionId/working-copy',
    lambdaWrapper(getTrialSessionWorkingCopyLambda),
  );
  app.put(
    '/trial-sessions/:trialSessionId/working-copy',
    lambdaWrapper(updateTrialSessionWorkingCopyLambda),
  );
  app.get(
    '/async/trial-sessions/:trialSessionId/batch-download',
    lambdaWrapper(batchDownloadTrialSessionLambda, { isAsync: true }),
  );
  app.put(
    '/trial-sessions/:trialSessionId/remove-case/:docketNumber',
    lambdaWrapper(removeCaseFromTrialLambda),
  );
  app.post(
    '/trial-sessions/:trialSessionId/cases/:docketNumber',
    lambdaWrapper(addCaseToTrialSessionLambda),
  );
  app.put(
    '/trial-sessions/:trialSessionId/set-calendar-note',
    lambdaWrapper(saveCalendarNoteLambda),
  );
  app.get(
    '/trial-sessions/:trialSessionId',
    lambdaWrapper(getTrialSessionDetailsLambda),
  );
  app.delete(
    '/trial-sessions/:trialSessionId',
    lambdaWrapper(deleteTrialSessionLambda),
  );
  app.get('/trial-sessions', lambdaWrapper(getTrialSessionsLambda));
  app.post(
    '/trial-sessions/:trialSessionId/printable-working-copy',
    lambdaWrapper(getGeneratePrintableTrialSessionCopyReportLambda),
  );
  app.post('/trial-sessions', lambdaWrapper(createTrialSessionLambda));
  app.put(
    '/async/trial-sessions',
    lambdaWrapper(updateTrialSessionLambda, { isAsync: true }),
  );
  app.post(
    '/trial-sessions/:trialSessionId/set-hearing/:docketNumber',
    lambdaWrapper(setForHearingLambda),
  );
  app.post(
    '/trial-sessions/:trialSessionId/close',
    lambdaWrapper(closeTrialSessionLambda),
  );
  app.get(
    '/judges/:judgeId/trial-sessions',
    lambdaWrapper(getTrialSessionsForJudgeLambda),
  );
}

/**
 * users
 */
app.get('/users/internal', lambdaWrapper(getInternalUsersLambda));
app.put(
  '/users/:userId/case/:docketNumber',
  lambdaWrapper(privatePractitionerCaseAssociationLambda),
);
app.get(
  '/users/:userId/case/:docketNumber/pending',
  lambdaWrapper(verifyPendingCaseForUserLambda),
);
app.put(
  '/users/:userId/case/:docketNumber/pending',
  lambdaWrapper(privatePractitionerPendingCaseAssociationLambda),
);
app.get(
  '/users/:userId/document-qc/inbox',
  lambdaWrapper(getDocumentQCInboxForUserLambda),
);
app.get(
  '/users/:userId/document-qc/served',
  lambdaWrapper(getDocumentQCServedForUserLambda),
);
app.put(
  '/async/users/:userId/contact-info',
  lambdaWrapper(updateUserContactInformationLambda, { isAsync: true }),
);
app.get(
  '/users/:userId/pending-email',
  lambdaWrapper(getUserPendingEmailLambda),
);
app.get('/users/pending-email', lambdaWrapper(getUsersPendingEmailLambda));
app.get(
  '/users/:userId/pending-email-status',
  lambdaWrapper(getUserPendingEmailStatusLambda),
);
app.put('/users/pending-email', lambdaWrapper(updateUserPendingEmailLambda));
app.put(
  '/async/users/verify-email',
  lambdaWrapper(verifyUserPendingEmailLambda, { isAsync: true }),
);
app.get(
  '/users/email-availability',
  lambdaWrapper(checkEmailAvailabilityLambda),
);
app.get(
  '/users/privatePractitioners/search',
  lambdaWrapper(getPrivatePractitionersBySearchKeyLambda),
);
app.get(
  '/users/irsPractitioners/search',
  lambdaWrapper(getIrsPractitionersBySearchKeyLambda),
);
app.get('/users/:userId', lambdaWrapper(getUserByIdLambda));
app.get('/users', lambdaWrapper(getUserLambda));
app.post('/users', lambdaWrapper(createUserLambda));

/**
 * v1 API
 */
app.get('/v1/cases/:docketNumber', lambdaWrapper(v1GetCaseLambda));
app.get(
  '/v1/cases/:docketNumber/entries/:key/document-download-url',
  lambdaWrapper(v1GetDocumentDownloadUrlLambda),
);

/**
 * v2 API
 */
app.get('/v2/cases/:docketNumber', lambdaWrapper(v2GetCaseLambda));
app.get(
  '/v2/cases/:docketNumber/entries/:key/document-download-url',
  lambdaWrapper(v2GetDocumentDownloadUrlLambda),
);
app.get(
  '/v2/reconciliation-report/:reconciliationDate',
  lambdaWrapper(v2GetReconciliationReportLambda),
);

/**
 * work-items
 */
{
  app.put(
    '/work-items/:workItemId/complete',
    lambdaWrapper(completeWorkItemLambda),
  );
  app.post(
    '/work-items/:workItemId/read',
    lambdaWrapper(setWorkItemAsReadLambda),
  );
  app.get('/work-items/:workItemId', lambdaWrapper(getWorkItemLambda));
  app.put('/work-items', lambdaWrapper(assignWorkItemsLambda));
}

/**
 * maintenance-mode
 */
app.get('/maintenance-mode', lambdaWrapper(getMaintenanceModeLambda));

/**
 * feature-flag
 */
app.get('/feature-flag/:featureFlag', lambdaWrapper(getFeatureFlagValueLambda));

/**
 * Authentication/Authorization
 */
app
  .route('/auth/login')
  .post(lambdaWrapper(authenticateUserLambda))
  .delete(lambdaWrapper(deleteAuthCookieLambda));
app.post('/auth/refresh', lambdaWrapper(refreshAuthTokenLambda));

// This endpoint is used for testing purpose only which exposes the
// CRON lambda which runs nightly to update cases to be ready for trial.
if (process.env.IS_LOCAL) {
  app.get(
    '/run-check-ready-for-trial',
    lambdaWrapper(checkForReadyForTrialCasesLambda),
  );
}

exports.app = app;
