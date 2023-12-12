import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getDispatchNotification } from './getDispatchNotification';

describe('getDispatchNotification', () => {
  beforeEach(() => {
    applicationContext.getDocumentClient().get.mockResolvedValue([]);
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

  it('uses the current date time as a way to filter records out with a lower time to live', async () => {
    await getDispatchNotification({
      applicationContext,
      topic: 'test-topic',
    });

    const anHourAgo = Date.now() / 1000 - 3600;
    expect(
      applicationContext.getDocumentClient().query.mock.calls[0][0]
        .ExpressionAttributeValues[':currentEpoch'],
    ).toBeGreaterThan(anHourAgo);
    expect(
      applicationContext.getDocumentClient().query.mock.calls[0][0]
        .FilterExpression,
    ).toBe('#ttl >= :currentEpoch');
  });
});
