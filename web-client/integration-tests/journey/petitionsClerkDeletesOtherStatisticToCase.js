export const petitionsClerkDeletesOtherStatisticToCase = test => {
  return it('petitions clerk deletes other statistic on the case', async () => {
    await test.runSequence('gotoEditOtherStatisticsSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail.damages')).toBeDefined();
    expect(test.getState('caseDetail.litigationCosts')).toBeDefined();

    await test.runSequence('deleteOtherStatisticsSequence');

    expect(test.getState('caseDetail.litigationCosts')).toEqual(null);
    expect(test.getState('caseDetail.damages')).toEqual(null);
  });
};
