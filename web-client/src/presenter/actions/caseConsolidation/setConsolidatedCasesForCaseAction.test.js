import { runAction } from 'cerebral/test';
import { setConsolidatedCasesForCaseAction } from './setConsolidatedCasesForCaseAction';

describe('setConsolidatedCasesForCaseAction', () => {
  it('sets the consolidated cases for the given case', async () => {
    const result = await runAction(setConsolidatedCasesForCaseAction, {
      props: {
        consolidatedCases: [
          { caseId: 'abc-123', leadCaseId: 'abc-123' },
          { caseId: 'def-321', leadCaseId: 'abc-123' },
        ],
      },
    });

    expect(result.state.caseDetail.consolidatedCases).toMatchObject([
      { caseId: 'abc-123', leadCaseId: 'abc-123' },
      { caseId: 'def-321', leadCaseId: 'abc-123' },
    ]);
  });
});
