const { get } = require('../../dynamodbClientService');

/**
 * getTrialSessionProcessingStatus
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSessionId the trial session id
 * @returns {Promise} the promise of the call to persistence
 */
exports.getTrialSessionProcessingStatus = ({
  applicationContext,
  trialSessionId,
}) =>
  get({
    ConsistentRead: true,
    Key: {
      pk: `trial-session-processing-job-${trialSessionId}`,
      sk: `trial-session-processing-job-${trialSessionId}`,
    },
    applicationContext,
  });
