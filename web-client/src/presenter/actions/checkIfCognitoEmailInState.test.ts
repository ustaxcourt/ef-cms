import { checkIfCognitoEmailInState } from '@web-client/presenter/actions/checkIfCognitoEmailInState';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('checkIfCognitoEmailInState', () => {
  const existPathMock = jest.fn();
  const doesNotExistPathMock = jest.fn();

  beforeAll(() => {
    presenter.providers.path = {
      doesNotExist: doesNotExistPathMock,
      exists: existPathMock,
    };
  });

  it('should call the exist path if email is set in state', async () => {
    await runAction(checkIfCognitoEmailInState, {
      modules: { presenter },
      state: {
        cognito: {
          email: 'some@email.com',
        },
      },
    });

    expect(existPathMock).toHaveBeenCalled();
    expect(doesNotExistPathMock).not.toHaveBeenCalled();
  });

  it('should call the does not exist path if email is not set in state', async () => {
    await runAction(checkIfCognitoEmailInState, {
      modules: { presenter },
      state: {
        cognito: {},
      },
    });

    expect(existPathMock).not.toHaveBeenCalled();
    expect(doesNotExistPathMock).toHaveBeenCalled();
  });
});
