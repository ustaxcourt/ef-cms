const sinon = require('sinon');
const { sendBulkTemplatedEmail } = require('./sendBulkTemplatedEmail');

describe('sendBulkTemplatedEmail', () => {
  const sendBulkTemplatedEmailStub = sinon.stub().returns({
    promise: () => {
      return Promise.resolve();
    },
  });

  const sendBulkTemplatedEmailThrowsErrorStub = sinon.stub().returns({
    promise: () => {
      return Promise.reject('Something bad happened!');
    },
  });

  const loggerErrorStub = sinon.stub().returns(() => {});

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

    expect(sendBulkTemplatedEmailStub.getCall(0).args[0]).toMatchObject({
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

    expect(loggerErrorStub.calledOnce).toBe(true);
  });
});
