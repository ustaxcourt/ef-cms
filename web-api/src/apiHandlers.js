module.exports = {
  checkForReadyForTrialCases: require('./cases/checkForReadyForTrialCasesLambda')
    .handler,
  createCourtIssuedOrderPdfFromHtmlLambda: require('./courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlLambda')
    .handler,
  generateDocketRecordPdfLambda: require('./cases/generateDocketRecordPdfLambda')
    .handler,
  generatePdfFromHtmlLambda: require('./cases/generatePdfFromHtmlLambda')
    .handler,
  generateTrialCalendarPdfLambda: require('./trialSessions/generateTrialCalendarPdfLambda')
    .handler,
  getNotificationsLambda: require('./users/getNotificationsLambda').handler,
  runBatchProcessLambda: require('./cases/runBatchProcessLambda').handler,
  swaggerJsonLambda: require('./swagger/swaggerJsonLambda').handler,
  swaggerLambda: require('./swagger/swaggerLambda').handler,
};
