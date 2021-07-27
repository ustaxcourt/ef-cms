export const petitionsClerkEditsDeficiencyStatistic = cerebralTest => {
  return it('petitions clerk edits deficiency statistic on case', async () => {
    const statistics = cerebralTest.getState('caseDetail.statistics');

    const { statisticId } = statistics[0];

    await cerebralTest.runSequence('gotoEditDeficiencyStatisticSequence', {
      docketNumber: cerebralTest.docketNumber,
      statisticId,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'irsDeficiencyAmount',
      value: 1000,
    });

    await cerebralTest.runSequence('submitEditDeficiencyStatisticSequence');

    expect(
      cerebralTest.getState('caseDetail.statistics')[0].irsDeficiencyAmount,
    ).toEqual(1000);
  });
};
