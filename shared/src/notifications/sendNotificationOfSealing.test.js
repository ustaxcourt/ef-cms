const {
  applicationContext,
} = require('../business/test/createTestApplicationContext');
const { sendNotificationOfSealing } = require('./sendNotificationOfSealing');

describe('send notification to notification service', () => {
  const publish = jest
    .fn()
    .mockReturnValue({ promise: () => Promise.resolve('ok') });

  beforeEach(() => {
    applicationContext.getNotificationService.mockImplementation(() => {
      console.log('wat');
      return { publish };
    });
  });

  it('should send notification if we are in the production environment', async () => {
    applicationContext.environment.stage = 'prod';

    await sendNotificationOfSealing({
      applicationContext,
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
    applicationContext.environment.stage = 'test';
    await sendNotificationOfSealing({
      applicationContext,
      docketNumber: '123-21',
    });

    expect(
      applicationContext.getNotificationService().publish,
    ).not.toBeCalled();
  });
});
