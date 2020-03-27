import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { authenticateCodeAction } from './authenticateCodeAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

describe('authenticateCodeAction', () => {
  beforeEach(() => {
    applicationContext
      .getUseCases()
      .authorizeCodeInteractor.mockImplementation(({ code }) => {
        return {
          refreshToken: `refresh-token-${code}`,
          token: `token-${code}`,
        };
      });
    presenter.providers.applicationContext = applicationContext;
  });

  it('calls the authorizeCodeInteractor with the given code from props, returning its response tokens', async () => {
    const result = await runAction(authenticateCodeAction, {
      modules: {
        presenter,
      },
      props: {
        code: '123',
      },
      state: {},
    });

    expect(
      applicationContext.getUseCases().authorizeCodeInteractor.mock.calls
        .length,
    ).toEqual(1);

    expect(result.output).toEqual({
      refreshToken: 'refresh-token-123',
      token: 'token-123',
    });
  });
});
