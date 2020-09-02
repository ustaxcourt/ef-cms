const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { sendBulkTemplatedEmail } = require('./sendBulkTemplatedEmail');

describe('sendBulkTemplatedEmail', () => {
  it('sends the bulk email given a template', async () => {
    applicationContext.getEmailClient().sendBulkTemplatedEmail.mockReturnValue({
      promise: () => Promise.resolve('hi'),
    });

    await sendBulkTemplatedEmail({
      applicationContext,
      destinations: [
        {
          email: 'test.email@example.com',
          templateData: {
            name: 'Guy Fieri',
            welcomeMessage: 'Welcome to Flavortown',
            whoAmI: 'The Sauce Boss',
          },
        },
      ],
      templateName: 'case_served',
    });

    expect(
      applicationContext.getEmailClient().sendBulkTemplatedEmail.mock
        .calls[0][0],
    ).toMatchObject({
      Destinations: [
        {
          Destination: {
            ToAddresses: ['test.email@example.com'],
          },
          ReplacementTemplateData: JSON.stringify({
            name: 'Guy Fieri',
            welcomeMessage: 'Welcome to Flavortown',
            whoAmI: 'The Sauce Boss',
          }),
        },
      ],
      Template: 'case_served',
    });
    expect(applicationContext.logger.info).toHaveBeenCalledTimes(2);
  });

  it('should log when an error occurs sending the bulk email', async () => {
    applicationContext
      .getEmailClient()
      .sendBulkTemplatedEmail.mockImplementation({
        promise: () => {
          return Promise.reject('Something bad happened!');
        },
      });

    await sendBulkTemplatedEmail({
      applicationContext,
      destinations: [
        {
          email: 'test.email@example.com',
          templateData: {
            name: 'Guy Fieri',
            welcomeMessage: 'Welcome to Flavortown',
            whoAmI: 'The Sauce Boss',
          },
        },
      ],
      templateName: 'case_served',
    });

    expect(applicationContext.logger.error.mock.calls.length).toEqual(1);
    expect(applicationContext.logger.info).toHaveBeenCalledTimes(1);
  });
});
