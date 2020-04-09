const { sendBulkTemplatedEmail } = require('./sendBulkTemplatedEmail');

describe('sendBulkTemplatedEmail', () => {
  const sendBulkTemplatedEmailStub = jest.fn().mockReturnValue({
    promise: () => {
      return Promise.resolve();
    },
  });

  const sendBulkTemplatedEmailThrowsErrorStub = jest.fn().mockReturnValue({
    promise: () => {
      return Promise.reject('Something bad happened!');
    },
  });

  const loggerErrorStub = jest.fn().mockReturnValue(() => {});

  it('sends the bulk email given a template', async () => {
    let applicationContext = {
      getEmailClient: () => ({
        sendBulkTemplatedEmail: sendBulkTemplatedEmailStub,
      }),
      logger: {
        error: () => null,
        info: () => null,
      },
    };

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

    expect(sendBulkTemplatedEmailStub.mock.calls[0][0]).toMatchObject({
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
  });

  it('should log when an error occurs sending the bulk email', async () => {
    let applicationContext = {
      getEmailClient: () => ({
        sendBulkTemplatedEmail: sendBulkTemplatedEmailThrowsErrorStub,
      }),
      logger: {
        error: loggerErrorStub,
        info: () => null,
      },
    };

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

    expect(loggerErrorStub.mock.calls.length).toEqual(1);
  });
});
