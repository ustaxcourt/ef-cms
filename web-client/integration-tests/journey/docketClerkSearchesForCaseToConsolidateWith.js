export const docketClerkSearchesForCaseToConsolidateWith = cerebralTest => {
  return it('Docket clerk searches for case to consolidate with', async () => {
    cerebralTest.setState('modal.searchTerm', cerebralTest.leadDocketNumber);
    await cerebralTest.runSequence('submitCaseSearchForConsolidationSequence', {
      docketNumber: cerebralTest.leadDocketNumber,
    });
    expect(cerebralTest.getState('modal.caseDetail.docketNumber')).toEqual(
      cerebralTest.leadDocketNumber,
    );
  });
};
