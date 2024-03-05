import { APIGatewayProxyEvent } from 'aws-lambda';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { createApplicationContext } from '@web-api/applicationContext';
import { genericHandler } from '../../genericHandler';

/**
 * batch download trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const batchDownloadTrialSessionLambda = (event: APIGatewayProxyEvent) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionId } = event.pathParameters || event.path;

    // const { region } = applicationContext.environment;
    console.log('******* ' + trialSessionId);
    const client = new LambdaClient({
      region: 'us-east-1',
    });
    const user = applicationContext.getCurrentUser();
    const command = new InvokeCommand({
      FunctionName:
        'zach-ef-cms-api-Site-batchDownloadFunctionAE7C1BEB-OA4iWlDSKM47',
      InvocationType: 'Event',
      Payload: JSON.stringify({ payload: { trialSessionId }, user }),
    });
    console.log('******* sending command to lambda');
    await client.send(command);
    console.log('******* done sending command');
  });

export const batchDownloadTrialSessionHandler = async (event: {
  user: any;
  payload: {
    trialSessionId: string;
  };
}) => {
  console.log(event);
  const applicationContext = createApplicationContext(event.user);

  await applicationContext
    .getUseCases()
    .batchDownloadTrialSessionInteractor(applicationContext, event.payload);

  return null;
};
