import { InvokeCommand } from '@aws-sdk/client-lambda';
import { type ServerApplicationContext } from '@web-api/applicationContext';
import { getLambdaClient } from '@web-api/gateways/lambda/getLambdaClient';

export const reinvoke = async (
  applicationContext: ServerApplicationContext,
  { functionName, originalEvent }: { functionName: string; originalEvent: any },
) => {
  applicationContext.logger.info(`Retrying Lambda: ${functionName}`);
  await getLambdaClient().send(
    new InvokeCommand({
      FunctionName: functionName,
      InvocationType: 'Event',
      Payload: Buffer.from(JSON.stringify(originalEvent)),
    }),
  );
};
