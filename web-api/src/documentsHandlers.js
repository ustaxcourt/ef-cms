module.exports = {
  generatePrintableFilingReceiptLambda: require('./documents/generatePrintableFilingReceiptLambda')
    .handler,
  getUploadPolicyLambda: require('./documents/getUploadPolicyLambda').handler,
  validatePdfLambda: require('./documents/validatePdfLambda').handler,
  virusScanPdfLambda: require('./documents/virusScanPdfLambda').handler,
};
