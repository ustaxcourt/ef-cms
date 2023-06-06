/* eslint-disable max-lines */
import { addCaseToTrialSessionLambda } from './trialSessions/addCaseToTrialSessionLambda';
import { addConsolidatedCaseLambda } from './cases/addConsolidatedCaseLambda';
import { addCoversheetLambda } from './documents/addCoversheetLambda';
import { addDeficiencyStatisticLambda } from './cases/addDeficiencyStatisticLambda';
import { addPaperFilingLambda } from './documents/addPaperFilingLambda';
import { addPetitionerToCaseLambda } from './cases/addPetitionerToCaseLambda';
import { advancedQueryLimiter } from './middleware/advancedQueryLimiter';
import { appendAmendedPetitionFormLambda } from './courtIssuedOrder/appendAmendedPetitionFormLambda';
import { archiveCorrespondenceDocumentLambda } from './correspondence/archiveCorrespondenceDocumentLambda';
import { archiveDraftDocumentLambda } from './documents/archiveDraftDocumentLambda';
import { assignWorkItemsLambda } from './workitems/assignWorkItemsLambda';
import { associateIrsPractitionerWithCaseLambda } from './manualAssociation/associateIrsPractitionerWithCaseLambda';
import { associatePrivatePractitionerWithCaseLambda } from './manualAssociation/associatePrivatePractitionerWithCaseLambda';
import { authenticateUserLambda } from './auth/authenticateUserLambda';
import { batchDownloadTrialSessionLambda } from './trialSessions/batchDownloadTrialSessionLambda';
import { blockCaseFromTrialLambda } from './cases/blockCaseFromTrialLambda';
import { caseAdvancedSearchLambda } from './cases/caseAdvancedSearchLambda';
import { checkEmailAvailabilityLambda } from './users/checkEmailAvailabilityLambda';
import { checkForReadyForTrialCasesLambda } from './cases/checkForReadyForTrialCasesLambda';
import { closeTrialSessionLambda } from './trialSessions/closeTrialSessionLambda';
import { completeDocketEntryQCLambda } from './documents/completeDocketEntryQCLambda';
import { completeMessageLambda } from './messages/completeMessageLambda';
import { completeWorkItemLambda } from './workitems/completeWorkItemLambda';
import { createApplicationContext } from './applicationContext';
import { createCaseDeadlineLambda } from './caseDeadline/createCaseDeadlineLambda';
import { createCaseFromPaperLambda } from './cases/createCaseFromPaperLambda';
import { createCaseLambda } from './cases/createCaseLambda';
import { createCourtIssuedOrderPdfFromHtmlLambda } from './courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlLambda';
import { createMessageLambda } from './messages/createMessageLambda';
import { createPractitionerDocumentLambda } from './practitioners/createPractitionerDocumentLambda';
import { createPractitionerUserLambda } from './practitioners/createPractitionerUserLambda';
import { createTrialSessionLambda } from './trialSessions/createTrialSessionLambda';
import { createUserLambda } from './users/createUserLambda';
import { deleteAuthCookieLambda } from './auth/deleteAuthCookieLambda';
import { deleteCaseDeadlineLambda } from './caseDeadline/deleteCaseDeadlineLambda';
import { deleteCaseNoteLambda } from './caseNote/deleteCaseNoteLambda';
import { deleteCounselFromCaseLambda } from './cases/deleteCounselFromCaseLambda';
import { deleteDeficiencyStatisticLambda } from './cases/deleteDeficiencyStatisticLambda';
import { deletePractitionerDocumentLambda } from './practitioners/deletePractitionerDocumentLambda';
import { deleteTrialSessionLambda } from './trialSessions/deleteTrialSessionLambda';
import { deleteUserCaseNoteLambda } from './caseNote/deleteUserCaseNoteLambda';
import { dismissNOTTReminderForTrialLambda } from './trialSessions/dismissNOTTReminderForTrialLambda';
import { downloadPolicyUrlLambda } from './documents/downloadPolicyUrlLambda';
import { editPaperFilingLambda } from './documents/editPaperFilingLambda';
import { editPractitionerDocumentLambda } from './practitioners/editPractitionerDocumentLambda';
import { fetchPendingItemsLambda } from './pendingItems/fetchPendingItemsLambda';
import { fileAndServeCourtIssuedDocumentLambda } from './cases/fileAndServeCourtIssuedDocumentLambda';
import { fileCorrespondenceDocumentLambda } from './correspondence/fileCorrespondenceDocumentLambda';
import { fileCourtIssuedDocketEntryLambda } from './documents/fileCourtIssuedDocketEntryLambda';
import { fileCourtIssuedOrderToCaseLambda } from './documents/fileCourtIssuedOrderToCaseLambda';
import { fileExternalDocumentToCaseLambda } from './documents/fileExternalDocumentToCaseLambda';
import { forwardMessageLambda } from './messages/forwardMessageLambda';
import { generateDocketRecordPdfLambda } from './cases/generateDocketRecordPdfLambda';
import { generateDraftStampOrderLambda } from './documents/generateDraftStampOrderLambda';
import { generatePractitionerCaseListPdfLambda } from './cases/generatePractitionerCaseListPdfLambda';
import { generatePrintableCaseInventoryReportLambda } from './reports/generatePrintableCaseInventoryReportLambda';
import { generatePrintableFilingReceiptLambda } from './documents/generatePrintableFilingReceiptLambda';
import { generatePrintablePendingReportLambda } from './pendingItems/generatePrintablePendingReportLambda';
import { generateTrialCalendarPdfLambda } from './trialSessions/generateTrialCalendarPdfLambda';
import { generateTrialSessionPaperServicePdfLambda } from './trialSessions/generateTrialSessionPaperServicePdfLambda';
import { getBlockedCasesLambda } from './reports/getBlockedCasesLambda';
import { getCalendaredCasesForTrialSessionLambda } from './trialSessions/getCalendaredCasesForTrialSessionLambda';
import { getCaseDeadlinesForCaseLambda } from './caseDeadline/getCaseDeadlinesForCaseLambda';
import { getCaseDeadlinesLambda } from './caseDeadline/getCaseDeadlinesLambda';
import { getCaseExistsLambda } from './cases/getCaseExistsLambda';
import { getCaseInventoryReportLambda } from './reports/getCaseInventoryReportLambda';
import { getCaseLambda } from './cases/getCaseLambda';
import { getCasesForUserLambda } from './cases/getCasesForUserLambda';
import { getCompletedMessagesForSectionLambda } from './messages/getCompletedMessagesForSectionLambda';
import { getCompletedMessagesForUserLambda } from './messages/getCompletedMessagesForUserLambda';
import { getConsolidatedCasesByCaseLambda } from './cases/getConsolidatedCasesByCaseLambda';
import { getCurrentInvoke } from '@vendia/serverless-express';
import { getCustomCaseInventoryReportLambda } from './reports/getCustomCaseInventoryReportLambda';
import { getDocumentContentsForDocketEntryLambda } from './documents/getDocumentContentsForDocketEntryLambda';
import { getDocumentDownloadUrlLambda } from './documents/getDocumentDownloadUrlLambda';
import { getDocumentQCInboxForSectionLambda } from './workitems/getDocumentQCInboxForSectionLambda';
import { getDocumentQCInboxForUserLambda } from './workitems/getDocumentQCInboxForUserLambda';
import { getDocumentQCServedForSectionLambda } from './workitems/getDocumentQCServedForSectionLambda';
import { getDocumentQCServedForUserLambda } from './workitems/getDocumentQCServedForUserLambda';
import { getEligibleCasesForTrialSessionLambda } from './trialSessions/getEligibleCasesForTrialSessionLambda';
import { getFeatureFlagValueLambda } from './featureFlag/getFeatureFlagValueLambda';
import { getGeneratePrintableTrialSessionCopyReportLambda } from './trialSessions/getGeneratePrintableTrialSessionCopyReportLambda';
import { getInboxMessagesForSectionLambda } from './messages/getInboxMessagesForSectionLambda';
import { getInboxMessagesForUserLambda } from './messages/getInboxMessagesForUserLambda';
import { getInternalUsersLambda } from './users/getInternalUsersLambda';
import { getIrsPractitionersBySearchKeyLambda } from './users/getIrsPractitionersBySearchKeyLambda';
import { getJudgeInSectionLambda } from './users/getJudgeInSectionLambda';
import { getMaintenanceModeLambda } from './maintenance/getMaintenanceModeLambda';
import { getMessageThreadLambda } from './messages/getMessageThreadLambda';
import { getMessagesForCaseLambda } from './messages/getMessagesForCaseLambda';
import { getNotificationsLambda } from './users/getNotificationsLambda';
import { getOutboxMessagesForSectionLambda } from './messages/getOutboxMessagesForSectionLambda';
import { getOutboxMessagesForUserLambda } from './messages/getOutboxMessagesForUserLambda';
import { getPractitionerByBarNumberLambda } from './practitioners/getPractitionerByBarNumberLambda';
import { getPractitionerDocumentDownloadUrlLambda } from './practitioners/getPractitionerDocumentDownloadUrlLambda';
import { getPractitionerDocumentLambda } from './practitioners/getPractitionerDocumentLambda';
import { getPractitionerDocumentsLambda } from './practitioners/getPractitionerDocumentsLambda';
import { getPractitionersByNameLambda } from './practitioners/getPractitionersByNameLambda';
import { getPrivatePractitionersBySearchKeyLambda } from './users/getPrivatePractitionersBySearchKeyLambda';
import { getStatusOfVirusScanLambda } from './documents/getStatusOfVirusScanLambda';
import { getTrialSessionDetailsLambda } from './trialSessions/getTrialSessionDetailsLambda';
import { getTrialSessionWorkingCopyLambda } from './trialSessions/getTrialSessionWorkingCopyLambda';
import { getTrialSessionsForJudgeLambda } from './trialSessions/getTrialSessionsForJudgeLambda';
import { getTrialSessionsLambda } from './trialSessions/getTrialSessionsLambda';
import { getUploadPolicyLambda } from './documents/getUploadPolicyLambda';
import { getUserByIdLambda } from './users/getUserByIdLambda';
import { getUserCaseNoteForCasesLambda } from './caseNote/getUserCaseNoteForCasesLambda';
import { getUserCaseNoteLambda } from './caseNote/getUserCaseNoteLambda';
import { getUserLambda } from './users/getUserLambda';
import { getUserPendingEmailLambda } from './users/getUserPendingEmailLambda';
import { getUserPendingEmailStatusLambda } from './users/getUserPendingEmailStatusLambda';
import { getUsersInSectionLambda } from './users/getUsersInSectionLambda';
import { getUsersPendingEmailLambda } from './users/getUsersPendingEmailLambda';
import { getWorkItemLambda } from './workitems/getWorkItemLambda';
import { ipLimiter } from './middleware/ipLimiter';
import { lambdaWrapper } from './lambdaWrapper';
import { logger } from './logger';
import { opinionAdvancedSearchLambda } from './documents/opinionAdvancedSearchLambda';
import { orderAdvancedSearchLambda } from './documents/orderAdvancedSearchLambda';
import { prioritizeCaseLambda } from './cases/prioritizeCaseLambda';
import { privatePractitionerCaseAssociationLambda } from './cases/privatePractitionerCaseAssociationLambda';
import { privatePractitionerPendingCaseAssociationLambda } from './cases/privatePractitionerPendingCaseAssociationLambda';
import { refreshAuthTokenLambda } from './auth/refreshAuthTokenLambda';
import { removeCaseFromTrialLambda } from './trialSessions/removeCaseFromTrialLambda';
import { removeCasePendingItemLambda } from './cases/removeCasePendingItemLambda';
import { removeConsolidatedCasesLambda } from './cases/removeConsolidatedCasesLambda';
import { removePdfFromDocketEntryLambda } from './documents/removePdfFromDocketEntryLambda';
import { removePetitionerAndUpdateCaptionLambda } from './cases/removePetitionerAndUpdateCaptionLambda';
import { removeSignatureFromDocumentLambda } from './documents/removeSignatureFromDocumentLambda';
import { replyToMessageLambda } from './messages/replyToMessageLambda';
import { runTrialSessionPlanningReportLambda } from './trialSessions/runTrialSessionPlanningReportLambda';
import { saveCalendarNoteLambda } from './trialSessions/saveCalendarNoteLambda';
import { saveCaseDetailInternalEditLambda } from './cases/saveCaseDetailInternalEditLambda';
import { saveCaseNoteLambda } from './caseNote/saveCaseNoteLambda';
import { saveSignedDocumentLambda } from './documents/saveSignedDocumentLambda';
import { sealCaseContactAddressLambda } from './cases/sealCaseContactAddressLambda';
import { sealCaseLambda } from './cases/sealCaseLambda';
import { sealDocketEntryLambda } from './documents/sealDocketEntryLambda';
import { serveCaseToIrsLambda } from './cases/serveCaseToIrsLambda';
import { serveCourtIssuedDocumentLambda } from './cases/serveCourtIssuedDocumentLambda';
import { serveExternallyFiledDocumentLambda } from './documents/serveExternallyFiledDocumentLambda';
import { set } from 'lodash';
import { setForHearingLambda } from './trialSessions/setForHearingLambda';
import { setMessageAsReadLambda } from './messages/setMessageAsReadLambda';
import { setNoticesForCalendaredTrialSessionLambda } from './trialSessions/setNoticesForCalendaredTrialSessionLambda';
import { setTrialSessionCalendarLambda } from './trialSessions/setTrialSessionCalendarLambda';
import { setWorkItemAsReadLambda } from './workitems/setWorkItemAsReadLambda';
import { strikeDocketEntryLambda } from './documents/strikeDocketEntryLambda';
import { swaggerJsonLambda } from './swagger/swaggerJsonLambda';
import { swaggerLambda } from './swagger/swaggerLambda';
import { unblockCaseFromTrialLambda } from './cases/unblockCaseFromTrialLambda';
import { unprioritizeCaseLambda } from './cases/unprioritizeCaseLambda';
import { unsealCaseLambda } from './cases/unsealCaseLambda';
import { unsealDocketEntryLambda } from './documents/unsealDocketEntryLambda';
import { updateCaseContextLambda } from './cases/updateCaseContextLambda';
import { updateCaseDeadlineLambda } from './caseDeadline/updateCaseDeadlineLambda';
import { updateCaseDetailsLambda } from './cases/updateCaseDetailsLambda';
import { updateCaseTrialSortTagsLambda } from './cases/updateCaseTrialSortTagsLambda';
import { updateContactLambda } from './cases/updateContactLambda';
import { updateCorrespondenceDocumentLambda } from './correspondence/updateCorrespondenceDocumentLambda';
import { updateCounselOnCaseLambda } from './cases/updateCounselOnCaseLambda';
import { updateCourtIssuedDocketEntryLambda } from './documents/updateCourtIssuedDocketEntryLambda';
import { updateCourtIssuedOrderToCaseLambda } from './documents/updateCourtIssuedOrderToCaseLambda';
import { updateDeficiencyStatisticLambda } from './cases/updateDeficiencyStatisticLambda';
import { updateDocketEntryMetaLambda } from './documents/updateDocketEntryMetaLambda';
import { updateOtherStatisticsLambda } from './cases/updateOtherStatisticsLambda';
import { updatePetitionerInformationLambda } from './cases/updatePetitionerInformationLambda';
import { updatePractitionerUserLambda } from './practitioners/updatePractitionerUserLambda';
import { updateQcCompleteForTrialLambda } from './cases/updateQcCompleteForTrialLambda';
import { updateTrialSessionLambda } from './trialSessions/updateTrialSessionLambda';
import { updateTrialSessionWorkingCopyLambda } from './trialSessions/updateTrialSessionWorkingCopyLambda';
import { updateUserCaseNoteLambda } from './caseNote/updateUserCaseNoteLambda';
import { updateUserContactInformationLambda } from './users/updateUserContactInformationLambda';
import { updateUserPendingEmailLambda } from './users/updateUserPendingEmailLambda';
import { userIdLimiter } from './middleware/userIdLimiter';
import { getCaseLambda as v1GetCaseLambda } from './v1/getCaseLambda';
import { getDocumentDownloadUrlLambda as v1GetDocumentDownloadUrlLambda } from './v1/getDocumentDownloadUrlLambda';
import { getCaseLambda as v2GetCaseLambda } from './v2/getCaseLambda';
import { getDocumentDownloadUrlLambda as v2GetDocumentDownloadUrlLambda } from './v2/getDocumentDownloadUrlLambda';
import { getReconciliationReportLambda as v2GetReconciliationReportLambda } from './v2/getReconciliationReportLambda';
import { validatePdfLambda } from './documents/validatePdfLambda';
import { verifyPendingCaseForUserLambda } from './cases/verifyPendingCaseForUserLambda';
import { verifyUserPendingEmailLambda } from './users/verifyUserPendingEmailLambda';

import { getCasesByStatusAndByJudgeLambda } from './reports/getCasesByStatusAndByJudgeLambda';
import { getCasesClosedByJudgeLambda } from './reports/getCasesClosedByJudgeLambda';
import { getOpinionsFiledByJudgeLambda } from './reports/getOpinionsFiledByJudgeLambda';
import { getOrdersFiledByJudgeLambda } from './reports/getOrdersFiledByJudgeLambda';
import { getTrialSessionsForJudgeActivityReportLambda } from './reports/getTrialSessionsForJudgeActivityReportLambda';
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
    '/reports/custom-case-inventory-report',
    lambdaWrapper(getCustomCaseInventoryReportLambda),
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
  app.post(
    '/judge-activity-report/closed-cases',
    lambdaWrapper(getCasesClosedByJudgeLambda),
  );
  app.post(
    '/judge-activity-report/open-cases',
    lambdaWrapper(getCasesByStatusAndByJudgeLambda),
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
    '/trial-sessions/paper-service-pdf',
    lambdaWrapper(generateTrialSessionPaperServicePdfLambda),
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
  app.post(
    '/judge-activity-report/opinions',
    lambdaWrapper(getOpinionsFiledByJudgeLambda),
  );
  app.post(
    '/judge-activity-report/orders',
    lambdaWrapper(getOrdersFiledByJudgeLambda),
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
