import { AsyncMessage, asyncRouter } from '@web-api/asyncRouter';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { ServerApplicationContext } from '@web-api/applicationContext';

export function getAsyncGateway() {
  return {
    runAsync(
      applicationContext: ServerApplicationContext,
      message: AsyncMessage,
    ) {
      if (applicationContext.environment.stage === 'local') {
        return localAsync(applicationContext, message);
      }
      return realAsync(applicationContext, message);
    },
  };
}

export async function localAsync(
  applicationContext: ServerApplicationContext,
  message: AsyncMessage,
) {
  await asyncRouter(applicationContext, { message });
}

export async function realAsync(
  applicationContext: ServerApplicationContext,
  message: AsyncMessage,
) {
  const client = new LambdaClient({
    region: applicationContext.environment.region,
  });
  const command = new InvokeCommand({
    FunctionName: process.env.ASYNC_LAMBDA_NAME,
    InvocationType: 'Event',
    Payload: JSON.stringify(message),
  });
  await client.send(command);
}
