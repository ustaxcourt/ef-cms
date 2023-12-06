import { mergeCaseOrderIntoEligibleCasesAction } from './mergeCaseOrderIntoEligibleCasesAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('mergeCaseOrderIntoeligibleCasesAction', () => {
  it('should merge case order into associated eligible cases', async () => {
    const result = await runAction(mergeCaseOrderIntoEligibleCasesAction, {
      state: {
        trialSession: {
          caseOrder: [
            {
              caseOrderProperty: 'foobar',
              docketNumber: '123-45',
            },
          ],
          eligibleCases: [{ docketNumber: '123-45' }],
        },
      },
    });

    expect(result.state.trialSession.eligibleCases).toEqual([
      { caseOrderProperty: 'foobar', docketNumber: '123-45' },
    ]);
  });
});
