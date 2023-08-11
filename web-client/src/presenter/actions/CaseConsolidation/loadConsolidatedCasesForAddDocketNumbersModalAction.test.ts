import { loadConsolidatedCasesForAddDocketNumbersModalAction } from './loadConsolidatedCasesForAddDocketNumbersModalAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('loadConsolidatedCasesForAddDocketNumbersModalAction', () => {
  it('should restore the expected checked consolidated cases on load', async () => {
    const consolidatedCases = [
      {
        docketNumber: '101-20',
        petitioners: [{ name: 'Roy Kent' }, { name: 'Jamie Tartt' }],
      },
      {
        docketNumber: '102-20',
        petitioners: [],
      },
      {
        docketNumber: '103-20',
        petitioners: [],
      },
    ];

    await runAction(loadConsolidatedCasesForAddDocketNumbersModalAction, {
      modules: { presenter },
      state: {
        addedDocketNumbers: ['101-20', '103-20'],
        caseDetail: {
          consolidatedCases,
          leadDocketNumber: '101-20',
        },
      },
    });

    expect(
      consolidatedCases.find(({ docketNumber }) => docketNumber === '101-20'),
    ).toMatchObject({
      checkboxDisabled: true,
      checked: true,
      formattedPetitioners: 'Roy Kent & Jamie Tartt',
    });
    expect(
      consolidatedCases.find(({ docketNumber }) => docketNumber === '102-20'),
    ).toMatchObject({
      checkboxDisabled: false,
      checked: false,
    });
    expect(
      consolidatedCases.find(({ docketNumber }) => docketNumber === '103-20'),
    ).toMatchObject({
      checkboxDisabled: false,
      checked: true,
    });
  });
});
