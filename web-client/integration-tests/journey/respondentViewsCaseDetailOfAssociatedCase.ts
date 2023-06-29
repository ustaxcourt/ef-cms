export const respondentViewsCaseDetailOfAssociatedCase = cerebralTest => {
  return it('Respondent views case detail of associated case', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');
    expect(cerebralTest.getState('caseDetail.irsPractitioners.0.name')).toEqual(
      'Test IRS Practitioner',
    );
  });
};
