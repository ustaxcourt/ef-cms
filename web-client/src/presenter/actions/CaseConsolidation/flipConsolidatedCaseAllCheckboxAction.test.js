import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { flipConsolidatedCaseAllCheckboxAction } from './flipConsolidatedCaseAllCheckboxAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('flipConsolidatedCaseAllCheckboxAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

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
    const mockOriginalCheckBoxValue = false;

    const { state } = await runAction(flipConsolidatedCaseAllCheckboxAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          ...LEAD_CASE,
        },
        modal: {
          form: {
            consolidatedCaseAllCheckbox: false,
            consolidatedCasesToMultiDocketOn: [
              LEAD_CASE,
              {
                ...SECOND_CASE,
                checked: mockOriginalCheckBoxValue,
              },
            ],
          },
        },
      },
    });

    expect(state.modal.form.consolidatedCasesToMultiDocketOn).toEqual([
      LEAD_CASE,
      {
        ...SECOND_CASE,
        checkboxDisabled: !mockOriginalCheckBoxValue,
        checked: !mockOriginalCheckBoxValue,
        tooltip: '',
      },
    ]);
  });

  it('should set checked to true for all cases & disable all checkboxes when consolidatedCaseAllCheckbox is set to checked', async () => {
    const { state } = await runAction(flipConsolidatedCaseAllCheckboxAction, {
      modules: { presenter },
      state: {
        caseDetail: LEAD_CASE,
        modal: {
          form: {
            consolidatedCaseAllCheckbox: false,
            consolidatedCasesToMultiDocketOn: [
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
        },
      },
    });

    expect(state.modal.form.consolidatedCasesToMultiDocketOn).toEqual([
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
    ]);
  });

  it('should only have lead case checked & all sub-cases are enabled & lead case is disabled & lead case as a tooltip when consolidatedCaseAllCheckbox is set to unchecked', async () => {
    const { state } = await runAction(flipConsolidatedCaseAllCheckboxAction, {
      modules: { presenter },
      state: {
        caseDetail: LEAD_CASE,
        modal: {
          form: {
            consolidatedCaseAllCheckbox: true,
            consolidatedCasesToMultiDocketOn: [
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
        },
      },
    });

    expect(state.modal.form.consolidatedCasesToMultiDocketOn).toEqual([
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
    ]);
  });
});
