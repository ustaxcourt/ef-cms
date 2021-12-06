const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { sendNotificationOfSealing } = require('./sendNotificationOfSealing');

describe('send notification to notification service', () => {
  const OLD_ENV = process.env;
  const publish = jest
    .fn()
    .mockReturnValue({ promise: () => Promise.resolve('ok') });

  beforeEach(() => {
    applicationContext.getNotificationService.mockImplementation(() => {
      return { publish };
    });
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV;
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
