import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { authenticateUserAction } from './authenticateUserAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('authenticateUserAction', () => {
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .authenticateUserInteractor.mockImplementation((appContext, { code }) => {
        return {
          token: `token-${code}`,
        };
      });
    presenter.providers.applicationContext = applicationContext;
  });

  it('calls the authenticateUserInteractor with the given code from props, returning its response tokens', async () => {
    const result = await runAction(authenticateUserAction, {
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

    expect(result.output).toEqual({
      token: 'token-123',
    });
  });
});
