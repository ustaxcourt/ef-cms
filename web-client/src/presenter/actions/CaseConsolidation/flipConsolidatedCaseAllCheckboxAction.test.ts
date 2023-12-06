import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { flipConsolidatedCaseAllCheckboxAction } from './flipConsolidatedCaseAllCheckboxAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('flipConsolidatedCaseAllCheckboxAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  const mockLeadCaseCheckbox = {
    checkboxDisabled: true,
    checked: true,
    docketNumber: MOCK_CASE.docketNumber,
    formattedPetitioners: [],
    leadDocketNumber: MOCK_CASE.docketNumber,
  };
  const mockMemberCaseDocketNumber = '1337-42';
  const mockMemberCaseCheckbox = {
    checkboxDisabled: true,
    checked: false,
    docketNumber: mockMemberCaseDocketNumber,
    formattedPetitioners: [],
    leadDocketNumber: MOCK_CASE.docketNumber,
  };

  it("should flip the non-lead cases' checked states", async () => {
    const mockOriginalCheckBoxValue = false;

    const { state } = await runAction(flipConsolidatedCaseAllCheckboxAction, {
      modules: { presenter },
      state: {
        modal: {
          form: {
            consolidatedCaseAllCheckbox: false,
            consolidatedCasesToMultiDocketOn: [
              mockLeadCaseCheckbox,
              mockMemberCaseCheckbox,
            ],
          },
        },
      },
    });

    expect(state.modal.form.consolidatedCasesToMultiDocketOn).toEqual([
      {
        ...mockLeadCaseCheckbox,
        tooltip: '',
      },
      {
        ...mockMemberCaseCheckbox,
        checkboxDisabled: !mockOriginalCheckBoxValue,
        checked: !mockOriginalCheckBoxValue,
      },
    ]);
  });

  it('should set checked to true for all cases & disable all checkboxes when consolidatedCaseAllCheckbox is set to checked', async () => {
    const { state } = await runAction(flipConsolidatedCaseAllCheckboxAction, {
      modules: { presenter },
      state: {
        modal: {
          form: {
            consolidatedCaseAllCheckbox: false,
            consolidatedCasesToMultiDocketOn: [
              {
                ...mockLeadCaseCheckbox,
                checked: false,
              },
              {
                ...mockMemberCaseCheckbox,
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
        ...mockLeadCaseCheckbox,
        tooltip: '',
      },
      {
        ...mockMemberCaseCheckbox,
        checkboxDisabled: true,
        checked: true,
      },
    ]);
  });

  it('should only have lead case checked & all sub-cases are enabled & lead case is disabled & lead case as a tooltip when consolidatedCaseAllCheckbox is set to unchecked', async () => {
    const { state } = await runAction(flipConsolidatedCaseAllCheckboxAction, {
      modules: { presenter },
      state: {
        caseDetail: mockLeadCaseCheckbox,
        modal: {
          form: {
            consolidatedCaseAllCheckbox: true,
            consolidatedCasesToMultiDocketOn: [
              mockLeadCaseCheckbox,
              {
                ...mockMemberCaseCheckbox,
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
        ...mockLeadCaseCheckbox,
        checkboxDisabled: true,
        checked: true,
        tooltip: 'The lead case cannot be unselected',
      },
      {
        ...mockMemberCaseCheckbox,
        checkboxDisabled: false,
        checked: false,
      },
    ]);
  });
});
