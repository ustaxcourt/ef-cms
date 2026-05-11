jest.mock('@web-api/dispatchers/lambda/reinvoke', () => ({
  reinvoke: jest.fn(),
}));

import {
  MESSAGE_TYPES,
  WorkerMessage,
  workerRouter,
} from '@web-api/gateways/worker/workerRouter';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { reinvoke } from '@web-api/dispatchers/lambda/reinvoke';

describe('workerRouter', () => {
  it('should make a call to update a user`s associated case when the message type is UPDATE_ASSOCIATED_CASE', async () => {
    const mockMessage: WorkerMessage = {
      authorizedUser: mockDocketClerkUser,
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
    ).toHaveBeenCalledWith(
      applicationContext,
      mockMessage.payload,
      mockMessage.authorizedUser,
    );
  });

  it('should make a call to queue a user`s associated cases for update when the message type is QUEUE_UPDATE_ASSOCIATED_CASES', async () => {
    const mockMessage: WorkerMessage = {
      authorizedUser: mockDocketClerkUser,
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
    ).toHaveBeenCalledWith(
      applicationContext,
      mockMessage.payload,
      mockMessage.authorizedUser,
    );
  });

  it('should make a call to queue a user`s email associated cases for update when the message type is QUEUE_EMAIL_UPDATE_ASSOCIATED_CASES', async () => {
    const mockMessage: WorkerMessage = {
      authorizedUser: mockDocketClerkUser,
      payload: {
        abc: '123',
      },
      type: MESSAGE_TYPES.QUEUE_EMAIL_UPDATE_ASSOCIATED_CASES,
    };

    await workerRouter(applicationContext, {
      message: mockMessage,
    });

    expect(
      applicationContext.getUseCases().queueEmailUpdateAssociatedCasesWorker,
    ).toHaveBeenCalledWith(
      applicationContext,
      mockMessage.payload,
      mockMessage.authorizedUser,
    );
  });

  it('should call addCoversheetWorker when the message type is ADD_COVERSHEET', async () => {
    const mockMessage: WorkerMessage = {
      authorizedUser: mockDocketClerkUser,
      payload: {
        docketEntryId: '0000-0000-0000-0001',
        docketNumber: '101-25',
      },
      type: MESSAGE_TYPES.ADD_COVERSHEET,
    };

    await workerRouter(applicationContext, {
      message: mockMessage,
    });

    expect(
      applicationContext.getUseCases().addCoversheetWorker,
    ).toHaveBeenCalledWith(
      applicationContext,
      mockMessage.payload,
      mockMessage.authorizedUser,
    );
  });

  it('should throw an error when the message type provided was not recognized by the router', async () => {
    const mockMessage: WorkerMessage = {
      authorizedUser: mockDocketClerkUser,
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

  it('should invoke the reinvoke dispatcher with the functionName and originalEvent payload when the message type is RESCHEDULE_LAMBDA', async () => {
    const mockMessage: WorkerMessage = {
      authorizedUser: mockDocketClerkUser,
      payload: {
        functionName: 'check_for_ready_for_trial_cases_dev_blue',
        originalEvent: { Records: [{ data: 'something' }] },
        shouldBeIgnored: 'yes',
      },
      type: MESSAGE_TYPES.RESCHEDULE_LAMBDA,
    };

    await workerRouter(applicationContext, { message: mockMessage });

    expect(reinvoke).toHaveBeenCalledWith(applicationContext, {
      functionName: 'check_for_ready_for_trial_cases_dev_blue',
      originalEvent: { Records: [{ data: 'something' }] },
    });
    // Verify unrelated payload keys are not passed through
    const [, arg] = (reinvoke as jest.Mock).mock.calls[0];
    expect(arg.shouldBeIgnored).toBeUndefined();
  });
});
