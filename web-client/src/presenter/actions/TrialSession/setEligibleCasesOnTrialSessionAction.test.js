import { runAction } from 'cerebral/test';
import { setEligibleCasesOnTrialSessionAction } from './setEligibleCasesOnTrialSessionAction';

describe('setEligibleCasesOnTrialSessionAction', () => {
  it('sets default trial session detail tab', async () => {
    const result = await runAction(setEligibleCasesOnTrialSessionAction, {
      props: {
        eligibleCases: [
          {
            docketNumber: '101-20',
          },
          { docketNumber: '102-20' },
        ],
      },
    });

    expect(result.state.trialSession.eligibleCases).toMatchObject([
      {
        docketNumber: '101-20',
      },
      { docketNumber: '102-20' },
    ]);
  });
});
