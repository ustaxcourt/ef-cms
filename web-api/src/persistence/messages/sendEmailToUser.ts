import {
  type SESClient,
  SendEmailCommand,
  type SendEmailCommandOutput,
} from '@aws-sdk/client-ses';
import type { ServerApplicationContext } from '@web-api/applicationContext';

export const sendEmailToUser = (
  applicationContext: ServerApplicationContext,
  {
    body,
    subject,
    to,
  }: {
    body: string;
    subject: string;
    to: string;
  },
): Promise<SendEmailCommandOutput> => {
  const charset = 'UTF-8';
  const cmd = new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: charset,
          Data: body,
        },
      },
      Subject: {
        Charset: charset,
        Data: subject,
      },
    },
    ReplyToAddresses: [],
    Source: applicationContext.environment.emailFromAddress,
  });

  const sesClient = applicationContext.getEmailClient() as SESClient;
  const ret = sesClient.send(cmd);
  return ret;
};
