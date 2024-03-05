import { approvePendingJob } from '../../../../admin-tools/circleci/circleci-helper';

export const processCompletionMarkers = async ({
  applicationContext,
  completionMarkers,
}: {
  applicationContext: IApplicationContext;
  completionMarkers: any[];
}) => {
  if (!completionMarkers || !completionMarkers.length) return;

  applicationContext.logger.debug(
    `found ${completionMarkers.length} completion marker${
      completionMarkers.length > 1 ? 's' : ''
    }`,
  );

  const stage = process.env.STAGE || 'local';

  for (const cm of completionMarkers) {
    const completionMarker = cm.dynamodb?.NewImage;
    if (completionMarker) {
      const [apiToken, environment, jobName, workflowId] = [
        'apiToken',
        'environment',
        'jobName',
        'workflowId',
      ].map(key => completionMarker[key]?.S);
      if (
        environment &&
        environment === stage &&
        apiToken &&
        jobName &&
        workflowId
      ) {
        applicationContext.logger.debug(
          `approving pending ${jobName} job in circle`,
          {
            jobName,
            workflowId,
          },
        );
        if (stage !== 'local') {
          await approvePendingJob({ apiToken, jobName, workflowId });
        }
      }
    }
  }
};
