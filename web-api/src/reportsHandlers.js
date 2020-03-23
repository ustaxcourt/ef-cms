module.exports = {
  fetchPendingItemsLambda: require('./pendingItems/fetchPendingItemsLambda')
    .fetchPendingItemsLambda,
  generatePrintableCaseInventoryReportLambda: require('./reports/generatePrintableCaseInventoryReportLambda')
    .generatePrintableCaseInventoryReportLambda,
  generatePrintablePendingReportLambda: require('./pendingItems/generatePrintablePendingReportLambda')
    .generatePrintablePendingReportLambda,
  generateTrialCalendarPdfLambda: require('./trialSessions/generateTrialCalendarPdfLambda')
    .generateTrialCalendarPdfLambda,
  getBlockedCasesLambda: require('./reports/getBlockedCasesLambda')
    .getBlockedCasesLambda,
  getCaseInventoryReportLambda: require('./reports/getCaseInventoryReportLambda')
    .getCaseInventoryReportLambda,
  runTrialSessionPlanningReportLambda: require('./trialSessions/runTrialSessionPlanningReportLambda')
    .runTrialSessionPlanningReportLambda,
};
