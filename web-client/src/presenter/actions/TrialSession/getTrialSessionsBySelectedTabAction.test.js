import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getTrialSessionsBySelectedTabAction } from './getTrialSessionsBySelectedTabAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getTrialSessionsBySelectedTabAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should try to fetch all open trial session if selected is undefined', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionsByStatusInteractor.mockResolvedValue([]);

    await runAction(getTrialSessionsBySelectedTabAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        currentViewMetadata: {
          trialSessions: {
            tab: undefined,
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().getTrialSessionsByStatusInteractor,
    ).toHaveBeenCalledWith(expect.anything(), {
      status: 'open',
    });
  });

  it('should try to fetch all trial session by the status defined in state', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionsByStatusInteractor.mockResolvedValue([]);

    await runAction(getTrialSessionsBySelectedTabAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        currentViewMetadata: {
          trialSessions: {
            tab: 'closed',
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().getTrialSessionsByStatusInteractor,
    ).toHaveBeenCalledWith(expect.anything(), {
      status: 'closed',
    });
  });
});
