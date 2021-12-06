const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { sendNotificationOfSealing } = require('./sendNotificationOfSealing');

const tempEnvironmentVariables = {
  AWS_ACCOUNT_ID: process.env.AWS_ACCOUNT_ID,
  PROD_ENV_ACCOUNT_ID: process.env.PROD_ENV_ACCOUNT_ID,
};

describe('send notification to notification service', () => {
  const publish = jest
    .fn()
    .mockReturnValue({ promise: () => Promise.resolve('ok') });

  beforeEach(() => {
    applicationContext.getNotificationService.mockImplementation(() => {
      return { publish };
    });
  });

  afterAll(() => {
    process.env.AWS_ACCOUNT_ID = tempEnvironmentVariables.AWS_ACCOUNT_ID;
    process.env.PROD_ENV_ACCOUNT_ID =
      tempEnvironmentVariables.PROD_ENV_ACCOUNT_ID;
  });

  it('should send notification if we are in the production environment', async () => {
    process.env.PROD_ENV_ACCOUNT_ID = '123';
    process.env.AWS_ACCOUNT_ID = '123';

    await sendNotificationOfSealing(applicationContext, {
      docketNumber: '123-21',
    });

    expect(
      applicationContext.getNotificationService().publish.mock.calls[0][0]
        .Message,
    ).toBe(
      JSON.stringify({ docketEntryId: undefined, docketNumber: '123-21' }),
    );
  });

  it('should NOT send notification if we are NOT in the production environment', async () => {
    process.env.PROD_ENV_ACCOUNT_ID = '123';
    process.env.AWS_ACCOUNT_ID = '789';
    await sendNotificationOfSealing(applicationContext, {
      docketNumber: '123-21',
    });

    expect(
      applicationContext.getNotificationService().publish,
    ).not.toBeCalled();
  });
});
