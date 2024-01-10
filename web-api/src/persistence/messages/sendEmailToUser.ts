export const sendEmailToUser = async (
  applicationContext,
  {
    body,
    subject,
    to,
  }: {
    body: string;
    subject: string;
    to: string;
  },
): Promise<string> => {
  return await applicationContext
    .getEmailClient()
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
      Source: process.env.EMAIL_SOURCE!,
    })
    .promise();
};
