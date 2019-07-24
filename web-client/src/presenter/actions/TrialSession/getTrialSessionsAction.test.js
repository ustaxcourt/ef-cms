import { getTrialSessionsAction } from './getTrialSessionsAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('getTrialSessionsAction', () => {
  let getTrialSessionsInteractorStub;

  beforeEach(() => {
    getTrialSessionsInteractorStub = jest.fn().mockReturnValue([]);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getTrialSessionsInteractor: getTrialSessionsInteractorStub,
      }),
    };
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
