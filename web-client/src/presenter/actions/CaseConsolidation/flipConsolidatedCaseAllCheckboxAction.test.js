import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { flipConsolidatedCaseAllCheckboxAction } from './flipConsolidatedCaseAllCheckboxAction';
import { runAction } from 'cerebral/test';

describe('flipConsolidatedCaseAllCheckboxAction', () => {
  const LEAD_CASE = {
    ...MOCK_CASE,
    checked: true,
    leadDocketNumber: MOCK_CASE.docketNumber,
  };

  const customizedDocketNumber = '1337-42';
  const SECOND_CASE = {
    ...MOCK_CASE,
    docketNumber: customizedDocketNumber,
    leadDocketNumber: MOCK_CASE.docketNumber,
  };

  it("should flip the non-lead cases' checked states", async () => {
    const changedCheckValue = false;

    const result = await runAction(flipConsolidatedCaseAllCheckboxAction, {
      state: {
        caseDetail: {
          ...LEAD_CASE,
          consolidatedCases: [
            LEAD_CASE,
            {
              ...SECOND_CASE,
              checked: changedCheckValue,
            },
          ],
        },
      },
    });

    expect(result.state.caseDetail).toEqual({
      ...LEAD_CASE,
      consolidatedCases: [
        LEAD_CASE,
        {
          ...SECOND_CASE,
          checked: !changedCheckValue,
        },
      ],
    });
  });
});
