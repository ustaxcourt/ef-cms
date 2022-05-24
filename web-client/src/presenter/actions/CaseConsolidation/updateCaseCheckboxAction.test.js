import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { runAction } from 'cerebral/test';
import { updateCaseCheckboxAction } from './updateCaseCheckboxAction';

describe('updateCaseCheckboxAction', () => {
  it("should flip the correct case's checked state", async () => {
    const unchangedCheckValue = true;
    const changedCheckValue = false;

    const customizedDocketNumber = '1337-42';

    const result = await runAction(updateCaseCheckboxAction, {
      props: {
        docketNumber: MOCK_CASE.docketNumber,
      },
      state: {
        caseDetail: {
          ...MOCK_CASE,
          consolidatedCases: [
            {
              ...MOCK_CASE,
              checked: unchangedCheckValue,
              docketNumber: customizedDocketNumber,
            },
            {
              ...MOCK_CASE,
              checked: changedCheckValue,
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
