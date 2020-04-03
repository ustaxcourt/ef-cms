import { runAction } from 'cerebral/test';
import { setEligibleCasesOnTrialSessionAction } from './setEligibleCasesOnTrialSessionAction';

describe('setEligibleCasesOnTrialSessionAction', () => {
  it('sets default trial session detail tab', async () => {
    const result = await runAction(setEligibleCasesOnTrialSessionAction, {
      props: {
        eligibleCases: [
          {
            caseId: 'case-id-123',
          },
          { caseId: 'case-id-234' },
        ],
      },
    });

    expect(result.state.trialSession.eligibleCases).toMatchObject([
      {
        caseId: 'case-id-123',
      },
      { caseId: 'case-id-234' },
    ]);
  });
});
