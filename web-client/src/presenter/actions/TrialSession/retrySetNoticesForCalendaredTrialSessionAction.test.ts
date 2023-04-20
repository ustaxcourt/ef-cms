import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { retrySetNoticesForCalendaredTrialSessionAction } from './retrySetNoticesForCalendaredTrialSessionAction';
import { runAction } from 'cerebral/test';

describe('retrySetNoticesForCalendaredTrialSessionAction', () => {
  // this should receive an object to retry
  presenter.providers.applicationContext = applicationContext;
  let mockCall;
  applicationContext.getUseCases().setNoticesForCalendaredTrialSessionInteractor =
    jest.fn();
  const mockOriginalRequest = { trialSessionId: '123' };

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

  it('should call the setNoticesForCalendaredTrialSessionInteractor with the originalRequest that it received', async () => {
    await runAction(retrySetNoticesForCalendaredTrialSessionAction, mockCall);
    expect(
      applicationContext.getUseCases()
        .setNoticesForCalendaredTrialSessionInteractor.mock.calls[0][1],
    ).toMatchObject(mockOriginalRequest);
  });

  it('should wait a default of 3 seconds before calling setNoticesForCalendaredTrialSessionInteractor', async () => {
    await runAction(retrySetNoticesForCalendaredTrialSessionAction, mockCall);
    expect(applicationContext.getUtilities().sleep).toHaveBeenCalledWith(3000);
  });

  it('should wait the specified amount of time before calling setNoticesForCalendaredTrialSessionInteractor', async () => {
    mockCall.props.retryAfter = 5000;
    await runAction(retrySetNoticesForCalendaredTrialSessionAction, mockCall);
    expect(applicationContext.getUtilities().sleep).toHaveBeenCalledWith(5000);
  });
});
