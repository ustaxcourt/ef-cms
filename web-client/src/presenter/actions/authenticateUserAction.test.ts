import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { authenticateUserAction } from './authenticateUserAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('authenticateUserAction', () => {
  let mockYes;
  let mockNo;

  beforeAll(() => {
    mockYes = jest.fn();
    mockNo = jest.fn();

    presenter.providers.path = {
      no: mockNo,
      yes: mockYes,
    };

    applicationContext
      .getUseCases()
      .authenticateUserInteractor.mockImplementation((appContext, { code }) => {
        return {
          token: `token-${code}`,
        };
      });
    presenter.providers.applicationContext = applicationContext;
  });

  it('calls the authenticateUserInteractor with the given code from props, returns its response tokens, and calls mockYes path', async () => {
    await runAction(authenticateUserAction, {
      modules: {
        presenter,
      },
      props: {
        code: '123',
      },
      state: {},
    });

    expect(
      applicationContext.getUseCases().authenticateUserInteractor.mock.calls
        .length,
    ).toEqual(1);

    expect(mockYes.mock.calls[0][0]).toMatchObject({
      token: 'token-123',
    });
  });

  it('finds an alert error and calls mockNo path when login is invalid', async () => {
    const mockAlertError = {
      alertError: {
        message: 'login is invalid',
        title: 'invalid',
      },
    };
    applicationContext
      .getUseCases()
      .authenticateUserInteractor.mockImplementationOnce(() => {
        return mockAlertError;
      });

    await runAction(authenticateUserAction, {
      modules: {
        presenter,
      },
      props: {
        code: '123',
      },
      state: {},
    });

    expect(mockNo.mock.calls[0][0]).toMatchObject(mockAlertError);
  });
});
