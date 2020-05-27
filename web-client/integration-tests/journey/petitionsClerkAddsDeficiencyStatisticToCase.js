export const petitionsClerkAddsDeficiencyStatisticToCase = test => {
  return it('petitions clerk adds deficiency statistic to case after QCing', async () => {
    await test.runSequence('gotoAddDeficiencyStatisticsSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('AddDeficiencyStatistics');

    const statisticsBefore = test.getState('caseDetail.statistics');

    expect(test.getState('form')).toEqual({
      yearOrPeriod: 'Year',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'year',
      value: 2019,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'irsDeficiencyAmount',
      value: 1234,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsTotalPenalties',
      value: 0,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'determinationDeficiencyAmount',
      value: 987,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'determinationTotalPenalties',
      value: 22.33,
    });

    await test.runSequence('submitAddDeficiencyStatisticsSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const statisticsAfter = test.getState('caseDetail.statistics');

    expect(statisticsAfter.length).toEqual(statisticsBefore.length + 1);
  });
};
