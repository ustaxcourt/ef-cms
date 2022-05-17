const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getDispatchNotification } = require('./getDispatchNotification');

describe('getDispatchNotification', () => {
  beforeEach(() => {
    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: () => Promise.resolve([]),
    });
  });

  it('attempts to retrieve the notification for a dispatched message', async () => {
    const result = await getDispatchNotification({
      applicationContext,
      topic: 'test-topic',
    });

    expect(applicationContext.getDocumentClient().query).toHaveBeenCalledWith(
      expect.objectContaining({
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
          '#ttl': 'ttl',
        },
        ExpressionAttributeValues: {
          ':currentEpoch': expect.anything(),
          ':pk': 'dispatch-notification',
          ':sk': 'test-topic',
        },
        FilterExpression: '#ttl >= :currentEpoch',
        KeyConditionExpression: '#pk = :pk AND #sk = :sk',
      }),
    );
    expect(result).toEqual([]);
  });
});
