import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { flipConsolidatedCaseAllCheckboxAction } from './flipConsolidatedCaseAllCheckboxAction';
import { runAction } from 'cerebral/test';

describe('flipConsolidatedCaseAllCheckboxAction', () => {
  it("should flip the correct case's checked state", async () => {
    const unchangedCheckValue = true;
    const changedCheckValue = false;

    const customizedDocketNumber = '1337-42';

    const result = await runAction(flipConsolidatedCaseAllCheckboxAction, {
      state: {
        caseDetail: {
          ...MOCK_CASE,
          consolidatedCases: [
            {
              ...MOCK_CASE,
              checked: changedCheckValue,
              docketNumber: customizedDocketNumber,
              leadDocketNumber: MOCK_CASE.docketNumber,
            },
            {
              ...MOCK_CASE,
              checked: unchangedCheckValue,
              leadDocketNumber: MOCK_CASE.docketNumber,
            },
          ],
        },
      },
    });

    expect(result.state.caseDetail).toEqual({
      ...MOCK_CASE,
      consolidatedCases: [
        {
          ...MOCK_CASE,
          checked: unchangedCheckValue,
          docketNumber: customizedDocketNumber,
        },
        {
          ...MOCK_CASE,
          checked: !changedCheckValue,
        },
      ],
    });
  });
});
