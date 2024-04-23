import { approvePendingJob } from '../../../../admin-tools/circleci/circleci-helper';

export const processCompletionMarkers = async ({
  applicationContext,
  completionMarkers,
}: {
  applicationContext: IApplicationContext;
  completionMarkers: any[];
}) => {
  if (!completionMarkers || !completionMarkers.length) return;

  applicationContext.logger.info(
    `found ${completionMarkers.length} completion marker${completionMarkers.length > 1 ? 's' : ''}`,
  );

  const stage = process.env.STAGE || 'local';
  const color = process.env.CURRENT_COLOR!;

  for (const cm of completionMarkers) {
    const completionMarker = cm.dynamodb?.NewImage;
    if (completionMarker) {
      const [apiToken, deployingColor, environment, jobName, workflowId] = [
        'apiToken',
        'deployingColor',
        'environment',
        'jobName',
        'workflowId',
      ].map(key => completionMarker[key]?.S);
      if (
        environment &&
        environment === stage &&
        deployingColor &&
        deployingColor === color &&
        apiToken &&
        jobName &&
        workflowId
      ) {
        applicationContext.logger.info(
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
