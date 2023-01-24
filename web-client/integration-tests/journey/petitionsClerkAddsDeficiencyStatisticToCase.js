import { CASE_TYPES_MAP } from '../../../shared/src/business/entities/EntityConstants';

export const petitionsClerkAddsDeficiencyStatisticToCase = cerebralTest => {
  return it('petitions clerk adds deficiency statistic to case after QCing', async () => {
    // set up case to allow statistics to be entered
    await cerebralTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: cerebralTest.docketNumber,
      tab: 'IrsNotice',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.deficiency,
    });
    await cerebralTest.runSequence('refreshStatisticsSequence');
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'statistics.0.year',
      value: 2019,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'statistics.0.irsDeficiencyAmount',
      value: 1000,
    });

    let statisticId = cerebralTest.getState('form.statistics.0.statisticId');

    // setup first statistic - adding a irsPenaltyAmount

    await cerebralTest.runSequence('showCalculatePenaltiesModalSequence', {
      key: 'irsTotalPenalties',
      statisticId,
      statisticIndex: 0,
      subkey: 'irsPenaltyAmount',
      title: 'Calculate Penalties on IRS Notice',
    });

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'penalties.0.penaltyAmount',
      value: 100,
    });

    await cerebralTest.runSequence('calculatePenaltiesSequence');

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('gotoAddDeficiencyStatisticsSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual(
      'AddDeficiencyStatistics',
    );

    statisticId = cerebralTest.getState('form.statisticId');
    const statisticsBefore = cerebralTest.getState('caseDetail.statistics');

    expect(cerebralTest.getState('form')).toEqual({
      penalties: [],
      statisticId,
      yearOrPeriod: 'Year',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'year',
      value: 2019,
    });

    await cerebralTest.runSequence('submitAddDeficiencyStatisticsSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      irsDeficiencyAmount: 'Enter deficiency on IRS Notice.',
      irsTotalPenalties:
        'Use IRS Penalty Calculator to calculate total penalties.',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'irsDeficiencyAmount',
      value: 1234,
    });

    statisticId = cerebralTest.getState('form.statisticId');

    // Setup second statistic - irsPenaltyAmount

    await cerebralTest.runSequence('showCalculatePenaltiesModalSequence', {
      key: 'irsTotalPenalties',
      statisticId,
      subkey: 'irsPenaltyAmount',
      title: 'Calculate Penalties on IRS Notice',
    });

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'penalties.0.penaltyAmount',
      value: 200,
    });

    await cerebralTest.runSequence('calculatePenaltiesSequence');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'determinationDeficiencyAmount',
      value: 987,
    });

    // setup second statistic - adding a determinationPenaltyAmount

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

    await cerebralTest.runSequence('submitAddDeficiencyStatisticsSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(
      cerebralTest.getState(
        'currentViewMetadata.caseDetail.caseInformationTab',
      ),
    ).toEqual('statistics');

    const statisticsAfter = cerebralTest.getState('caseDetail.statistics');

    console.log('statisticsBefore:', statisticsBefore);
    console.log('statisticsAfter:', statisticsAfter);

    expect(statisticsAfter.length).toEqual(statisticsBefore.length + 1);
  });
};
