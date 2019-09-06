module.exports = {
  archiveDraftDocumentLambda: require('./documents/archiveDraftDocumentLambda')
    .handler,
  downloadPolicyUrlLambda: require('./documents/downloadPolicyUrlLambda')
    .handler,
  getDocumentDownloadUrlLambda: require('./documents/getDocumentDownloadUrl')
    .handler,
  getUploadPolicyLambda: require('./documents/getUploadPolicyLambda').handler,
  sanitizePdfLambda: require('./documents/sanitizePdfLambda').handler,
  validatePdfLambda: require('./documents/validatePdfLambda').handler,
  virusScanPdfLambda: require('./documents/virusScanPdfLambda').handler,
};
