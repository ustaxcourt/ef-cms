const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const { lambdaWrapper } = require('./lambdaWrapper');
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '1200kb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    // we added this to suppress error `Missing x-apigateway-event or x-apigateway-context header(s)` locally
    // aws-serverless-express/middleware plugin is looking for these headers, which are needed on the lambdas
    req.headers['x-apigateway-event'] = 'null';
    req.headers['x-apigateway-context'] = 'null';
  }
  return next();
});
app.use(awsServerlessExpressMiddleware.eventContext());

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
  deleteTrialSessionLambda,
} = require('./trialSessions/deleteTrialSessionLambda');
const {
  deleteUserCaseNoteLambda,
} = require('./caseNote/deleteUserCaseNoteLambda');
const {
  downloadPolicyUrlLambda,
} = require('./documents/downloadPolicyUrlLambda');
const {
  fetchPendingItemsLambda,
} = require('./pendingItems/fetchPendingItemsLambda');
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
  fileDocketEntryToCaseLambda,
} = require('./documents/fileDocketEntryToCaseLambda');
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
  getAllCaseDeadlinesLambda,
} = require('./caseDeadline/getAllCaseDeadlinesLambda');
const {
  getCalendaredCasesForTrialSessionLambda,
} = require('./trialSessions/getCalendaredCasesForTrialSessionLambda');
const {
  getCaseDeadlinesForCaseLambda,
} = require('./caseDeadline/getCaseDeadlinesForCaseLambda');
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
  getDocumentDownloadUrlLambda,
} = require('./documents/getDocumentDownloadUrlLambda');
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
  getInboxMessagesForSectionLambda,
} = require('./messages/getInboxMessagesForSectionLambda');
const {
  getInboxMessagesForUserLambda,
} = require('./messages/getInboxMessagesForUserLambda');
const {
  getIrsPractitionersBySearchKeyLambda,
} = require('./users/getIrsPractitionersBySearchKeyLambda');
const {
  getMessagesForCaseLambda,
} = require('./messages/getMessagesForCaseLambda');
const {
  getOpenConsolidatedCasesLambda,
} = require('./cases/getOpenConsolidatedCasesLambda');
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
  getPractitionersByNameLambda,
} = require('./practitioners/getPractitionersByNameLambda');
const {
  getPrivatePractitionersBySearchKeyLambda,
} = require('./users/getPrivatePractitionersBySearchKeyLambda');
const {
  getTrialSessionDetailsLambda,
} = require('./trialSessions/getTrialSessionDetailsLambda');
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
  migrateCaseDeadlineLambda,
} = require('./migrate/migrateCaseDeadlineLambda');
const {
  migrateTrialSessionLambda,
} = require('./migrate/migrateTrialSessionLambda');
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
  removeSignatureFromDocumentLambda,
} = require('./documents/removeSignatureFromDocumentLambda');
const {
  runTrialSessionPlanningReportLambda,
} = require('./trialSessions/runTrialSessionPlanningReportLambda');
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
  updateDocketEntryOnCaseLambda,
} = require('./documents/updateDocketEntryOnCaseLambda');
const {
  updateOtherStatisticsLambda,
} = require('./cases/updateOtherStatisticsLambda');
const {
  updatePetitionDetailsLambda,
} = require('./cases/updatePetitionDetailsLambda');
const {
  updatePetitionerInformationLambda,
} = require('./cases/updatePetitionerInformationLambda');
const {
  updatePractitionerUserLambda,
} = require('./practitioners/updatePractitionerUserLambda');
const {
  updatePrimaryContactLambda,
} = require('./cases/updatePrimaryContactLambda');
const {
  updateQcCompleteForTrialLambda,
} = require('./cases/updateQcCompleteForTrialLambda');
const {
  updateSecondaryContactLambda,
} = require('./cases/updateSecondaryContactLambda');
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
  verifyPendingCaseForUserLambda,
} = require('./cases/verifyPendingCaseForUserLambda');
const { addCoversheetLambda } = require('./documents/addCoversheetLambda');
const { assignWorkItemsLambda } = require('./workitems/assignWorkItemsLambda');
const { completeMessageLambda } = require('./messages/completeMessageLambda');
const { createCaseLambda } = require('./cases/createCaseLambda');
const { createMessageLambda } = require('./messages/createMessageLambda');
const { createUserLambda } = require('./users/createUserLambda');
const { deleteCaseNoteLambda } = require('./caseNote/deleteCaseNoteLambda');
const { forwardMessageLambda } = require('./messages/forwardMessageLambda');
const { getBlockedCasesLambda } = require('./reports/getBlockedCasesLambda');
const { getCaseLambda } = require('./cases/getCaseLambda');
const { getCasesByUserLambda } = require('./cases/getCasesByUserLambda');
const { getClosedCasesLambda } = require('./cases/getClosedCasesLambda');
const { getInternalUsersLambda } = require('./users/getInternalUsersLambda');
const { getMessageThreadLambda } = require('./messages/getMessageThreadLambda');
const { getNotificationsLambda } = require('./users/getNotificationsLambda');
const { getUploadPolicyLambda } = require('./documents/getUploadPolicyLambda');
const { getUserByIdLambda } = require('./users/getUserByIdLambda');
const { getUserCaseNoteLambda } = require('./caseNote/getUserCaseNoteLambda');
const { getUserLambda } = require('./users/getUserLambda');
const { getUsersInSectionLambda } = require('./users/getUsersInSectionLambda');
const { getWorkItemLambda } = require('./workitems/getWorkItemLambda');
const { migrateCaseLambda } = require('./migrate/migrateCaseLambda');
const { prioritizeCaseLambda } = require('./cases/prioritizeCaseLambda');
const { replyToMessageLambda } = require('./messages/replyToMessageLambda');
const { saveCaseNoteLambda } = require('./caseNote/saveCaseNoteLambda');
const { sealCaseLambda } = require('./cases/sealCaseLambda');
const { serveCaseToIrsLambda } = require('./cases/serveCaseToIrsLambda');
const { swaggerJsonLambda } = require('./swagger/swaggerJsonLambda');
const { swaggerLambda } = require('./swagger/swaggerLambda');
const { unprioritizeCaseLambda } = require('./cases/unprioritizeCaseLambda');
const { updateCaseContextLambda } = require('./cases/updateCaseContextLambda');
const { validatePdfLambda } = require('./documents/validatePdfLambda');
const { virusScanPdfLambda } = require('./documents/virusScanPdfLambda');

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
  app.get('/case-deadlines', lambdaWrapper(getAllCaseDeadlinesLambda));
}
/**
 * case-documents
 */
{
  //GET
  app.get(
    '/case-documents/:docketNumber/:documentId/document-download-url',
    lambdaWrapper(getDocumentDownloadUrlLambda),
  );
  app.get(
    '/case-documents/:docketNumber/:documentId/download-policy-url',
    lambdaWrapper(downloadPolicyUrlLambda),
  );
  app.get(
    '/case-documents/opinion-search',
    lambdaWrapper(opinionAdvancedSearchLambda),
  );
  app.get(
    '/case-documents/order-search',
    lambdaWrapper(orderAdvancedSearchLambda),
  );
  // POST
  app.post(
    '/case-documents/:docketNumber/:documentId/serve-court-issued',
    lambdaWrapper(serveCourtIssuedDocumentLambda),
  );
  app.post(
    '/case-documents/:docketNumber/:documentId/coversheet',
    lambdaWrapper(addCoversheetLambda),
  );
  app.post(
    '/case-documents/:docketNumber/:documentId/remove-signature',
    lambdaWrapper(removeSignatureFromDocumentLambda),
  );
  app.post(
    '/case-documents/:docketNumber/:documentId/sign',
    lambdaWrapper(saveSignedDocumentLambda),
  );
  app.post(
    '/case-documents/:docketNumber/:documentId/serve',
    lambdaWrapper(serveExternallyFiledDocumentLambda),
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
    '/case-documents/:docketNumber/docket-entry',
    lambdaWrapper(fileDocketEntryToCaseLambda),
  );
  app.post(
    '/case-documents/:docketNumber/court-issued-docket-entry',
    lambdaWrapper(fileCourtIssuedDocketEntryLambda),
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
    '/case-documents/:docketNumber/court-issued-orders/:documentId',
    lambdaWrapper(updateCourtIssuedOrderToCaseLambda),
  );
  app.put(
    '/case-documents/:docketNumber/docket-entry',
    lambdaWrapper(updateDocketEntryOnCaseLambda),
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
    '/case-documents/:docketNumber/correspondence/:documentId',
    lambdaWrapper(updateCorrespondenceDocumentLambda),
  );
  app.put(
    '/case-documents/:docketNumber/:documentId',
    lambdaWrapper(archiveDraftDocumentLambda),
  );
  app.put(
    '/case-documents/:docketNumber/:documentId/strike',
    lambdaWrapper(strikeDocketEntryLambda),
  );
  // DELETE
  app.delete(
    '/case-documents/:docketNumber/correspondence/:documentId',
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
}
/**
 * case-notes
 */
{
  app.get(
    '/case-notes/batch-cases/:docketNumbers/user-notes',
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
    '/case-parties/:docketNumber/contact-primary',
    lambdaWrapper(updatePrimaryContactLambda),
  );
  app.put(
    '/case-parties/:docketNumber/contact-secondary',
    lambdaWrapper(updateSecondaryContactLambda),
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
    '/case-parties/:docketNumber/petition-details',
    lambdaWrapper(updatePetitionDetailsLambda),
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
  app.get('/cases/open', lambdaWrapper(getOpenConsolidatedCasesLambda));
  app.get('/cases/search', lambdaWrapper(caseAdvancedSearchLambda));
  app.post('/cases/paper', lambdaWrapper(createCaseFromPaperLambda));
  app.get('/cases/closed', lambdaWrapper(getClosedCasesLambda));
  app.delete(
    '/cases/:docketNumber/remove-pending/:documentId',
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
  app.get('/cases/:docketNumber', lambdaWrapper(getCaseLambda));
  app.post('/cases', lambdaWrapper(createCaseLambda));
}
/**
 * documents
 */
{
  app.post('/documents/:documentId/validate', lambdaWrapper(validatePdfLambda));
  app.get(
    '/documents/:documentId/upload-policy',
    lambdaWrapper(getUploadPolicyLambda),
  );
  app.post(
    '/documents/filing-receipt-pdf',
    lambdaWrapper(generatePrintableFilingReceiptLambda),
  );
}

app.post(
  '/clamav/documents/:documentId/virus-scan',
  lambdaWrapper(virusScanPdfLambda),
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
 * migrate
 */
app.post('/migrate/case', lambdaWrapper(migrateCaseLambda));
app.post('/migrate/case-deadline', lambdaWrapper(migrateCaseDeadlineLambda));
app.post('/migrate/trial-session', lambdaWrapper(migrateTrialSessionLambda));

/**
 * practitioners
 */
{
  app.get(
    '/practitioners/:barNumber',
    lambdaWrapper(getPractitionerByBarNumberLambda),
  );
  app.put(
    '/practitioners/:barNumber',
    lambdaWrapper(updatePractitionerUserLambda),
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

/**
 * trial-sessions
 */
{
  app.post(
    '/async/trial-sessions/:trialSessionId/generate-notices',
    lambdaWrapper(setNoticesForCalendaredTrialSessionLambda),
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
    lambdaWrapper(batchDownloadTrialSessionLambda),
  );
  app.put(
    '/trial-sessions/:trialSessionId/remove-case/:docketNumber',
    lambdaWrapper(removeCaseFromTrialLambda),
  );
  app.post(
    '/trial-sessions/:trialSessionId/cases/:docketNumber',
    lambdaWrapper(addCaseToTrialSessionLambda),
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
  app.post('/trial-sessions', lambdaWrapper(createTrialSessionLambda));
  app.put('/trial-sessions', lambdaWrapper(updateTrialSessionLambda));
}

/**
 * users
 */
app.get('/users/internal', lambdaWrapper(getInternalUsersLambda));
app.get('/users/:userId/cases', lambdaWrapper(getCasesByUserLambda));
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
  lambdaWrapper(updateUserContactInformationLambda),
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

exports.app = app;
