import {
  MESSAGE_TYPES,
  WorkerMessage,
  workerRouter,
} from '@web-api/gateways/worker/workerRouter';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';

describe('workerRouter', () => {
  it('should make a call to update a user`s associated case when the message type is UPDATE_ASSOCIATED_CASE', async () => {
    const mockMessage: WorkerMessage = {
      payload: {
        abc: '123',
      },
      type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
    };

    await workerRouter(applicationContext, {
      message: mockMessage,
    });

    expect(
      applicationContext.getUseCases().updateAssociatedCaseWorker,
    ).toHaveBeenCalledWith(applicationContext, mockMessage.payload);
  });

  it('should make a call to queue a user`s associated cases for update when the message type is QUEUE_UPDATE_ASSOCIATED_CASES', async () => {
    const mockMessage: WorkerMessage = {
      payload: {
        abc: '123',
      },
      type: MESSAGE_TYPES.QUEUE_UPDATE_ASSOCIATED_CASES,
    };

    await workerRouter(applicationContext, {
      message: mockMessage,
    });

    expect(
      applicationContext.getUseCases().queueUpdateAssociatedCasesWorker,
    ).toHaveBeenCalledWith(applicationContext, mockMessage.payload);
  });

  it('should throw an error when the message type provided was not recognized by the router', async () => {
    const mockMessage: WorkerMessage = {
      payload: {
        abc: '123',
      },
      type: 'DOES_NOT_EXIST' as any,
    };

    await expect(
      workerRouter(applicationContext, {
        message: mockMessage,
      }),
    ).rejects.toThrow(
      `No matching router found for message: ${JSON.stringify(mockMessage)}`,
    );
  });
});
