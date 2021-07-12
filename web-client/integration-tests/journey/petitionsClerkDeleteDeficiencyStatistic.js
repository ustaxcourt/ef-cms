export const petitionsClerkDeleteDeficiencyStatistic = cerebralTest => {
  return it('petitions clerk deletes the deficiency statistic', async () => {
    const statistics = cerebralTest.getState('caseDetail.statistics');

    const { statisticId } = statistics[0];

    await cerebralTest.runSequence('gotoEditDeficiencyStatisticSequence', {
      docketNumber: cerebralTest.docketNumber,
      statisticId,
    });

    await cerebralTest.runSequence('deleteDeficiencyStatisticsSequence');

    expect(
      cerebralTest
        .getState('caseDetail.statistics')
        .find(s => s.statisticId === statisticId),
    ).toBeUndefined();
  });
};
