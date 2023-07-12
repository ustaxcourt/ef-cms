import { runAction } from '@web-client/presenter/test.cerebral';
import { setEligibleCasesOnTrialSessionAction } from './setEligibleCasesOnTrialSessionAction';

describe('setEligibleCasesOnTrialSessionAction', () => {
  it('sets default trial session detail tab', async () => {
    const result = await runAction(setEligibleCasesOnTrialSessionAction, {
      props: {
        eligibleCases: [
          {
            docketNumber: '123-45',
          },
          { docketNumber: '234-56' },
        ],
      },
    });

    expect(result.state.trialSession.eligibleCases).toMatchObject([
      {
        docketNumber: '123-45',
      },
      { docketNumber: '234-56' },
    ]);
  });
});
