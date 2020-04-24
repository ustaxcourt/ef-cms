module.exports = {
  checkForReadyForTrialCases: require('./cases/checkForReadyForTrialCasesLambda')
    .checkForReadyForTrialCasesLambda,
  createCourtIssuedOrderPdfFromHtmlLambda: require('./courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlLambda')
    .createCourtIssuedOrderPdfFromHtmlLambda,
  generateDocketRecordPdfLambda: require('./cases/generateDocketRecordPdfLambda')
    .generateDocketRecordPdfLambda,
  getNotificationsLambda: require('./users/getNotificationsLambda')
    .getNotificationsLambda,
  swaggerJsonLambda: require('./swagger/swaggerJsonLambda').swaggerJsonLambda,
  swaggerLambda: require('./swagger/swaggerLambda').swaggerLambda,
};
