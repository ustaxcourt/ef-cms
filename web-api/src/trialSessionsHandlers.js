module.exports = {
  addCaseToTrialSessionLambda: require('./trialSessions/addCaseToTrialSessionLambda')
    .addCaseToTrialSessionLambda,
  batchDownloadTrialSessionLambda: require('./trialSessions/batchDownloadTrialSessionLambda')
    .batchDownloadTrialSessionLambda,
  createTrialSessionLambda: require('./trialSessions/createTrialSessionLambda')
    .createTrialSessionLambda,
  deleteTrialSessionLambda: require('./trialSessions/deleteTrialSessionLambda')
    .deleteTrialSessionLambda,
  getCalendaredCasesForTrialSessionLambda: require('./trialSessions/getCalendaredCasesForTrialSessionLambda')
    .getCalendaredCasesForTrialSessionLambda,
  getEligibleCasesForTrialSessionLambda: require('./trialSessions/getEligibleCasesForTrialSessionLambda')
    .getEligibleCasesForTrialSessionLambda,
  getTrialSessionDetailsLambda: require('./trialSessions/getTrialSessionDetailsLambda')
    .getTrialSessionDetailsLambda,
  getTrialSessionWorkingCopyLambda: require('./trialSessions/getTrialSessionWorkingCopyLambda')
    .getTrialSessionWorkingCopyLambda,
  getTrialSessionsLambda: require('./trialSessions/getTrialSessionsLambda')
    .getTrialSessionsLambda,
  removeCaseFromTrialLambda: require('./trialSessions/removeCaseFromTrialLambda')
    .removeCaseFromTrialLambda,
  setNoticesForCalendaredTrialSessionLambda: require('./trialSessions/setNoticesForCalendaredTrialSessionLambda')
    .setNoticesForCalendaredTrialSessionLambda,
  setTrialSessionAsSwingSessionLambda: require('./trialSessions/setTrialSessionAsSwingSessionLambda')
    .setTrialSessionAsSwingSessionLambda,
  setTrialSessionCalendarLambda: require('./trialSessions/setTrialSessionCalendarLambda')
    .setTrialSessionCalendarLambda,
  updateTrialSessionLambda: require('./trialSessions/updateTrialSessionLambda')
    .updateTrialSessionLambda,
  updateTrialSessionWorkingCopyLambda: require('./trialSessions/updateTrialSessionWorkingCopyLambda')
    .updateTrialSessionWorkingCopyLambda,
};
