import { decrementCounter } from '../helpers/decrementCounter';

/**
 * createJobStatus
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.jobId the unique jobId for this job
 * @returns {Promise} the promise of the call to persistence
 */
export const decrementJobCounter = ({
  applicationContext,
  jobId,
}: {
  applicationContext: IApplicationContext;
  jobId: string;
}) =>
  decrementCounter({
    applicationContext,
    counterKey: 'unfinishedCases',
    pk: `set-notices-for-trial-session-job-${jobId}`,
    sk: `set-notices-for-trial-session-job-${jobId}`,
  });
