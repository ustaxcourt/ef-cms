const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  formatAndSortConsolidatedCases,
} = require('./formatAndSortConsolidatedCases');

describe('formatAndSortConsolidatedCases', () => {
  it('should set isRequestingUserAssociated for each case associated with the lead caseId', async () => {
    const result = await formatAndSortConsolidatedCases({
      applicationContext,
      consolidatedCases: [{ caseId: '123' }],
      leadCaseId: '456',
      userAssociatedCaseIdsMap: {
        '123': true,
      },
    });

    expect(result[0].isRequestingUserAssociated).toBe(true);
  });

  it("should add each case to the consolidatedCases list for the lead caseId when it's not the lead case", async () => {
    const result = await formatAndSortConsolidatedCases({
      applicationContext,
      consolidatedCases: [{ caseId: '123' }, { caseId: '456' }],
      leadCaseId: '456',
      userAssociatedCaseIdsMap: {
        '123': true,
      },
    });

    expect(result.length).toBe(1);
    expect(result[0].caseId).toBe('123');
  });

  it('should return the list of consolidatedCases sorted by docketNumber', async () => {
    const result = await formatAndSortConsolidatedCases({
      applicationContext,
      consolidatedCases: [
        { caseId: '123', docketNumber: '999-20' },
        { caseId: '321', docketNumber: '123-20' },
      ],
      leadCaseId: '456',
      userAssociatedCaseIdsMap: {
        '123': true,
        '321': true,
      },
    });

    expect(result.length).toBe(2);
    expect(result[0].docketNumber).toBe('123-20');
    expect(result[1].docketNumber).toBe('999-20');
  });
});
