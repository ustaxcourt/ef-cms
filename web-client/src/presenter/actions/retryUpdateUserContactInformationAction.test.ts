import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { retryUpdateUserContactInformationAction } from './retryUpdateUserContactInformationAction';
import { runAction } from 'cerebral/test';

describe('retryUpdateUserContactInformationAction', () => {
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

  it('should call the updateUserContactInformationInteractor with the originalRequest that it received', async () => {
    await runAction(retryUpdateUserContactInformationAction, mockCall);
    expect(
      applicationContext.getUseCases().updateUserContactInformationInteractor
        .mock.calls[0][1],
    ).toMatchObject(mockOriginalRequest);
  });

  it('should wait a default of 3 seconds before calling updateUserContactInformationInteractor', async () => {
    await runAction(retryUpdateUserContactInformationAction, {
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

  it('should wait the specified amount of time before calling updateUserContactInformationInteractor', async () => {
    await runAction(retryUpdateUserContactInformationAction, {
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
