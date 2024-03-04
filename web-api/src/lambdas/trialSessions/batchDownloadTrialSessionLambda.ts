import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { createApplicationContext } from '@web-api/applicationContext';
import { genericHandler } from '../../genericHandler';

/**
 * batch download trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const batchDownloadTrialSessionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionId } = event.pathParameters || event.path;

    const { currentColor, region, stage } = applicationContext.environment;
    const client = new LambdaClient({
      region,
    });
    const command = new InvokeCommand({
      FunctionName: `batch_download_${stage}_${currentColor}`,
      InvocationType: 'Event',
      Payload: JSON.stringify({ trialSessionId }),
    });
    await client.send(command);
  });

export const batchDownloadTrialSessionHandler = async event => {
  console.log(event);
  const applicationContext = createApplicationContext({});

  return await applicationContext
    .getUseCases()
    .batchDownloadTrialSessionInteractor(applicationContext, JSON.parse(event));
};
