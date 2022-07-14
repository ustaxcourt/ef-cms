const createApplicationContext = require('../../../src/applicationContext');

exports.handler = async event => {
  const applicationContext = createApplicationContext({});
  const { docketNumber, jobId, trialSession, userId } = event;

  await applicationContext
    .getUserCases()
    .generateNoticesForCaseTrialSessionCalendarInteractor(applicationContext, {
      docketNumber,
      jobId,
      trialSession,
      userId,
    });
};
