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
      title: 'Calculate Penalties as Determined by Court',
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

    await cerebralTest.runSequence('openItemizedPenaltiesModalSequence', {
      determinationTotalPenalties: 22.33,
      irsTotalPenalties: 200.0,
      penalties: [
        {
          entityName: 'Penalty',
          name: 'Penalty 1 (Court)',
          penaltyAmount: 22.33,
          penaltyId: 'e2034a55-c2b3-4965-88c6-a8a2c2dfc57c',
          penaltyType: 'determinationPenaltyAmount',
          statisticId: '4c329b46-c0ef-4f75-8727-276c38a0a7ee',
        },
        {
          entityName: 'Penalty',
          name: 'Penalty 1 (IRS)',
          penaltyAmount: 200,
          penaltyId: '7fa8f8c6-de72-4b6c-bdca-e0814ffcbc6c',
          penaltyType: 'irsPenaltyAmount',
          statisticId: '4c329b46-c0ef-4f75-8727-276c38a0a7ee',
        },
      ],
    });

    const modalState = cerebralTest.getState('modal');

    expect(modalState.itemizedPenalties).toEqual([
      {
        determinationPenaltyAmount: '$22.33',
        irsPenaltyAmount: '$200.00',
      },
    ]);
    expect(modalState.irsTotalPenalties).toEqual('$200.00');
    expect(modalState.determinationTotalPenalties).toEqual('$22.33');

    await cerebralTest.runSequence('clearModalSequence');

    expect(
      cerebralTest.getState('caseDetail.statistics')[0].irsDeficiencyAmount,
    ).toEqual(1000);
  });
};
