const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { saveDispatchNotification } = require('./saveDispatchNotification');

describe('saveDispatchNotification', () => {
  beforeAll(() => {
    applicationContext.getDocumentClient().put.mockReturnValue({
      promise: () => Promise.resolve(null),
    });
  });

  it('attempts to persist the notification of a dispatched message to a specified channel', async () => {
    await saveDispatchNotification({
      applicationContext,
      channel: 'test-channel',
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: 'dispatch-notification',
        sk: 'test-channel',
        ttl: expect.anything(),
      },
      applicationContext: expect.anything(),
    });
  });
});
