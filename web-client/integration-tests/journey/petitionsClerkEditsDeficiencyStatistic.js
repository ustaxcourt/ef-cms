export const petitionsClerkEditsDeficiencyStatistic = test => {
  return it('petitions clerk edits deficiency statistic on case', async () => {
    const statistics = test.getState('caseDetail.statistics');

    const { statisticId } = statistics[0];

    await test.runSequence('gotoEditDeficiencyStatisticSequence', {
      docketNumber: test.docketNumber,
      statisticId,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'irsDeficiencyAmount',
      value: 1000,
    });

    await test.runSequence('submitEditDeficiencyStatisticSequence');

    expect(
      test.getState('caseDetail.statistics')[0].irsDeficiencyAmount,
    ).toEqual(1000);
  });
};
