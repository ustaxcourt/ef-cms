import { type SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type { ServerApplicationContext } from '@web-api/applicationContext';

export type EmailResponse = {
  MessageId: string | undefined;
  [key: string]: any;
};

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
): Promise<EmailResponse> => {
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
  return sesClient.send(cmd);
};
