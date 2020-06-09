const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(awsServerlessExpressMiddleware.eventContext());

const {
  addConsolidatedCaseLambda,
} = require('./cases/addConsolidatedCaseLambda');
const {
  addDeficiencyStatisticLambda,
} = require('./cases/addDeficiencyStatisticLambda');
const {
  archiveDraftDocumentLambda,
} = require('./documents/archiveDraftDocumentLambda');
const {
  blockCaseFromTrialLambda,
} = require('./cases/blockCaseFromTrialLambda');
const {
  completeDocketEntryQCLambda,
} = require('./documents/completeDocketEntryQCLambda');
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
  deleteCaseDeadlineLambda,
} = require('./caseDeadline/deleteCaseDeadlineLambda');
const {
  deleteCorrespondenceDocumentLambda,
} = require('./correspondence/deleteCorrespondenceDocumentLambda');
const {
  deleteDeficiencyStatisticLambda,
} = require('./cases/deleteDeficiencyStatisticLambda');
const {
  deleteUserCaseNoteLambda,
} = require('./caseNote/deleteUserCaseNoteLambda');
const {
  downloadPolicyUrlLambda,
} = require('./documents/downloadPolicyUrlLambda');
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
  getAllCaseDeadlinesLambda,
} = require('./caseDeadline/getAllCaseDeadlinesLambda');
const {
  getCaseDeadlinesForCaseLambda,
} = require('./caseDeadline/getCaseDeadlinesForCaseLambda');
const {
  getConsolidatedCasesByCaseLambda,
} = require('./cases/getConsolidatedCasesByCaseLambda');
const {
  getDocumentDownloadUrlLambda,
} = require('./documents/getDocumentDownloadUrlLambda');
const {
  getOpenConsolidatedCasesLambda,
} = require('./cases/getOpenConsolidatedCasesLambda');
const {
  getUserCaseNoteForCasesLambda,
} = require('./caseNote/getUserCaseNoteForCasesLambda');
const {
  opinionAdvancedSearchLambda,
} = require('./documents/opinionAdvancedSearchLambda');
const {
  orderAdvancedSearchLambda,
} = require('./documents/orderAdvancedSearchLambda');
const {
  removeCasePendingItemLambda,
} = require('./cases/removeCasePendingItemLambda');
const {
  removeConsolidatedCasesLambda,
} = require('./cases/removeConsolidatedCasesLambda');
const {
  saveCaseDetailInternalEditLambda,
} = require('./cases/saveCaseDetailInternalEditLambda');
const {
  serveCourtIssuedDocumentLambda,
} = require('./cases/serveCourtIssuedDocumentLambda');
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
  updateQcCompleteForTrialLambda,
} = require('./cases/updateQcCompleteForTrialLambda');
const {
  updateUserCaseNoteLambda,
} = require('./caseNote/updateUserCaseNoteLambda');
const { addCoversheetLambda } = require('./documents/addCoversheetLambda');
const { caseAdvancedSearchLambda } = require('/cases/caseAdvancedSearchLambda');
const { createCaseLambda } = require('./cases/createCaseLambda');
const { createWorkItemLambda } = require('./workitems/createWorkItemLambda');
const { deleteCaseNoteLambda } = require('./caseNote/deleteCaseNoteLambda');
const { getCaseLambda } = require('./cases/getCaseLambda');
const { getClosedCasesLambda } = require('./cases/getClosedCasesLambda');
const { getNotificationsLambda } = require('./users/getNotificationsLambda');
const { getUserCaseNoteLambda } = require('./caseNote/getUserCaseNoteLambda');
const { prioritizeCaseLambda } = require('./cases/prioritizeCaseLambda');
const { saveCaseNoteLambda } = require('./caseNote/saveCaseNoteLambda');
const { sealCaseLambda } = require('./cases/sealCaseLambda');
const { serveCaseToIrsLambda } = require('./cases/serveCaseToIrsLambda');
const { signDocumentLambda } = require('./documents/signDocumentLambda');
const { swaggerJsonLambda } = require('./swagger/swaggerJsonLambda');
const { swaggerLambda } = require('./swagger/swaggerLambda');
const { unprioritizeCaseLambda } = require('./cases/unprioritizeCaseLambda');
const { updateCaseContextLambda } = require('./cases/updateCaseContextLambda');

const lambdaWrapper = async lambda => {
  return async (req, res) => {
    const event = (req.apiGateway && req.apiGateway.event) || {
      headers: req.headers,
      pathParameters: req.params,
      queryStringParameters: req.query,
    };
    const response = await lambda({
      ...event,
      body: JSON.stringify(req.body),
    });
    res.json(JSON.parse(response.body));
  };
};

/**
 * api
 */
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

/**
 * case-deadlines
 */
app.post('/case-deadlines/:caseId', lambdaWrapper(createCaseDeadlineLambda));
app.get(
  '/case-deadlines/:caseId',
  lambdaWrapper(getCaseDeadlinesForCaseLambda),
);
app.put(
  '/case-deadlines/:caseId/:caseDeadlineId',
  lambdaWrapper(updateCaseDeadlineLambda),
);
app.delete(
  '/case-deadlines/:caseId/:caseDeadlineId',
  lambdaWrapper(deleteCaseDeadlineLambda),
);
app.get('/case-deadlines', lambdaWrapper(getAllCaseDeadlinesLambda));

/**
 * case-documents
 */
app.post(
  '/case-documents/:caseId/:documentId/serve-court-issued',
  lambdaWrapper(serveCourtIssuedDocumentLambda),
);
app.post(
  '/case-documents/:caseId/:documentId/work-items',
  lambdaWrapper(createWorkItemLambda),
);
app.post(
  '/case-documents/:caseId/:documentId/coversheet',
  lambdaWrapper(addCoversheetLambda),
);
app.post(
  '/case-documents/:caseId/:documentId/sign',
  lambdaWrapper(signDocumentLambda),
);
app.delete(
  '/case-documents/:caseId/:documentId',
  lambdaWrapper(archiveDraftDocumentLambda),
);
app.post(
  '/case-documents/:caseId/external-document',
  lambdaWrapper(fileExternalDocumentToCaseLambda),
);
app.post(
  '/case-documents/consolidated/:leadCaseId/external-document',
  lambdaWrapper(fileExternalDocumentToConsolidatedCasesLambda),
);
app.post(
  '/case-documents/:caseId/docket-entry',
  lambdaWrapper(fileDocketEntryToCaseLambda),
);
app.put(
  '/case-documents/:caseId/docket-entry',
  lambdaWrapper(updateDocketEntryOnCaseLambda),
);
app.put(
  '/case-documents/:caseId/docket-entry-meta',
  lambdaWrapper(updateDocketEntryMetaLambda),
);
app.put(
  '/case-documents/:caseId/docket-entry-complete',
  lambdaWrapper(completeDocketEntryQCLambda),
);
app.post(
  '/case-documents/:caseId/court-issued-docket-entry',
  lambdaWrapper(fileCourtIssuedDocketEntryLambda),
);
app.put(
  '/case-documents/:caseId/court-issued-docket-entry',
  lambdaWrapper(updateCourtIssuedDocketEntryLambda),
);
app.post(
  '/case-documents/:caseId/court-issued-order',
  lambdaWrapper(fileCourtIssuedOrderToCaseLambda),
);
app.put(
  '/case-documents/:caseId/court-issued-orders/:documentId',
  lambdaWrapper(updateCourtIssuedOrderToCaseLambda),
);
app.get(
  '/case-documents/:caseId/:documentId/download-policy-url',
  lambdaWrapper(downloadPolicyUrlLambda),
);
app.get(
  '/case-documents/:caseId/:documentId/document-download-url',
  lambdaWrapper(getDocumentDownloadUrlLambda),
);
app.get(
  '/case-documents/order-search',
  lambdaWrapper(orderAdvancedSearchLambda),
);
app.get(
  '/case-documents/opinion-search',
  lambdaWrapper(opinionAdvancedSearchLambda),
);
app.post(
  '/case-documents/:caseId/correspondence',
  lambdaWrapper(fileCorrespondenceDocumentLambda),
);
app.put(
  '/case-documents/:caseId/correspondence/:documentId',
  lambdaWrapper(updateCorrespondenceDocumentLambda),
);
app.delete(
  '/case-documents/:caseId/correspondence/:documentId',
  lambdaWrapper(deleteCorrespondenceDocumentLambda),
);

/**
 * case-meta
 */
app.put(
  '/case-meta/:caseId/update-case-trial-sort-tags',
  lambdaWrapper(updateCaseTrialSortTagsLambda),
);
app.post('/case-meta/:caseId/block', lambdaWrapper(blockCaseFromTrialLambda));
app.delete(
  '/case-meta/:caseId/block',
  lambdaWrapper(unblockCaseFromTrialLambda),
);
app.post(
  '/case-meta/:caseId/high-priority',
  lambdaWrapper(prioritizeCaseLambda),
);
app.delete(
  '/case-meta/:caseId/high-priority',
  lambdaWrapper(unprioritizeCaseLambda),
);
app.put(
  '/case-meta/:caseId/case-context',
  lambdaWrapper(updateCaseContextLambda),
);
app.put(
  '/case-meta/:caseId/consolidate-case',
  lambdaWrapper(addConsolidatedCaseLambda),
);
app.delete(
  '/case-meta/:caseId/consolidate-case',
  lambdaWrapper(removeConsolidatedCasesLambda),
);
app.put(
  '/case-meta/:caseId/qc-complete',
  lambdaWrapper(updateQcCompleteForTrialLambda),
);
app.put('/case-meta/:caseId/seal', lambdaWrapper(sealCaseLambda));
app.post(
  '/case-meta/:caseId/other-statistics',
  lambdaWrapper(updateOtherStatisticsLambda),
);
app.post(
  '/case-meta/:caseId/statistics',
  lambdaWrapper(addDeficiencyStatisticLambda),
);
app.put(
  '/case-meta/:caseId/statistics/:statisticId',
  lambdaWrapper(updateDeficiencyStatisticLambda),
);
app.delete(
  '/case-meta/:caseId/statistics/:statisticId',
  lambdaWrapper(deleteDeficiencyStatisticLambda),
);

/**
 * case-notes
 */
app.get(
  '/case-notes/batch-cases/:caseIds/user-notes',
  lambdaWrapper(getUserCaseNoteForCasesLambda),
);
app.get('/case-notes/:caseId/user-notes', lambdaWrapper(getUserCaseNoteLambda));
app.put(
  '/case-notes/:caseId/user-notes',
  lambdaWrapper(updateUserCaseNoteLambda),
);
app.delete(
  '/case-notes/:caseId/user-notes',
  lambdaWrapper(deleteUserCaseNoteLambda),
);
app.delete('/case-notes/:caseId', lambdaWrapper(deleteCaseNoteLambda));
app.put('/case-notes/:caseId', lambdaWrapper(saveCaseNoteLambda));

/**
 * cases
 */
app.post('/cases', lambdaWrapper(createCaseLambda));
app.delete(
  '/cases/:caseId/remove-pending/:documentId',
  lambdaWrapper(removeCasePendingItemLambda),
);
app.put('/cases/:caseId/', lambdaWrapper(saveCaseDetailInternalEditLambda));
app.get('/cases/:caseId', lambdaWrapper(getCaseLambda));
app.post('/cases/paper', lambdaWrapper(createCaseFromPaperLambda));
app.get('/cases/open', lambdaWrapper(getOpenConsolidatedCasesLambda));
app.get('/cases/closed', lambdaWrapper(getClosedCasesLambda));
app.get('/cases/search', lambdaWrapper(caseAdvancedSearchLambda));
app.get(
  '/cases/:caseId/consolidated-cases',
  lambdaWrapper(getConsolidatedCasesByCaseLambda),
);
app.post('/cases/:caseId/serve-to-irs', lambdaWrapper(serveCaseToIrsLambda));

exports.app = app;
