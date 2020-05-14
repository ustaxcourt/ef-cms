module.exports = {
  addCoversheetLambda: require('./documents/addCoversheetLambda')
    .addCoversheetLambda,
  archiveDraftDocumentLambda: require('./documents/archiveDraftDocumentLambda')
    .archiveDraftDocumentLambda,
  completeDocketEntryQCLambda: require('./documents/completeDocketEntryQCLambda')
    .completeDocketEntryQCLambda,
  createWorkItemLambda: require('./workitems/createWorkItemLambda')
    .createWorkItemLambda,
  downloadPolicyUrlLambda: require('./documents/downloadPolicyUrlLambda')
    .downloadPolicyUrlLambda,
  fileCourtIssuedDocketEntryLambda: require('./documents/fileCourtIssuedDocketEntryLambda')
    .fileCourtIssuedDocketEntryLambda,
  fileCourtIssuedOrderToCaseLambda: require('./documents/fileCourtIssuedOrderToCaseLambda')
    .fileCourtIssuedOrderToCaseLambda,
  fileDocketEntryToCaseLambda: require('./documents/fileDocketEntryToCaseLambda')
    .fileDocketEntryToCaseLambda,
  fileExternalDocumentToCaseLambda: require('./documents/fileExternalDocumentToCaseLambda')
    .fileExternalDocumentToCaseLambda,
  fileExternalDocumentToConsolidatedCasesLambda: require('./documents/fileExternalDocumentToConsolidatedCasesLambda')
    .fileExternalDocumentToConsolidatedCasesLambda,
  getDocumentDownloadUrlLambda: require('./documents/getDocumentDownloadUrlLambda')
    .getDocumentDownloadUrlLambda,
  opinionAdvancedSearchLambda: require('./documents/opinionAdvancedSearchLambda')
    .opinionAdvancedSearchLambda,
  orderAdvancedSearchLambda: require('./documents/orderAdvancedSearchLambda')
    .orderAdvancedSearchLambda,
  serveCourtIssuedDocumentLambda: require('./cases/serveCourtIssuedDocumentLambda')
    .serveCourtIssuedDocumentLambda,
  signDocumentLambda: require('./documents/signDocumentLambda')
    .signDocumentLambda,
  updateCourtIssuedDocketEntryLambda: require('./documents/updateCourtIssuedDocketEntryLambda')
    .updateCourtIssuedDocketEntryLambda,
  updateCourtIssuedOrderToCaseLambda: require('./documents/updateCourtIssuedOrderToCaseLambda')
    .updateCourtIssuedOrderToCaseLambda,
  updateDocketEntryMetaLambda: require('./documents/updateDocketEntryMetaLambda')
    .updateDocketEntryMetaLambda,
  updateDocketEntryOnCaseLambda: require('./documents/updateDocketEntryOnCaseLambda')
    .updateDocketEntryOnCaseLambda,
};
