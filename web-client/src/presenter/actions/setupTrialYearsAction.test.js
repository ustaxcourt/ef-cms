import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setupTrialYearsAction } from './setupTrialYearsAction';

describe('setupTrialYearsAction', () => {
  beforeEach(() => {
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
