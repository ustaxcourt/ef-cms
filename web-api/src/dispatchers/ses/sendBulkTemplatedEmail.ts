import {
  type BulkEmailDestination,
  type SESClient,
  SendBulkTemplatedEmailCommand,
  type SendBulkTemplatedEmailCommandInput,
} from '@aws-sdk/client-ses';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { backOff } from '@shared/tools/helpers';
import { environment } from '@web-api/environment';

/**
 * calls SES.sendBulkTemplatedEmail
 *
 * destinations = [
 *   {
 *      email: 'mayor@flavortown.com',
 *      templateData: { myCustomVar1: 'value', myCustomVar2: 'value' }
 *   }
 * ]
 *
 * For each key in 'templateData', we must have default template data values:
 * defaultTemplateData: {
 *   myCustomVar1: 'undefined',
 *   myCustomVar2: 'undefined'
 * }
 */
export const sendBulkTemplatedEmail = async ({
  applicationContext,
  defaultTemplateData,
  destinations,
  templateName,
}: {
  applicationContext: ServerApplicationContext;
  defaultTemplateData: { [key: string]: any };
  destinations: { email: string; templateData: { [key: string]: any } }[];
  templateName: string;
}): Promise<void> => {
  try {
    const params: SendBulkTemplatedEmailCommandInput = {
      DefaultTemplateData: JSON.stringify(defaultTemplateData),
      Destinations: destinations.map(destination => ({
        Destination: {
          ToAddresses: [destination.email],
        },
        ReplacementTemplateData: JSON.stringify(destination.templateData),
      })),
      ReturnPath: environment.bouncedEmailRecipient,
      Source: applicationContext.environment.emailFromAddress,
      Template: templateName,
    };

    await applicationContext.getMessageGateway().sendEmailEventToQueue({
      applicationContext,
      emailParams: params,
    });
  } catch (err) {
    applicationContext.logger.error(`Error sending email: ${err}`, err);
    throw err;
  }
};

export const sendWithRetry = async ({
  applicationContext,
  params,
  retryCount = 0,
}: {
  applicationContext: ServerApplicationContext;
  params: SendBulkTemplatedEmailCommandInput;
  retryCount: number;
}) => {
  const sesClient: SESClient = applicationContext.getEmailClient();
  const { MAX_SES_RETRIES } = applicationContext.getConstants();

  applicationContext.logger.info('Bulk Email Params', params);

  const cmd = new SendBulkTemplatedEmailCommand(params);
  const response = await sesClient.send(cmd);
  applicationContext.logger.info('Bulk Email Response', response);

  // parse response from AWS
  const needToRetry: BulkEmailDestination[] = [];
  response.Status?.map((attempt, index) => {
    // AWS returns 'Success' and helpful identifier upon successful delivery
    if (
      attempt.Status !== 'Success' &&
      !!(params.Destinations && params.Destinations[index])
    ) {
      needToRetry.push(params.Destinations[index]);
    }
  });

  if (!needToRetry || needToRetry.length === 0) {
    return;
  }

  if (retryCount >= MAX_SES_RETRIES) {
    const failures = needToRetry
      .map(dest =>
        dest.Destination?.ToAddresses && dest.Destination.ToAddresses[0]
          ? dest.Destination.ToAddresses[0]
          : 'undefined',
      )
      .join(',');
    throw `Could not complete service to ${failures}`;
  }

  // exponential back-off
  await backOff(retryCount);

  await sendWithRetry({
    applicationContext,
    params: {
      ...params,
      Destinations: needToRetry,
    },
    retryCount: retryCount + 1,
  });
};
