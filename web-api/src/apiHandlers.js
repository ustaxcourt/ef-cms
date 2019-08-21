module.exports = {
  checkForReadyForTrialCases: require('./cases/checkForReadyForTrialCasesLambda')
    .handler,
  createCourtIssuedOrderPdfFromHtmlLambda: require('./courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlLambda')
    .handler,
  generatePdfFromHtmlLambda: require('./cases/generatePdfFromHtmlLambda')
    .handler,
  getNotificationsLambda: require('./users/getNotificationsLambda').handler,
  runBatchProcessLambda: require('./cases/runBatchProcessLambda').handler,
  swaggerJsonLambda: require('./swagger/swaggerJsonLambda').handler,
  swaggerLambda: require('./swagger/swaggerLambda').handler,
};
