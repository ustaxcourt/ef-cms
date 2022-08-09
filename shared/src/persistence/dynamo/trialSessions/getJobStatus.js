const { get } = require('../../dynamodbClientService');

/**
 * getJobStatus
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.jobId the unique jobId for this job
 * @returns {Promise} the promise of the call to persistence
 */
exports.getJobStatus = ({ applicationContext, jobId }) =>
  get({
    ConsistentRead: true,
    Key: {
      pk: `set-notices-for-trial-session-job-${jobId}`,
      sk: `set-notices-for-trial-session-job-${jobId}`,
    },
    applicationContext,
  });
