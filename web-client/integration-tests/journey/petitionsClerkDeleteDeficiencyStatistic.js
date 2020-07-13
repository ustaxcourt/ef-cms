export const petitionsClerkDeleteDeficiencyStatistic = test => {
  return it('petitions clerk deletes the deficiency statistic', async () => {
    const statistics = test.getState('caseDetail.statistics');

    const { statisticId } = statistics[0];

    await test.runSequence('gotoEditDeficiencyStatisticSequence', {
      docketNumber: test.docketNumber,
      statisticId,
    });

    await test.runSequence('deleteDeficiencyStatisticsSequence');

    expect(
      test
        .getState('caseDetail.statistics')
        .find(s => s.statisticId === statisticId),
    ).toBeUndefined();
  });
};
