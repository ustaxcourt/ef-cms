import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { retryVerifyUserPendingEmailAction } from './retryVerifyUserPendingEmailAction';
import { runAction } from 'cerebral/test';

describe('retryVerifyUserPendingEmailAction', () => {
  // this should receive an object to retry
  presenter.providers.applicationContext = applicationContext;
  let mockCall;
  const mockOriginalRequest = {
    clientConnectionId: 'abc123',
    consolidatedGroupDocketNumbers: ['222-22', '333-33'],
    docketEntryId: 'abc123',
    documentMetadata: {
      docketNumber: '111-11',
    },
    isSavingForLater: false,
  };

  beforeEach(() => {
    mockCall = {
      modules: {
        presenter,
      },
      props: {
        originalRequest: mockOriginalRequest,
      },
      state: {
        form: {},
      },
    };
  });

  it('should call the verifyUserPendingEmailInteractor with the originalRequest that it received', async () => {
    await runAction(retryVerifyUserPendingEmailAction, mockCall);
    expect(
      applicationContext.getUseCases().verifyUserPendingEmailInteractor.mock
        .calls[0][1],
    ).toMatchObject(mockOriginalRequest);
  });

  it('should wait a default of 3 seconds before calling verifyUserPendingEmailInteractor', async () => {
    await runAction(retryVerifyUserPendingEmailAction, {
      modules: {
        presenter,
      },
      props: {
        originalRequest: mockOriginalRequest,
      },
      state: {
        form: {},
      },
    });
    expect(applicationContext.getUtilities().sleep).toHaveBeenCalledWith(3000);
  });

  it('should wait the specified amount of time before calling verifyUserPendingEmailInteractor', async () => {
    await runAction(retryVerifyUserPendingEmailAction, {
      modules: {
        presenter,
      },
      props: {
        mockOriginalRequest,
        retryAfter: 5000,
      },
      state: {
        form: {},
      },
    });
    expect(applicationContext.getUtilities().sleep).toHaveBeenCalledWith(5000);
  });
});
