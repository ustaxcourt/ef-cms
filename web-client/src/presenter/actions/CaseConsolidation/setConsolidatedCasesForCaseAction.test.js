import { runAction } from 'cerebral/test';
import { setConsolidatedCasesForCaseAction } from './setConsolidatedCasesForCaseAction';

describe('setConsolidatedCasesForCaseAction', () => {
  it('sets the consolidated cases for the given case', async () => {
    const result = await runAction(setConsolidatedCasesForCaseAction, {
      props: {
        consolidatedCases: [
          { docketNumber: '101-20', leadDocketNumber: '101-20' },
          { docketNumber: '102-20', leadDocketNumber: '101-20' },
        ],
      },
    });

    expect(result.state.caseDetail.consolidatedCases).toMatchObject([
      { docketNumber: '101-20', leadDocketNumber: '101-20' },
      { docketNumber: '102-20', leadDocketNumber: '101-20' },
    ]);
  });
});
