import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setupTrialYearsAction } from './setupTrialYearsAction';

presenter.providers.applicationContext = {
  getUtilities: () => ({
    getCurrentYear: () => '2000',
  }),
};

describe('setupTrialYearsAction', () => {
  it('sets up confirmation with props', async () => {
    const result = await runAction(setupTrialYearsAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          caseId: 'abc-123',
          docketNumber: 'abc-123',
          documentIdToEdit: 'abc-123',
        },
      },
    });

    expect(result.state.trialYears).toMatchObject(['2000', '2001', '2002']);
  });
});
