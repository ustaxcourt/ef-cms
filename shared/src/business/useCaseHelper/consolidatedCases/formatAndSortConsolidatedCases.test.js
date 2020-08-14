const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  formatAndSortConsolidatedCases,
} = require('./formatAndSortConsolidatedCases');

describe('formatAndSortConsolidatedCases', () => {
  it('should set isRequestingUserAssociated for each case associated with the lead docketNumber', async () => {
    const result = await formatAndSortConsolidatedCases({
      applicationContext,
      consolidatedCases: [{ docketNumber: '123-20' }],
      leadDocketNumber: '456-20',
      userAssociatedDocketNumbersMap: {
        '123-20': true,
      },
    });

    expect(result[0].isRequestingUserAssociated).toBe(true);
  });

  it("should add each case to the consolidatedCases list for the lead docketNumber when it's not the lead case", async () => {
    const result = await formatAndSortConsolidatedCases({
      applicationContext,
      consolidatedCases: [
        { docketNumber: '123-20' },
        { docketNumber: '456-20' },
      ],
      leadDocketNumber: '456-20',
      userAssociatedDocketNumbersMap: {
        '123-20': true,
      },
    });

    expect(result.length).toBe(1);
    expect(result[0].docketNumber).toBe('123-20');
  });

  it('should return the list of consolidatedCases sorted by docketNumber', async () => {
    const result = await formatAndSortConsolidatedCases({
      applicationContext,
      consolidatedCases: [
        { docketNumber: '999-20' },
        { docketNumber: '123-20' },
      ],
      leadDocketNumber: '456-20',
      userAssociatedDocketNumbersMap: {
        '123-20': true,
        '999-20': true,
      },
    });

    expect(result.length).toBe(2);
    expect(result[0].docketNumber).toBe('123-20');
    expect(result[1].docketNumber).toBe('999-20');
  });
});
