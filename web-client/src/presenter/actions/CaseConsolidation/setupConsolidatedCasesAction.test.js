import {
  MOCK_CASE,
  MOCK_CASE_WITH_SECONDARY_OTHERS,
} from '../../../../../shared/src/test/mockCase';
import { runAction } from 'cerebral/test';
import { setupConsolidatedCasesAction } from './setupConsolidatedCasesAction';

describe('setupConsolidatedCasesAction', () => {
  it('should format petitioner names and update state correctly', async () => {
    const result = await runAction(setupConsolidatedCasesAction, {
      state: {
        caseDetail: {
          ...MOCK_CASE,
          consolidatedCases: [MOCK_CASE, MOCK_CASE_WITH_SECONDARY_OTHERS],
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

    expect(result.state.caseDetail).toEqual({
      ...MOCK_CASE,
      consolidatedCases: [
        {
          ...MOCK_CASE,
          checked: true,
          formattedPetitioners: mockCaseSinglePetitioner,
        },
        {
          ...MOCK_CASE_WITH_SECONDARY_OTHERS,
          checked: true,
          formattedPetitioners: mockCaseMultiplePetitioners,
        },
      ],
    });

    expect(result.state.consolidatedCaseAllCheckbox).toEqual(true);
  });
});
