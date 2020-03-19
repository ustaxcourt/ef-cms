module.exports = {
  fetchPendingItemsLambda: require('./pendingItems/fetchPendingItemsLambda')
    .handler,
  generatePrintableCaseInventoryReportLambda: require('./reports/generatePrintableCaseInventoryReportLambda')
    .handler,
  generatePrintablePendingReportLambda: require('./pendingItems/generatePrintablePendingReportLambda')
    .handler,
  generateTrialCalendarPdfLambda: require('./trialSessions/generateTrialCalendarPdfLambda')
    .handler,
  getBlockedCasesLambda: require('./reports/getBlockedCasesLambda').handler,
  getCaseInventoryReportLambda: require('./reports/getCaseInventoryReportLambda')
    .handler,
  runTrialSessionPlanningReportLambda: require('./trialSessions/runTrialSessionPlanningReportLambda')
    .handler,
};
