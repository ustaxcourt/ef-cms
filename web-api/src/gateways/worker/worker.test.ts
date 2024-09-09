import {
  MESSAGE_TYPES,
  WorkerMessage,
} from '@web-api/gateways/worker/workerRouter';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { worker } from '@web-api/gateways/worker/worker';

describe('worker', () => {
  it('should use the messaging service to send the provided message to the environment`s message queue', async () => {
    const mockMessage: WorkerMessage = {
      authorizedUser: {
        email: 'person@hello.com',
        name: 'ignored',
        role: 'adc',
        userId: 'ignored',
      },
      payload: {
        abc: 'def',
      },
      type: MESSAGE_TYPES.QUEUE_UPDATE_ASSOCIATED_CASES,
    };
    const mockQueueUrl = 'www.send_a_message.com';
    applicationContext.environment.workerQueueUrl = mockQueueUrl;

    await worker(applicationContext, {
      message: mockMessage,
    });

    expect(applicationContext.getMessagingClient().send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          MessageBody: JSON.stringify(mockMessage),
          QueueUrl: mockQueueUrl,
        },
      }),
    );
  });
});
