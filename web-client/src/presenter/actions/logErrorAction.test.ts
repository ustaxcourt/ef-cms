import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { logErrorAction } from '@web-client/presenter/actions/logErrorAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('logErrorAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .logErrorInteractor.mockReturnValue(jest.fn());
  });

  it('should call the appropriate interactor', async () => {
    await runAction(logErrorAction, {
      modules: {
        presenter,
      },
      props: {
        errorToLog: 'TestError',
      },
    });
    expect(
      applicationContext.getUseCases().logErrorInteractor,
    ).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ error: 'TestError' }),
    );
  });
});
