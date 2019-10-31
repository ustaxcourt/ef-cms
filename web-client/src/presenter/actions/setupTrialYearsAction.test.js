import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setupTrialYearsAction } from './setupTrialYearsAction';

presenter.providers.applicationContext = {
  getUtilities: () => ({
    formatNow: () => '2000',
  }),
};

describe('setupTrialYearsAction', () => {
  it('sets up confirmation with props', async () => {
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
