export const respondentViewsCaseDetailOfUnassociatedCase = cerebralTest => {
  return it('Respondent views case detail of unassociated case', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');
  });
};
