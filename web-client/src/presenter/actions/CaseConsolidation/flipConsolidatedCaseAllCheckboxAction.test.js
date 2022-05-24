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
        consolidatedCaseAllCheckbox: false,
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

  it('should set checked to true for all cases when all checkbox is set to checked', async () => {
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
          checked: true,
        },
        {
          ...SECOND_CASE,
          checked: true,
        },
      ],
    });
  });

  it('should only have lead case checked when all checkbox is set to unchecked', async () => {
    const result = await runAction(flipConsolidatedCaseAllCheckboxAction, {
      state: {
        caseDetail: {
          ...LEAD_CASE,
          consolidatedCases: [
            {
              ...LEAD_CASE,
              checked: true,
            },
            {
              ...SECOND_CASE,
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
          checked: true,
        },
        {
          ...SECOND_CASE,
          checked: false,
        },
      ],
    });
  });
});
