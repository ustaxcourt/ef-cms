const AWS = require('aws-sdk');

const {
  addCaseToTrialSession,
  createCase,
  createTrialSession,
} = require('./loadTestHelpers');

Error.stackTraceLimit = Infinity;

AWS.config = new AWS.Config();
AWS.config.accessKeyId = 'noop';
AWS.config.secretAccessKey = 'noop';
AWS.config.region = 'us-east-1';

(async function() {
  const NUM_CASES = 100;

  const trialSessionEntity = await createTrialSession();

  // for (let i = 0; i < NUM_CASES; i++) {
  try {
    console.log('Creating Case');
    const caseEntity = await createCase();
    console.log('Adding Case to Trial Session');
    await addCaseToTrialSession({
      caseId: caseEntity.caseId,
      trialSessionId: trialSessionEntity.trialSessionId,
    });
  } catch (e) {
    console.log('err', e);
  }
  // }
})();
