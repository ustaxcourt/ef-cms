/* eslint-disable max-lines */
import { addCaseToTrialSessionLambda } from './lambdas/trialSessions/addCaseToTrialSessionLambda';
import { addConsolidatedCaseLambda } from './lambdas/cases/addConsolidatedCaseLambda';
import { addCoversheetLambda } from './lambdas/documents/addCoversheetLambda';
import { addDeficiencyStatisticLambda } from './lambdas/cases/addDeficiencyStatisticLambda';
import { addPaperFilingLambda } from './lambdas/documents/addPaperFilingLambda';
import { addPetitionerToCaseLambda } from './lambdas/cases/addPetitionerToCaseLambda';
import { advancedQueryLimiter } from './middleware/advancedQueryLimiter';
import { appendAmendedPetitionFormLambda } from './lambdas/courtIssuedOrder/appendAmendedPetitionFormLambda';
import { archiveCorrespondenceDocumentLambda } from './lambdas/correspondence/archiveCorrespondenceDocumentLambda';
import { archiveDraftDocumentLambda } from './lambdas/documents/archiveDraftDocumentLambda';
import { assignWorkItemsLambda } from './lambdas/workitems/assignWorkItemsLambda';
import { associateIrsPractitionerWithCaseLambda } from './lambdas/manualAssociation/associateIrsPractitionerWithCaseLambda';
import { associatePrivatePractitionerWithCaseLambda } from './lambdas/manualAssociation/associatePrivatePractitionerWithCaseLambda';
import { batchDownloadDocketEntriesLambda } from '@web-api/lambdas/documents/batchDownloadDocketEntriesLambda';
import { batchDownloadTrialSessionLambda } from './lambdas/trialSessions/batchDownloadTrialSessionLambda';
import { blockCaseFromTrialLambda } from './lambdas/cases/blockCaseFromTrialLambda';
import { caseAdvancedSearchLambda } from './lambdas/cases/caseAdvancedSearchLambda';
import { changePasswordLambda } from '@web-api/lambdas/auth/changePasswordLambda';
import { checkEmailAvailabilityLambda } from './lambdas/users/checkEmailAvailabilityLambda';
import { checkForReadyForTrialCasesLambda } from './lambdas/cases/checkForReadyForTrialCasesLambda';
import { closeTrialSessionLambda } from './lambdas/trialSessions/closeTrialSessionLambda';
import { completeDocketEntryQCLambda } from './lambdas/documents/completeDocketEntryQCLambda';
import { completeMessageLambda } from './lambdas/messages/completeMessageLambda';
import { completeWorkItemLambda } from './lambdas/workitems/completeWorkItemLambda';
import { confirmSignUpLambda } from './lambdas/auth/confirmSignUpLambda';
import { createApplicationContext } from './applicationContext';
import { createCaseDeadlineLambda } from './lambdas/caseDeadline/createCaseDeadlineLambda';
import { createCaseFromPaperLambda } from './lambdas/cases/createCaseFromPaperLambda';
import { createCaseLambda } from './lambdas/cases/createCaseLambda';
import { createCourtIssuedOrderPdfFromHtmlLambda } from './lambdas/courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlLambda';
import { createCsvCustomCaseReportFileLambda } from '@web-api/lambdas/reports/createCsvCustomCaseReportFileLambda';
import { createMessageLambda } from './lambdas/messages/createMessageLambda';
import { createPractitionerDocumentLambda } from './lambdas/practitioners/createPractitionerDocumentLambda';
import { createPractitionerUserLambda } from './lambdas/practitioners/createPractitionerUserLambda';
import { createTrialSessionLambda } from './lambdas/trialSessions/createTrialSessionLambda';
import { deleteAuthCookieLambda } from './lambdas/auth/deleteAuthCookieLambda';
import { deleteCaseDeadlineLambda } from './lambdas/caseDeadline/deleteCaseDeadlineLambda';
import { deleteCaseNoteLambda } from './lambdas/caseNote/deleteCaseNoteLambda';
import { deleteCounselFromCaseLambda } from './lambdas/cases/deleteCounselFromCaseLambda';
import { deleteDeficiencyStatisticLambda } from './lambdas/cases/deleteDeficiencyStatisticLambda';
import { deleteDocketEntryWorksheetLambda } from '@web-api/lambdas/pendingMotion/deleteDocketEntryWorksheetLambda';
import { deletePractitionerDocumentLambda } from './lambdas/practitioners/deletePractitionerDocumentLambda';
import { deleteTrialSessionLambda } from './lambdas/trialSessions/deleteTrialSessionLambda';
import { deleteUserCaseNoteLambda } from './lambdas/caseNote/deleteUserCaseNoteLambda';
import { dismissNOTTReminderForTrialLambda } from './lambdas/trialSessions/dismissNOTTReminderForTrialLambda';
import { downloadPolicyUrlLambda } from './lambdas/documents/downloadPolicyUrlLambda';
import { editPaperFilingLambda } from './lambdas/documents/editPaperFilingLambda';
import { editPractitionerDocumentLambda } from './lambdas/practitioners/editPractitionerDocumentLambda';
import { exportPendingReportLambda } from '@web-api/lambdas/pendingItems/exportPendingReportLambda';
import { fetchPendingItemsLambda } from './lambdas/pendingItems/fetchPendingItemsLambda';
import { fileAndServeCourtIssuedDocumentLambda } from './lambdas/cases/fileAndServeCourtIssuedDocumentLambda';
import { fileCorrespondenceDocumentLambda } from './lambdas/correspondence/fileCorrespondenceDocumentLambda';
import { fileCourtIssuedDocketEntryLambda } from './lambdas/documents/fileCourtIssuedDocketEntryLambda';
import { fileCourtIssuedOrderToCaseLambda } from './lambdas/documents/fileCourtIssuedOrderToCaseLambda';
import { fileExternalDocumentToCaseLambda } from './lambdas/documents/fileExternalDocumentToCaseLambda';
import { forgotPasswordLambda } from '@web-api/lambdas/auth/forgotPasswordLambda';
import { forwardMessageLambda } from './lambdas/messages/forwardMessageLambda';
import { generateDocketRecordPdfLambda } from './lambdas/cases/generateDocketRecordPdfLambda';
import { generateDraftStampOrderLambda } from './lambdas/documents/generateDraftStampOrderLambda';
import { generateEntryOfAppearancePdfLambda } from '@web-api/lambdas/caseAssociations/generateEntryOfAppearancePdfLambda';
import { generatePractitionerCaseListPdfLambda } from './lambdas/cases/generatePractitionerCaseListPdfLambda';
import { generatePrintableCaseInventoryReportLambda } from './lambdas/reports/generatePrintableCaseInventoryReportLambda';
import { generatePrintableFilingReceiptLambda } from './lambdas/documents/generatePrintableFilingReceiptLambda';
import { generatePrintablePendingReportLambda } from './lambdas/pendingItems/generatePrintablePendingReportLambda';
import { generateTrialCalendarPdfLambda } from './lambdas/trialSessions/generateTrialCalendarPdfLambda';
import { getAllFeatureFlagsLambda } from './lambdas/featureFlag/getAllFeatureFlagsLambda';
import { getAllUsersByRoleLambda } from '@web-api/lambdas/users/getAllUsersByRoleLambda';
import { getBlockedCasesLambda } from './lambdas/reports/getBlockedCasesLambda';
import { getCalendaredCasesForTrialSessionLambda } from './lambdas/trialSessions/getCalendaredCasesForTrialSessionLambda';
import { getCaseDeadlinesForCaseLambda } from './lambdas/caseDeadline/getCaseDeadlinesForCaseLambda';
import { getCaseDeadlinesLambda } from './lambdas/caseDeadline/getCaseDeadlinesLambda';
import { getCaseExistsLambda } from './lambdas/cases/getCaseExistsLambda';
import { getCaseInventoryReportLambda } from './lambdas/reports/getCaseInventoryReportLambda';
import { getCaseLambda } from './lambdas/cases/getCaseLambda';
import { getCaseWorksheetsByJudgeLambda } from './lambdas/reports/getCaseWorksheetsByJudgeLambda';
import { getCasesClosedByJudgeLambda } from './lambdas/reports/getCasesClosedByJudgeLambda';
import { getCasesForUserLambda } from './lambdas/cases/getCasesForUserLambda';
import { getCompletedMessagesForSectionLambda } from './lambdas/messages/getCompletedMessagesForSectionLambda';
import { getCompletedMessagesForUserLambda } from './lambdas/messages/getCompletedMessagesForUserLambda';
import { getCountOfCaseDocumentsFiledByJudgesLambda } from '@web-api/lambdas/reports/getCountOfCaseDocumentsFiledByJudgesLambda';
import { getCurrentInvoke } from '@vendia/serverless-express';
import { getCustomCaseReportLambda } from './lambdas/reports/getCustomCaseReportLambda';
import { getDocumentContentsForDocketEntryLambda } from './lambdas/documents/getDocumentContentsForDocketEntryLambda';
import { getDocumentDownloadUrlLambda } from './lambdas/documents/getDocumentDownloadUrlLambda';
import { getDocumentQCInboxForSectionLambda } from './lambdas/workitems/getDocumentQCInboxForSectionLambda';
import { getDocumentQCInboxForUserLambda } from './lambdas/workitems/getDocumentQCInboxForUserLambda';
import { getDocumentQCServedForSectionLambda } from './lambdas/workitems/getDocumentQCServedForSectionLambda';
import { getDocumentQCServedForUserLambda } from './lambdas/workitems/getDocumentQCServedForUserLambda';
import { getEligibleCasesForTrialSessionLambda } from './lambdas/trialSessions/getEligibleCasesForTrialSessionLambda';
import { getGeneratePrintableTrialSessionCopyReportLambda } from './lambdas/trialSessions/getGeneratePrintableTrialSessionCopyReportLambda';
import { getInboxMessagesForSectionLambda } from './lambdas/messages/getInboxMessagesForSectionLambda';
import { getInboxMessagesForUserLambda } from './lambdas/messages/getInboxMessagesForUserLambda';
import { getInternalUsersLambda } from './lambdas/users/getInternalUsersLambda';
import { getIrsPractitionersBySearchKeyLambda } from './lambdas/users/getIrsPractitionersBySearchKeyLambda';
import { getJudgeInSectionLambda } from './lambdas/users/getJudgeInSectionLambda';
import { getMaintenanceModeLambda } from './lambdas/maintenance/getMaintenanceModeLambda';
import { getMessageThreadLambda } from './lambdas/messages/getMessageThreadLambda';
import { getMessagesForCaseLambda } from './lambdas/messages/getMessagesForCaseLambda';
import { getNotificationsLambda } from './lambdas/users/getNotificationsLambda';
import { getOutboxMessagesForSectionLambda } from './lambdas/messages/getOutboxMessagesForSectionLambda';
import { getOutboxMessagesForUserLambda } from './lambdas/messages/getOutboxMessagesForUserLambda';
import { getPaperServicePdfUrlLambda } from '@web-api/lambdas/trialSessions/getPaperServicePdfUrlLambda';
import { getPendingMotionDocketEntriesForCurrentJudgeLambda } from '@web-api/lambdas/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeLambda';
import { getPractitionerByBarNumberLambda } from './lambdas/practitioners/getPractitionerByBarNumberLambda';
import { getPractitionerDocumentDownloadUrlLambda } from './lambdas/practitioners/getPractitionerDocumentDownloadUrlLambda';
import { getPractitionerDocumentLambda } from './lambdas/practitioners/getPractitionerDocumentLambda';
import { getPractitionerDocumentsLambda } from './lambdas/practitioners/getPractitionerDocumentsLambda';
import { getPractitionersByNameLambda } from './lambdas/practitioners/getPractitionersByNameLambda';
import { getPrivatePractitionersBySearchKeyLambda } from './lambdas/users/getPrivatePractitionersBySearchKeyLambda';
import { getStatusOfVirusScanLambda } from './lambdas/documents/getStatusOfVirusScanLambda';
import { getTrialSessionDetailsLambda } from './lambdas/trialSessions/getTrialSessionDetailsLambda';
import { getTrialSessionWorkingCopyLambda } from './lambdas/trialSessions/getTrialSessionWorkingCopyLambda';
import { getTrialSessionsForJudgeActivityReportLambda } from './lambdas/reports/getTrialSessionsForJudgeActivityReportLambda';
import { getTrialSessionsForJudgeLambda } from './lambdas/trialSessions/getTrialSessionsForJudgeLambda';
import { getTrialSessionsLambda } from './lambdas/trialSessions/getTrialSessionsLambda';
import { getUploadPolicyLambda } from './lambdas/documents/getUploadPolicyLambda';
import { getUserCaseNoteForCasesLambda } from './lambdas/caseNote/getUserCaseNoteForCasesLambda';
import { getUserCaseNoteLambda } from './lambdas/caseNote/getUserCaseNoteLambda';
import { getUserLambda } from './lambdas/users/getUserLambda';
import { getUserPendingEmailLambda } from './lambdas/users/getUserPendingEmailLambda';
import { getUserPendingEmailStatusLambda } from './lambdas/users/getUserPendingEmailStatusLambda';
import { getUsersInSectionLambda } from './lambdas/users/getUsersInSectionLambda';
import { getUsersPendingEmailLambda } from './lambdas/users/getUsersPendingEmailLambda';
import { getWorkItemLambda } from './lambdas/workitems/getWorkItemLambda';
import { ipLimiter } from './middleware/ipLimiter';
import { lambdaWrapper } from './lambdaWrapper';
import { logOldLoginAttemptLambda } from '@web-api/lambdas/auth/oldLoginAttemptLambda';
import { logger } from './logger';
import { loginLambda } from '@web-api/lambdas/auth/loginLambda';
import { opinionAdvancedSearchLambda } from './lambdas/documents/opinionAdvancedSearchLambda';
import { orderAdvancedSearchLambda } from './lambdas/documents/orderAdvancedSearchLambda';
import { prioritizeCaseLambda } from './lambdas/cases/prioritizeCaseLambda';
import { privatePractitionerCaseAssociationLambda } from './lambdas/cases/privatePractitionerCaseAssociationLambda';
import { privatePractitionerPendingCaseAssociationLambda } from './lambdas/cases/privatePractitionerPendingCaseAssociationLambda';
import { removeCaseFromTrialLambda } from './lambdas/trialSessions/removeCaseFromTrialLambda';
import { removeCasePendingItemLambda } from './lambdas/cases/removeCasePendingItemLambda';
import { removeConsolidatedCasesLambda } from './lambdas/cases/removeConsolidatedCasesLambda';
import { removePdfFromDocketEntryLambda } from './lambdas/documents/removePdfFromDocketEntryLambda';
import { removePetitionerAndUpdateCaptionLambda } from './lambdas/cases/removePetitionerAndUpdateCaptionLambda';
import { removeSignatureFromDocumentLambda } from './lambdas/documents/removeSignatureFromDocumentLambda';
import { renewIdTokenLambda } from './lambdas/auth/renewIdTokenLambda';
import { replyToMessageLambda } from './lambdas/messages/replyToMessageLambda';
import { runTrialSessionPlanningReportLambda } from './lambdas/trialSessions/runTrialSessionPlanningReportLambda';
import { saveCalendarNoteLambda } from './lambdas/trialSessions/saveCalendarNoteLambda';
import { saveCaseDetailInternalEditLambda } from './lambdas/cases/saveCaseDetailInternalEditLambda';
import { saveCaseNoteLambda } from './lambdas/caseNote/saveCaseNoteLambda';
import { saveSignedDocumentLambda } from './lambdas/documents/saveSignedDocumentLambda';
import { sealCaseContactAddressLambda } from './lambdas/cases/sealCaseContactAddressLambda';
import { sealCaseLambda } from './lambdas/cases/sealCaseLambda';
import { sealDocketEntryLambda } from './lambdas/documents/sealDocketEntryLambda';
import { serveCaseToIrsLambda } from './lambdas/cases/serveCaseToIrsLambda';
import { serveCourtIssuedDocumentLambda } from './lambdas/cases/serveCourtIssuedDocumentLambda';
import { serveExternallyFiledDocumentLambda } from './lambdas/documents/serveExternallyFiledDocumentLambda';
import { serveThirtyDayNoticeLambda } from './lambdas/trialSessions/serveThirtyDayNoticeLambda';
import { set } from 'lodash';
import { setForHearingLambda } from './lambdas/trialSessions/setForHearingLambda';
import { setMessageAsReadLambda } from './lambdas/messages/setMessageAsReadLambda';
import { setNoticesForCalendaredTrialSessionLambda } from './lambdas/trialSessions/setNoticesForCalendaredTrialSessionLambda';
import { setTrialSessionCalendarLambda } from './lambdas/trialSessions/setTrialSessionCalendarLambda';
import { setWorkItemAsReadLambda } from './lambdas/workitems/setWorkItemAsReadLambda';
import { signUpUserLambda } from '@web-api/users/signUpUserLambda';
import { strikeDocketEntryLambda } from './lambdas/documents/strikeDocketEntryLambda';
import { swaggerJsonLambda } from './lambdas/swagger/swaggerJsonLambda';
import { swaggerLambda } from './lambdas/swagger/swaggerLambda';
import { unblockCaseFromTrialLambda } from './lambdas/cases/unblockCaseFromTrialLambda';
import { unprioritizeCaseLambda } from './lambdas/cases/unprioritizeCaseLambda';
import { unsealCaseLambda } from './lambdas/cases/unsealCaseLambda';
import { unsealDocketEntryLambda } from './lambdas/documents/unsealDocketEntryLambda';
import { updateCaseContextLambda } from './lambdas/cases/updateCaseContextLambda';
import { updateCaseDeadlineLambda } from './lambdas/caseDeadline/updateCaseDeadlineLambda';
import { updateCaseDetailsLambda } from './lambdas/cases/updateCaseDetailsLambda';
import { updateCaseTrialSortTagsLambda } from './lambdas/cases/updateCaseTrialSortTagsLambda';
import { updateCaseWorksheetLambda } from '@web-api/lambdas/caseWorksheet/updateCaseWorksheetLambda';
import { updateContactLambda } from './lambdas/cases/updateContactLambda';
import { updateCorrespondenceDocumentLambda } from './lambdas/correspondence/updateCorrespondenceDocumentLambda';
import { updateCounselOnCaseLambda } from './lambdas/cases/updateCounselOnCaseLambda';
import { updateCourtIssuedDocketEntryLambda } from './lambdas/documents/updateCourtIssuedDocketEntryLambda';
import { updateCourtIssuedOrderToCaseLambda } from './lambdas/documents/updateCourtIssuedOrderToCaseLambda';
import { updateDeficiencyStatisticLambda } from './lambdas/cases/updateDeficiencyStatisticLambda';
import { updateDocketEntryMetaLambda } from './lambdas/documents/updateDocketEntryMetaLambda';
import { updateDocketEntryWorksheetLambda } from '@web-api/lambdas/pendingMotion/updateDocketEntryWorksheetLambda';
import { updateOtherStatisticsLambda } from './lambdas/cases/updateOtherStatisticsLambda';
import { updatePetitionerInformationLambda } from './lambdas/cases/updatePetitionerInformationLambda';
import { updatePractitionerUserLambda } from './lambdas/practitioners/updatePractitionerUserLambda';
import { updateQcCompleteForTrialLambda } from './lambdas/cases/updateQcCompleteForTrialLambda';
import { updateTrialSessionLambda } from './lambdas/trialSessions/updateTrialSessionLambda';
import { updateTrialSessionWorkingCopyLambda } from './lambdas/trialSessions/updateTrialSessionWorkingCopyLambda';
import { updateUserCaseNoteLambda } from './lambdas/caseNote/updateUserCaseNoteLambda';
import { updateUserContactInformationLambda } from './lambdas/users/updateUserContactInformationLambda';
import { updateUserPendingEmailLambda } from './lambdas/users/updateUserPendingEmailLambda';
import { userIdLimiter } from './middleware/userIdLimiter';
import { getCaseLambda as v1GetCaseLambda } from './lambdas/v1/getCaseLambda';
import { getDocumentDownloadUrlLambda as v1GetDocumentDownloadUrlLambda } from './lambdas/v1/getDocumentDownloadUrlLambda';
import { getCaseLambda as v2GetCaseLambda } from './lambdas/v2/getCaseLambda';
import { getDocumentDownloadUrlLambda as v2GetDocumentDownloadUrlLambda } from './lambdas/v2/getDocumentDownloadUrlLambda';
import { getReconciliationReportLambda as v2GetReconciliationReportLambda } from './lambdas/v2/getReconciliationReportLambda';
import { validatePdfLambda } from './lambdas/documents/validatePdfLambda';
import { verifyPendingCaseForUserLambda } from './lambdas/cases/verifyPendingCaseForUserLambda';
import { verifyUserPendingEmailLambda } from './lambdas/users/verifyUserPendingEmailLambda';
import cors from 'cors';
import express from 'express';

const applicationContext = createApplicationContext({});

export const app = express();

const allowAccessOriginFunction = (origin, callback) => {
  //Origin header wasn't provided
  if (!origin || origin === '') {
    callback(null, '*');
    return;
  }

  //if the backend is running locally or if an official deployed front-end called the backend, parrot out the Origin
  //this is required for the browser to support receiving and sending cookies
  if (
    applicationContext.environment.stage === 'local' ||
    origin.includes(process.env.EFCMS_DOMAIN)
  ) {
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
  app.get(
    '/case-documents/count',
    lambdaWrapper(getCountOfCaseDocumentsFiledByJudgesLambda),
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
  app.post(
    '/async/case-documents/batch-download',
    lambdaWrapper(batchDownloadDocketEntriesLambda, { isAsync: true }),
  );

  // PUT
  app.put(
    '/case-documents/:docketNumber/court-issued-orders/:docketEntryId',
    lambdaWrapper(updateCourtIssuedOrderToCaseLambda),
  );
  app.put(
    '/async/case-documents/:docketNumber/paper-filing',
    lambdaWrapper(editPaperFilingLambda, { isAsync: true }),
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
  app.post(
    '/async/cases/:docketNumber/serve-to-irs',
    lambdaWrapper(serveCaseToIrsLambda, { isAsync: true }),
  );
  app.put(
    '/cases/:docketNumber',
    lambdaWrapper(saveCaseDetailInternalEditLambda),
  );
  app.post(
    '/cases/:docketNumber/generate-entry-of-appearance',
    lambdaWrapper(generateEntryOfAppearancePdfLambda),
  );
  app.head('/cases/:docketNumber', lambdaWrapper(getCaseExistsLambda));
  app.get('/cases/:docketNumber', lambdaWrapper(getCaseLambda));
  app.post('/cases', lambdaWrapper(createCaseLambda));
  app.post(
    '/cases/:docketNumber/case-worksheet',
    lambdaWrapper(updateCaseWorksheetLambda),
  );
}
app.get(
  '/docket-entries/pending-motion',
  lambdaWrapper(getPendingMotionDocketEntriesForCurrentJudgeLambda),
);
app.post(
  '/docket-entry/:docketEntryId/worksheet',
  lambdaWrapper(updateDocketEntryWorksheetLambda),
);

app.delete(
  '/docket-entry/:docketEntryId/worksheet',
  lambdaWrapper(deleteDocketEntryWorksheetLambda),
);
/**
 * case-worksheets
 */
{
  app.get('/case-worksheets', lambdaWrapper(getCaseWorksheetsByJudgeLambda));
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
    '/reports/custom-case-report',
    lambdaWrapper(getCustomCaseReportLambda),
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
  app.get(
    '/reports/pending-report/export',
    lambdaWrapper(exportPendingReportLambda),
  );
  app.post(
    '/reports/trial-calendar-pdf',
    lambdaWrapper(generateTrialCalendarPdfLambda),
  );
  app.post(
    '/reports/planning-report',
    lambdaWrapper(runTrialSessionPlanningReportLambda),
  );
  app.post(
    '/judge-activity-report/closed-cases',
    lambdaWrapper(getCasesClosedByJudgeLambda),
  );
  app.post(
    '/async/export/reports/custom-case-report/csv',
    lambdaWrapper(createCsvCustomCaseReportFileLambda, { isAsync: true }),
  );
}

/**
 * sections
 */
{
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
}

/**
 * trial-sessions
 */
{
  app.get(
    '/trial-sessions/paper-service-pdf/:fileId',
    lambdaWrapper(getPaperServicePdfUrlLambda),
  );
  app.post(
    '/async/trial-sessions/:trialSessionId/generate-notices',
    lambdaWrapper(setNoticesForCalendaredTrialSessionLambda, { isAsync: true }),
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
  app.post(
    '/async/trial-sessions/serve-thirty-day-notice',
    lambdaWrapper(serveThirtyDayNoticeLambda, { isAsync: true }),
  );
  app.put(
    '/async/trial-sessions',
    lambdaWrapper(updateTrialSessionLambda, { isAsync: true }),
  );
  app.put(
    '/trial-sessions/dismiss-alert',
    lambdaWrapper(dismissNOTTReminderForTrialLambda),
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
  app.post(
    '/judge-activity-report/trial-sessions',
    lambdaWrapper(getTrialSessionsForJudgeActivityReportLambda),
  );
}

/**
 * users
 */
{
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
  app.put('/users/verify-email', lambdaWrapper(verifyUserPendingEmailLambda));
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
  app.get('/users-by-role', lambdaWrapper(getAllUsersByRoleLambda));
  app.get('/users', lambdaWrapper(getUserLambda));
}

/**
 * v1 API
 */
{
  app.get('/v1/cases/:docketNumber', lambdaWrapper(v1GetCaseLambda));
  app.get(
    '/v1/cases/:docketNumber/entries/:key/document-download-url',
    lambdaWrapper(v1GetDocumentDownloadUrlLambda),
  );
}

/**
 * v2 API
 */
{
  app.get('/v2/cases/:docketNumber', lambdaWrapper(v2GetCaseLambda));
  app.get(
    '/v2/cases/:docketNumber/entries/:key/document-download-url',
    lambdaWrapper(v2GetDocumentDownloadUrlLambda),
  );
  app.get(
    '/v2/reconciliation-report/:reconciliationDate',
    lambdaWrapper(v2GetReconciliationReportLambda),
  );
}

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
 * system
 */
{
  app.get('/system/maintenance-mode', lambdaWrapper(getMaintenanceModeLambda));
  app.get('/system/feature-flag', lambdaWrapper(getAllFeatureFlagsLambda));
  app.get('/system/metrics/old-login', lambdaWrapper(logOldLoginAttemptLambda));
}

/**
 * Authentication/Authorization
 */
{
  app
    .route('/auth/login')
    .delete(lambdaWrapper(deleteAuthCookieLambda))
    .post(lambdaWrapper(loginLambda));
  app.post('/auth/refresh', lambdaWrapper(renewIdTokenLambda));
  app.post('/auth/confirm-signup', lambdaWrapper(confirmSignUpLambda));
  app.post('/auth/account/create', lambdaWrapper(signUpUserLambda));
  app.post('/auth/change-password', lambdaWrapper(changePasswordLambda));
  app.post('/auth/forgot-password', lambdaWrapper(forgotPasswordLambda));
}

// This endpoint is used for testing purpose only which exposes the
// CRON lambda which runs nightly to update cases to be ready for trial.
if (applicationContext.environment.stage === 'local') {
  app.get(
    '/run-check-ready-for-trial',
    lambdaWrapper(checkForReadyForTrialCasesLambda),
  );
}
