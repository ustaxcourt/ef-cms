import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { sendNotificationOfSealing } from './sendNotificationOfSealing';

describe('send notification to notification service', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should send notification with the supplied docketNumber', async () => {
    process.env.AWS_ACCOUNT_ID = '123456';

    await sendNotificationOfSealing(applicationContext, {
      docketNumber: '321-21',
    });

    expect(
      applicationContext.getNotificationService().publish.mock.calls[0][0]
        .Message,
    ).toBe(
      JSON.stringify({ docketEntryId: undefined, docketNumber: '321-21' }),
    );
    expect(
      applicationContext.getNotificationService().publish.mock.calls[0][0]
        .TopicArn,
    ).toBe('arn:aws:sns:us-east-1:123456:seal_notifier');
  });
});
