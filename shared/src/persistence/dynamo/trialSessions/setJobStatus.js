const { updateConsistent } = require('../../dynamodbClientService');

/**
 * setJobStatus
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.jobId the unique jobId for this job
 * @param {object} providers.docketNumber the case docket number
 * @param {object} providers.status the job status
 * @returns {Promise} the promise of the call to persistence
 */
exports.setJobStatus = ({ applicationContext, docketNumber, jobId, status }) =>
  updateConsistent({
    ExpressionAttributeNames: {
      '#docketNumber': docketNumber,
    },
    ExpressionAttributeValues: {
      ':value': status,
    },
    Key: {
      pk: `set-notices-for-trial-session-job-${jobId}`,
      sk: `set-notices-for-trial-session-job-${jobId}`,
    },
    ReturnValues: 'UPDATED_NEW',
    UpdateExpression: 'SET #docketNumber = :value',
    applicationContext,
  });
