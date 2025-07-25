export const respondent1ViewsCaseDetailOfAssociatedCase = cerebralTest => {
  return it('Respondent1 views case detail of associated case', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');

    const irsPractitioner1UserId = '5fb6e815-b5d3-459b-b08b-49c61f0fce5e';
    const irsPractitioner = cerebralTest
      .getState('caseDetail.irsPractitioners')
      .find(practitioner => practitioner.userId === irsPractitioner1UserId);
    expect(irsPractitioner.name).toEqual('Test IRS Practitioner1');
  });
};
