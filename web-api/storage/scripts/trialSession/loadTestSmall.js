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
  const { trialSessionId } = trialSessionEntity;

  // for (let i = 0; i < NUM_CASES; i++) {
  try {
    console.log('Creating Case');
    const caseEntity = await createCase();
    const { caseId } = caseEntity;
    console.log(`Adding Case ${caseId} to Trial Session ${trialSessionId}`);
    await addCaseToTrialSession({
      caseId,
      trialSessionId,
    });
  } catch (e) {
    console.log('err', e);
  }
  // }
})();
