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
  destinations: { email: string; templateData?: { [key: string]: any } }[];
  templateName?: string;
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

const getDocketNumber = ({
  applicationContext,
  templateData,
}: {
  applicationContext: ServerApplicationContext;
  templateData?: string;
}): string | undefined => {
  if (!templateData) return undefined;

  let parsedTemplateData: unknown;
  try {
    parsedTemplateData = JSON.parse(templateData);
  } catch (error) {
    applicationContext.logger.warn(
      'Unable to parse template data for bulk email response log',
      error,
    );
    return undefined;
  }

  if (
    typeof parsedTemplateData !== 'object' ||
    parsedTemplateData === null ||
    !('docketNumber' in parsedTemplateData)
  ) {
    return undefined;
  }

  return typeof parsedTemplateData.docketNumber === 'string'
    ? parsedTemplateData.docketNumber
    : undefined;
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
  const testEmailDomains = ['@ustc.gov', '@example.com'];
  const sesClient: SESClient = applicationContext.getEmailClient();
  const { MAX_SES_RETRIES } = applicationContext.getConstants();

  applicationContext.logger.info('Bulk Email Params', params);

  const validDestinations: BulkEmailDestination[] = [];
  params.Destinations?.forEach(bulkDestination => {
    let sendingToTestEmail = false;
    bulkDestination.Destination?.ToAddresses?.forEach(addr => {
      testEmailDomains.forEach(testEmail => {
        if (addr.includes(testEmail)) sendingToTestEmail = true;
      });
    });
    if (!sendingToTestEmail) validDestinations.push(bulkDestination);
    else
      applicationContext.logger.info(
        'Test destination found, removing destination',
        bulkDestination,
      );
  });
  if (validDestinations.length === 0) {
    applicationContext.logger.info(
      'No valid destinations found, exiting',
      params,
    );
    return;
  }
  params.Destinations = validDestinations;

  const cmd = new SendBulkTemplatedEmailCommand(params);
  const response = await sesClient.send(cmd);
  const defaultDocketNumber = getDocketNumber({
    applicationContext,
    templateData: params.DefaultTemplateData,
  });
  const responseWithDestinationDetails = {
    ...response,
    Status: response.Status?.map((attempt, index) => {
      const destination = params.Destinations?.[index];
      if (!destination) return attempt;

      const docketNumber =
        getDocketNumber({
          applicationContext,
          templateData: destination.ReplacementTemplateData,
        }) ?? defaultDocketNumber;
      const recipientEmails = destination.Destination?.ToAddresses;

      return {
        ...attempt,
        ...(recipientEmails && { recipientEmails }),
        ...(docketNumber && { docketNumber }),
      };
    }),
  };
  applicationContext.logger.info(
    'Bulk Email Response',
    responseWithDestinationDetails,
  );

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
