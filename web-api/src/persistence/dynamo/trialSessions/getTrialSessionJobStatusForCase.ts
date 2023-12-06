import { get } from '../../dynamodbClientService';

/**
 * getTrialSessionJobStatusForCase
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.jobId the unique jobId for this job
 * @returns {Promise} the promise of the call to persistence
 */
export const getTrialSessionJobStatusForCase = ({
  applicationContext,
  jobId,
}: {
  applicationContext: IApplicationContext;
  jobId: string;
}) =>
  get({
    ConsistentRead: true,
    Key: {
      pk: `set-notices-for-trial-session-job-${jobId}`,
      sk: `set-notices-for-trial-session-job-${jobId}`,
    },
    applicationContext,
  });
