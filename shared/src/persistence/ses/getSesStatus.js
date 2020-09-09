exports.getSesStatus = async ({ applicationContext }) => {
  const SES = applicationContext.getEmailClient();

  try {
    await SES.sendEmail({
      Destination: {
        ToAddresses: ['test@example.com'],
      },
      Message: {
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: 'This is a test status email.',
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Test email',
        },
      },
      Source: process.env.EMAIL_SOURCE,
    }).promise();

    return true;
  } catch (err) {
    console.log('error sending the ses email', err);
    return false;
  }
};
