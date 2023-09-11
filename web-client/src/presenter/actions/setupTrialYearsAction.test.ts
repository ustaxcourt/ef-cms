import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setupTrialYearsAction } from './setupTrialYearsAction';

describe('setupTrialYearsAction', () => {
  beforeAll(() => {
    applicationContext.getUtilities().formatNow.mockReturnValue('2000');
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets the trial years array on state.modal based on the current year', async () => {
    const result = await runAction(setupTrialYearsAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {},
      },
    });

    expect(result.state.modal.trialYears).toMatchObject([
      '2000',
      '2001',
      '2002',
    ]);
  });
});
