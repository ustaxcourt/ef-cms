export const petitionsClerkDeletesOtherStatisticToCase = cerebralTest => {
  return it('petitions clerk deletes other statistic on the case', async () => {
    await cerebralTest.runSequence('gotoEditOtherStatisticsSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('caseDetail.damages')).toBeDefined();
    expect(cerebralTest.getState('caseDetail.litigationCosts')).toBeDefined();

    await cerebralTest.runSequence('deleteOtherStatisticsSequence');

    expect(cerebralTest.getState('caseDetail.litigationCosts')).toEqual(null);
    expect(cerebralTest.getState('caseDetail.damages')).toEqual(null);
  });
};
