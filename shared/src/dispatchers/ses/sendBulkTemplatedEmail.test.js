const sinon = require('sinon');
const { sendBulkTemplatedEmail } = require('./sendBulkTemplatedEmail');

describe('sendBulkTemplatedEmail', () => {
  const sendBulkTemplatedEmailStub = sinon.stub().returns({
    promise: () => {
      return Promise.resolve();
    },
  });

  it('sends the bulk email given a template', async () => {
    let applicationContext = {
      getEmailClient: () => ({
        sendBulkTemplatedEmail: sendBulkTemplatedEmailStub,
      }),
      logger: {
        error: () => null,
      },
    };

    await sendBulkTemplatedEmail({
      applicationContext,
      destinations: [
        {
          email: 'test.email@gmail.com',
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
            ToAddresses: ['test.email@gmail.com'],
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
});
