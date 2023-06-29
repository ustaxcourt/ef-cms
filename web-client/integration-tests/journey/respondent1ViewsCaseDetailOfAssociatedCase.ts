export const respondent1ViewsCaseDetailOfAssociatedCase = cerebralTest => {
  return it('Respondent1 views case detail of associated case', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');
    expect(cerebralTest.getState('caseDetail.irsPractitioners.1.name')).toEqual(
      'Test IRS Practitioner1',
    );
  });
};
