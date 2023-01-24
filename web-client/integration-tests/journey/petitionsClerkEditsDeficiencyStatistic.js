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

    await cerebralTest.runSequence('showCalculatePenaltiesModalSequence', {
      key: 'irsTotalPenalties',
      statisticId,
      subkey: 'irsPenaltyAmount',
      title: 'Calculate Penalties on IRS Notice',
    });

    const irsPenalties = cerebralTest.getState('modal.penalties');

    irsPenalties.forEach((penalty, index) => {
      cerebralTest.runSequence('updateModalValueSequence', {
        key: `penalties.${index}.penaltyAmount`,
        value: 200,
      });
      penalty.penaltyAmount = 200;
    });

    await cerebralTest.runSequence('calculatePenaltiesSequence');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'determinationDeficiencyAmount',
      value: 987,
    });

    await cerebralTest.runSequence('showCalculatePenaltiesModalSequence', {
      key: 'determinationTotalPenalties',
      statisticId,
      subkey: 'determinationPenaltyAmount',
      title: 'Calculate Penalties as determined by Court',
    });

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'penalties.0.penaltyAmount',
      value: 22.33,
    });

    await cerebralTest.runSequence('calculatePenaltiesSequence');

    await cerebralTest.runSequence('showCalculatePenaltiesModalSequence', {
      key: 'irsTotalPenalties',
      statisticId,
      subkey: 'irsPenaltyAmount',
      title: 'Calculate Penalties on IRS Notice',
    });

    expect(cerebralTest.getState('modal.penalties')).toEqual(irsPenalties);

    await cerebralTest.runSequence('submitEditDeficiencyStatisticSequence');

    expect(
      cerebralTest.getState('caseDetail.statistics')[0].irsDeficiencyAmount,
    ).toEqual(1000);
  });
};
