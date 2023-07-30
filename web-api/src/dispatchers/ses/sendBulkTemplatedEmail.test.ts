import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import {
  sendBulkTemplatedEmail,
  sendWithRetry,
} from './sendBulkTemplatedEmail';

// testApplicationContext relies on getConstants.js -- not web-api's
// https://trello.com/c/xi5TPQYl/908-getconstants-for-applicationcontext-is-markedly-different-for-testapplicationcontext
const appConstants = applicationContext.getConstants();
applicationContext.getConstants = () => ({
  ...appConstants,
  MAX_SES_RETRIES: 6,
});

describe('sendBulkTemplatedEmail', () => {
  it('sends the bulk email given a template', async () => {
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
      applicationContext.getMessageGateway().sendEmailEventToQueue.mock
        .calls[0][0].emailParams,
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
  });

  it('should log when an error occurs sending the bulk email', async () => {
    applicationContext
      .getMessageGateway()
      .sendEmailEventToQueue.mockRejectedValue(
        new Error('Something bad happened!'),
      );

    await expect(
      sendBulkTemplatedEmail({
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
      }),
    ).rejects.toEqual(new Error('Something bad happened!'));
    expect(applicationContext.logger.error.mock.calls.length).toEqual(1);
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
      })
      .mockReturnValueOnce({
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
                MessageId:
                  '01000176a9ec8d81-a80255bb-8ab4-4049-ba1f-6abd5b7a8098-000000',
                Status: 'Success',
              },
            ],
          }),
      });

    await sendWithRetry({
      applicationContext,
      params: {
        Destinations: [
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
        TemplateName: 'case_served',
      },
    });
    expect(
      applicationContext.getEmailClient().sendBulkTemplatedEmail,
    ).toHaveBeenCalledTimes(2);
  });

  it('should retry a failed mailing MAX_SES_RETRIES times (MAX_SES_RETRIES + 1 total attempts), and then log an error', async () => {
    const { MAX_SES_RETRIES } = applicationContext.getConstants();

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

    await expect(
      sendWithRetry({
        applicationContext,
        params: {
          Destinations: [
            {
              Destination: {
                ToAddresses: ['test.email@example.com'],
              },
            },
            {
              Destination: {
                ToAddresses: ['test.email2@example.com'],
              },
            },
            {
              Destination: {
                ToAddresses: ['test.email3@example.com'],
              },
            },
          ],
          TemplateName: 'case_served',
        },
      }),
    ).rejects.toEqual(
      'Could not complete service to test.email@example.com,test.email2@example.com,test.email3@example.com',
    );
    expect(
      applicationContext.getEmailClient().sendBulkTemplatedEmail,
    ).toHaveBeenCalledTimes(MAX_SES_RETRIES + 1);
  }, 30000);
});
