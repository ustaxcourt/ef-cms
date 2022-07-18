const { updateConsistent } = require('../../dynamodbClientService');

/**
 * createJobStatus
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.jobId the unique jobId for this job
 * @param {object} providers.docketNumber the case docket number
 * @returns {Promise} the promise of the call to persistence
 */
exports.setJobAsProcessing = ({ applicationContext, docketNumber, jobId }) =>
  updateConsistent({
    ExpressionAttributeNames: {
      '#docketNumber': docketNumber,
    },
    ExpressionAttributeValues: {
      ':value': 'processing',
    },
    Key: {
      pk: `set-notices-for-trial-session-job-${jobId}`,
      sk: `set-notices-for-trial-session-job-${jobId}`,
    },
    ReturnValues: 'UPDATED_NEW',
    UpdateExpression: 'SET #docketNumber :value',
    applicationContext,
  });
