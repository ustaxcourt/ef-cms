import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { retryUpdateTrialSessionAction } from './retryUpdateTrialSessionAction';
import { runAction } from 'cerebral/test';

describe('retryUpdateTrialSessionAction', () => {
  // this should receive an object to retry
  presenter.providers.applicationContext = applicationContext;
  let mockCall;
  const mockOriginalRequest = {
    foo: 'bar',
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

  it('should call the updateTrialSessionInteractor with the originalRequest that it received', async () => {
    await runAction(retryUpdateTrialSessionAction, mockCall);
    expect(
      applicationContext.getUseCases().updateTrialSessionInteractor.mock
        .calls[0][1],
    ).toMatchObject(mockOriginalRequest);
  });

  it('should wait a default of 3 seconds', async () => {
    await runAction(retryUpdateTrialSessionAction, {
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

  it('should wait the specified amount of time', async () => {
    await runAction(retryUpdateTrialSessionAction, {
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
