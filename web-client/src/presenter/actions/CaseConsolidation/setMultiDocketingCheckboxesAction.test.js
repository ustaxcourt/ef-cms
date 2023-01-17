import {
  MOCK_CASE,
  MOCK_CASE_WITH_SECONDARY_OTHERS,
} from '../../../../../shared/src/test/mockCase';
import { runAction } from 'cerebral/test';
import { setMultiDocketingCheckboxesAction } from './setMultiDocketingCheckboxesAction';

describe('setMultiDocketingCheckboxesAction', () => {
  it('should format petitioner names and update state correctly', async () => {
    const { state } = await runAction(setMultiDocketingCheckboxesAction, {
      props: {
        consolidatedCases: [MOCK_CASE, MOCK_CASE_WITH_SECONDARY_OTHERS],
      },
      state: {
        caseDetail: {
          ...MOCK_CASE,
        },
      },
    });

    const mockCaseSinglePetitioner = MOCK_CASE.petitioners[0].name;
    const mockCaseMultiplePetitioners =
      MOCK_CASE_WITH_SECONDARY_OTHERS.petitioners[0].name +
      ' & ' +
      MOCK_CASE_WITH_SECONDARY_OTHERS.petitioners[1].name +
      ' & ' +
      MOCK_CASE_WITH_SECONDARY_OTHERS.petitioners[2].name +
      ' & ' +
      MOCK_CASE_WITH_SECONDARY_OTHERS.petitioners[3].name +
      ' & ' +
      MOCK_CASE_WITH_SECONDARY_OTHERS.petitioners[4].name +
      ' & ' +
      MOCK_CASE_WITH_SECONDARY_OTHERS.petitioners[5].name;

    expect(state.modal.form.consolidatedCasesToMultiDocketOn).toEqual([
      {
        ...MOCK_CASE,
        checkboxDisabled: true,
        checked: true,
        formattedPetitioners: mockCaseSinglePetitioner,
        tooltip: '',
      },
      {
        ...MOCK_CASE_WITH_SECONDARY_OTHERS,
        checkboxDisabled: true,
        checked: true,
        formattedPetitioners: mockCaseMultiplePetitioners,
        tooltip: '',
      },
    ]);
    expect(state.modal.form.consolidatedCaseAllCheckbox).toEqual(true);
  });
});
