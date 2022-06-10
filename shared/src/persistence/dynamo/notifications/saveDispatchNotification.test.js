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

  it('attempts to persist the notification of a dispatched message to a specified topic', async () => {
    await saveDispatchNotification({
      applicationContext,
      topic: 'test-topic',
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: 'dispatch-notification',
        sk: 'test-topic',
        ttl: expect.anything(),
      },
      applicationContext: expect.anything(),
    });
  });

  it('adds five minutes to the current time to determine the ttl value for this record', async () => {
    const fiveMinutesFromNow = Math.floor(Date.now() / 1000) + 5 * 60;
    const sixMinutesFromNow = Math.floor(Date.now() / 1000) + 6 * 60;

    await saveDispatchNotification({
      applicationContext,
      topic: 'test-topic',
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0].Item.ttl,
    ).toBeGreaterThanOrEqual(fiveMinutesFromNow);
    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0].Item.ttl,
    ).toBeLessThan(sixMinutesFromNow);
  });
});
