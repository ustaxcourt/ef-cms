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

  it('should retry a failed mailing', async () => {
    applicationContext
      .getEmailClient()
      .sendBulkTemplatedEmail.mockReturnValueOnce({
        promise: () =>
          Promise.resolve({
            ResponseMetadata: {
              RequestId:
                '01000176a9ec8d81-a80255bb-8ab4-4049-ba1f-6abd5b7a8098-000000',
            },
            Status: [
              {
                MessageId:
                  '01000176a9ec8d81-a80255bb-8ab4-4049-ba1f-6abd5b7a8098-000000',
                Status: 'Success',
              },
              {
                Error: 'Unknown error occurred. Please try again later',
                Status: 'Failed',
              },
              {
                Error: 'Unknown error occurred. Please try again later',
                Status: 'Failed',
              },
            ],
          }),
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
        {
          email: 'test.email2@example.com',
          templateData: {
            name: 'Guy Fieri',
            welcomeMessage: 'Welcome to Flavortown',
            whoAmI: 'The Sauce Boss',
          },
        },
        {
          email: 'test.email3@example.com',
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
        .calls[1][0],
    ).toMatchObject({
      Destinations: [
        {
          Destination: {
            ToAddresses: ['test.email2@example.com'],
          },
          ReplacementTemplateData: JSON.stringify({
            name: 'Guy Fieri',
            welcomeMessage: 'Welcome to Flavortown',
            whoAmI: 'The Sauce Boss',
          }),
        },
        {
          Destination: {
            ToAddresses: ['test.email3@example.com'],
          },
          ReplacementTemplateData: JSON.stringify({
            name: 'Guy Fieri',
            welcomeMessage: 'Welcome to Flavortown',
            whoAmI: 'The Sauce Boss',
          }),
        },
      ],
    });
    expect(
      applicationContext.getEmailClient().sendBulkTemplatedEmail,
    ).toHaveBeenCalledTimes(2);
  });

  it('should retry a failed mailing 10 times, and then throw an error', async () => {
    applicationContext.getEmailClient().sendBulkTemplatedEmail.mockReturnValue({
      promise: () =>
        Promise.resolve({
          ResponseMetadata: {
            RequestId:
              '01000176a9ec8d81-a80255bb-8ab4-4049-ba1f-6abd5b7a8098-000000',
          },
          Status: [
            {
              Error: 'Unknown error occurred. Please try again later',
              Status: 'Failed',
            },
            {
              Error: 'Unknown error occurred. Please try again later',
              Status: 'Failed',
            },
            {
              Error: 'Unknown error occurred. Please try again later',
              Status: 'Failed',
            },
          ],
        }),
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
        {
          email: 'test.email2@example.com',
          templateData: {
            name: 'Guy Fieri',
            welcomeMessage: 'Welcome to Flavortown',
            whoAmI: 'The Sauce Boss',
          },
        },
        {
          email: 'test.email3@example.com',
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
      applicationContext.getEmailClient().sendBulkTemplatedEmail,
    ).toHaveBeenCalledTimes(7);
    expect(applicationContext.logger.error).toHaveBeenCalledTimes(1);
    expect(applicationContext.logger.error.mock.calls[0][0]).toEqual(
      'Error sending email: Could not complete service to test.email@example.com,test.email2@example.com,test.email3@example.com',
    );
  }, 30000);
});
