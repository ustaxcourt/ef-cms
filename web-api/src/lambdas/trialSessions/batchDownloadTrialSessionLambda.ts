import { APIGatewayProxyEvent } from 'aws-lambda';
import { genericHandler } from '../../genericHandler';
import { getAsyncGateway } from '@web-api/asyncGateway';

export const batchDownloadTrialSessionLambda = (event: APIGatewayProxyEvent) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionId } = event.pathParameters || event.path;
    const user = applicationContext.getCurrentUser();

    await getAsyncGateway().runAsync(applicationContext, {
      payload: { trialSessionId },
      type: 'BATCH_DOWNLOAD_TRIAL_SESSION',
      user,
    });
  });
