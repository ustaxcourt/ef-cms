import type { SES } from 'aws-sdk';
import type { ServerApplicationContext } from '@web-api/applicationContext';

export const sendEmailToUser = async (
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
): Promise<void> => {
  await (applicationContext.getEmailClient() as SES)
    .sendEmail({
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Data: body,
          },
        },
        Subject: {
          Data: subject,
        },
      },
      Source: applicationContext.environment.emailFromAddress,
    })
    .promise();
};
