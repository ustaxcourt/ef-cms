import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getTrialSessionsAction } from './getTrialSessionsAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getTrialSessionsAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .getTrialSessionsInteractor.mockReturnValue([]);
  });

  it('should retrieve trial sessions', async () => {
    const result = await runAction(getTrialSessionsAction, {
      modules: {
        presenter,
      },
    });

    expect(result.output).toMatchObject({
      trialSessions: [],
    });
  });
});
