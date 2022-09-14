import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { flipConsolidatedCaseAllCheckboxAction } from './flipConsolidatedCaseAllCheckboxAction';
import { runAction } from 'cerebral/test';

describe('flipConsolidatedCaseAllCheckboxAction', () => {
  const LEAD_CASE = {
    ...MOCK_CASE,
    checkboxDisabled: true,
    checked: true,
    leadDocketNumber: MOCK_CASE.docketNumber,
    tooltip: '',
  };

  const customizedDocketNumber = '1337-42';
  const SECOND_CASE = {
    ...MOCK_CASE,
    docketNumber: customizedDocketNumber,
    leadDocketNumber: MOCK_CASE.docketNumber,
    tooltip: '',
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
        consolidatedCaseAllCheckbox: false,
      },
    });

    expect(result.state.caseDetail).toEqual({
      ...LEAD_CASE,
      consolidatedCases: [
        LEAD_CASE,
        {
          ...SECOND_CASE,
          checkboxDisabled: true,
          checked: !changedCheckValue,
          tooltip: '',
        },
      ],
    });
  });

  it('should set checked to true for all cases & disable all checkboxes when consolidatedCaseAllCheckbox is set to checked', async () => {
    const result = await runAction(flipConsolidatedCaseAllCheckboxAction, {
      state: {
        caseDetail: {
          ...LEAD_CASE,
          consolidatedCases: [
            {
              ...LEAD_CASE,
              checked: false,
            },
            {
              ...SECOND_CASE,
              checkboxDisabled: false,
              checked: false,
            },
          ],
        },
        consolidatedCaseAllCheckbox: false,
      },
    });

    expect(result.state.caseDetail).toEqual({
      ...LEAD_CASE,
      consolidatedCases: [
        {
          ...LEAD_CASE,
          checkboxDisabled: true,
          checked: true,
        },
        {
          ...SECOND_CASE,
          checkboxDisabled: true,
          checked: true,
        },
      ],
    });
  });

  it('should only have lead case checked & all sub-cases are enabled & lead case is disabled & lead case as a tooltip when consolidatedCaseAllCheckbox is set to unchecked', async () => {
    const result = await runAction(flipConsolidatedCaseAllCheckboxAction, {
      state: {
        caseDetail: {
          ...LEAD_CASE,
          consolidatedCases: [
            {
              ...LEAD_CASE,
              checkboxDisabled: true,
              checked: true,
            },
            {
              ...SECOND_CASE,
              checkboxDisabled: true,
              checked: true,
            },
          ],
        },
        consolidatedCaseAllCheckbox: true,
      },
    });

    expect(result.state.caseDetail).toEqual({
      ...LEAD_CASE,
      consolidatedCases: [
        {
          ...LEAD_CASE,
          checkboxDisabled: true,
          checked: true,
          tooltip: 'The lead case cannot be unselected',
        },
        {
          ...SECOND_CASE,
          checkboxDisabled: false,
          checked: false,
        },
      ],
    });
  });
});
