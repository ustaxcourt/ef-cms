export const docketClerkSearchesForCaseToConsolidateWith = cerebralTest => {
  return it('Docket clerk searches for case to consolidate with', async () => {
    // Add debugging to help diagnose the issue
    if (!cerebralTest.leadDocketNumber) {
      console.error('ERROR: cerebralTest.leadDocketNumber is undefined!');
      console.error(
        'Current cerebralTest.docketNumber:',
        cerebralTest.docketNumber,
      );
      throw new Error(
        'Lead docket number is required for consolidation search',
      );
    }

    cerebralTest.setState('modal.searchTerm', cerebralTest.leadDocketNumber);

    await cerebralTest.runSequence('submitCaseSearchForConsolidationSequence', {
      docketNumber: cerebralTest.leadDocketNumber,
    });

    const foundCaseDetail = cerebralTest.getState('modal.caseDetail');
    if (!foundCaseDetail) {
      console.error('ERROR: No case detail found in modal.caseDetail');
      console.error('Modal state:', cerebralTest.getState('modal'));
      throw new Error('Case search failed to find case detail');
    }

    expect(foundCaseDetail.docketNumber).toEqual(cerebralTest.leadDocketNumber);
  });
};
