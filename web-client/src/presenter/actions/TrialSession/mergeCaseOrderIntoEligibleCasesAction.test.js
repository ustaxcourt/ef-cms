import { mergeCaseOrderIntoEligibleCasesAction } from './mergeCaseOrderIntoEligibleCasesAction';
import { runAction } from 'cerebral/test';

describe('mergeCaseOrderIntoeligibleCasesAction', () => {
  it('should merge case order into associated eligible cases', async () => {
    const result = await runAction(mergeCaseOrderIntoEligibleCasesAction, {
      state: {
        trialSession: {
          caseOrder: [
            {
              caseId: 'case-id-123',
              caseOrderProperty: 'foobar',
            },
          ],
          eligibleCases: [{ caseId: 'case-id-123' }],
        },
      },
    });

    expect(result.state.trialSession.eligibleCases).toEqual([
      { caseId: 'case-id-123', caseOrderProperty: 'foobar' },
    ]);
  });
});
