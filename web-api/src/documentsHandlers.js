module.exports = {
  generatePrintableFilingReceiptLambda: require('./documents/generatePrintableFilingReceiptLambda')
    .generatePrintableFilingReceiptLambda,
  getUploadPolicyLambda: require('./documents/getUploadPolicyLambda')
    .getUploadPolicyLambda,
  validatePdfLambda: require('./documents/validatePdfLambda').validatePdfLambda,
  virusScanPdfLambda: require('./documents/virusScanPdfLambda')
    .virusScanPdfLambda,
};
