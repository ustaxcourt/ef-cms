const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getDispatchNotification } = require('./getDispatchNotification');

describe('getDispatchNotification', () => {
  beforeEach(() => {
    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Item: {
            pk: 'dispatch-notification',
            sk: 'test-channel',
          },
        }),
    });
  });

  it('attempts to retrieve the notification for a dispatched message', async () => {
    const result = await getDispatchNotification({
      applicationContext,
      channel: 'test-channel',
    });

    console.log(result);

    expect(applicationContext.getDocumentClient().get).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
