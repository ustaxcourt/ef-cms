import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { put } from '../../dynamodbClientService';
import { saveDispatchNotification } from './saveDispatchNotification';

jest.mock('../../dynamodbClientService');

const putMock = put as jest.Mock;

describe('saveDispatchNotification', () => {
  beforeAll(() => {
    putMock.mockResolvedValue(null);
  });

  it('attempts to persist the notification of a dispatched message to a specified topic', async () => {
    await saveDispatchNotification({
      applicationContext,
      topic: 'test-topic',
    });

    expect(putMock.mock.calls[0][0]).toMatchObject({
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

    expect(putMock.mock.calls[0][0].Item.ttl).toBeGreaterThanOrEqual(
      fiveMinutesFromNow,
    );
    expect(putMock.mock.calls[0][0].Item.ttl).toBeLessThan(sixMinutesFromNow);
  });
});
