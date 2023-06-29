export const petitionsClerkEditOtherStatisticToCase = cerebralTest => {
  return it('petitions clerk edits other statistic on the case', async () => {
    await cerebralTest.runSequence('gotoEditOtherStatisticsSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('caseDetail.damages')).toEqual(5678);
    expect(cerebralTest.getState('caseDetail.litigationCosts')).toEqual(1234);

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'litigationCosts',
      value: 99,
    });

    await cerebralTest.runSequence('submitEditOtherStatisticsSequence');

    expect(cerebralTest.getState('caseDetail.litigationCosts')).toEqual(99);
  });
};
