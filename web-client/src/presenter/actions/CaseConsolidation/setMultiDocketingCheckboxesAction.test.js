import {
  MOCK_CASE_WITH_SECONDARY_OTHERS,
  MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
} from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setMultiDocketingCheckboxesAction } from './setMultiDocketingCheckboxesAction';

describe('setMultiDocketingCheckboxesAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should format petitioner names and update state correctly', async () => {
    const { state } = await runAction(setMultiDocketingCheckboxesAction, {
      modules: {
        presenter,
      },
      props: {
        consolidatedCases: [
          MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
          MOCK_CASE_WITH_SECONDARY_OTHERS,
        ],
      },
      state: {
        caseDetail: MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
      },
    });

    const mockCaseSinglePetitioner =
      MOCK_LEAD_CASE_WITH_PAPER_SERVICE.petitioners[0].name +
      ' & ' +
      MOCK_LEAD_CASE_WITH_PAPER_SERVICE.petitioners[1].name;
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
        checkboxDisabled: true,
        checked: true,
        docketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
        formattedPetitioners: mockCaseSinglePetitioner,
        isLeadCase: true,
      },
      {
        checkboxDisabled: true,
        checked: true,
        docketNumber: MOCK_CASE_WITH_SECONDARY_OTHERS.docketNumber,
        formattedPetitioners: mockCaseMultiplePetitioners,
        isLeadCase: false,
      },
    ]);
    expect(state.modal.form.consolidatedCaseAllCheckbox).toEqual(true);
  });
});
