import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { runAction } from 'cerebral/test';
import { updateCaseCheckboxAction } from './updateCaseCheckboxAction';

describe('updateCaseCheckboxAction', () => {
  it('should format petitioner names and update state correctly', async () => {
    const mockCaseChecked = true;
    const initialCheckedValue = false;

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
              checked: mockCaseChecked,
              docketNumber: customizedDocketNumber,
            },
            {
              ...MOCK_CASE,
              checked: initialCheckedValue,
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
          checked: mockCaseChecked,
          docketNumber: customizedDocketNumber,
        },
        {
          ...MOCK_CASE,
          checked: !initialCheckedValue,
        },
      ],
    });
  });
});
