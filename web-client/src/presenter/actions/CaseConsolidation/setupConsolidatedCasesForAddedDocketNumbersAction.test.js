import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { runAction } from 'cerebral/test';
import { setupConsolidatedCasesForAddedDocketNumbersAction } from './setupConsolidatedCasesForAddedDocketNumbersAction';

describe('setupConsolidatedCasesForAddedDocketNumbersAction', () => {
  it('should set the expected isChecked on consolidated cases based on the state.addedDocketNumbers', async () => {
    const result = await runAction(
      setupConsolidatedCasesForAddedDocketNumbersAction,
      {
        state: {
          addedDocketNumbers: ['102-20S', '103-20'],
          caseDetail: {
            ...MOCK_CASE,
            consolidatedCases: [
              {
                docketNumber: '101-20',
                docketNumberWithSuffix: '101-20',
                leadDocketNumber: '101-20',
                petitioners: [{ name: 'Ozzy' }, { name: 'Leaf' }],
              },
              {
                docketNumber: '102-20',
                docketNumberWithSuffix: '102-20S',
                petitioners: [],
              },
              {
                docketNumber: '103-20',
                docketNumberWithSuffix: '103-20',
                petitioners: [],
              },
              {
                docketNumber: '104-20',
                docketNumberWithSuffix: '104-20',
                petitioners: [],
              },
            ],
          },
        },
      },
    );

    expect(result.state.caseDetail.consolidatedCases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          checkboxDisabled: true,
          checked: true,
          docketNumber: '101-20',
          formattedPetitioners: 'Ozzy & Leaf',
          leadDocketNumber: '101-20',
        }),
        expect.objectContaining({
          checkboxDisabled: false,
          checked: true,
          docketNumber: '102-20',
        }),
        expect.objectContaining({
          checkboxDisabled: false,
          checked: true,
          docketNumber: '103-20',
        }),
        expect.objectContaining({
          checkboxDisabled: false,
          checked: false,
          docketNumber: '104-20',
        }),
      ]),
    );

    expect(result.state.consolidatedCaseAllCheckbox).toEqual(false);
  });

  it('should set the all checked checkbox to true if all consolidated cases are checked', async () => {
    const result = await runAction(
      setupConsolidatedCasesForAddedDocketNumbersAction,
      {
        state: {
          addedDocketNumbers: ['102-20S', '103-20', '104-20'],
          caseDetail: {
            ...MOCK_CASE,
            consolidatedCases: [
              {
                docketNumber: '101-20',
                docketNumberWithSuffix: '101-20',
                leadDocketNumber: '101-20',
                petitioners: [],
              },
              {
                docketNumber: '102-20',
                docketNumberWithSuffix: '102-20S',
                petitioners: [],
              },
              {
                docketNumber: '103-20',
                docketNumberWithSuffix: '103-20',
                petitioners: [],
              },
              {
                docketNumber: '104-20',
                docketNumberWithSuffix: '104-20',
                petitioners: [],
              },
            ],
          },
        },
      },
    );

    expect(result.state.caseDetail.consolidatedCases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          checkboxDisabled: true,
          checked: true,
          docketNumber: '101-20',
          leadDocketNumber: '101-20',
        }),
        expect.objectContaining({
          checkboxDisabled: true,
          checked: true,
          docketNumber: '102-20',
        }),
        expect.objectContaining({
          checkboxDisabled: true,
          checked: true,
          docketNumber: '103-20',
        }),
        expect.objectContaining({
          checkboxDisabled: true,
          checked: true,
          docketNumber: '104-20',
        }),
      ]),
    );

    expect(result.state.consolidatedCaseAllCheckbox).toEqual(true);
  });
});
