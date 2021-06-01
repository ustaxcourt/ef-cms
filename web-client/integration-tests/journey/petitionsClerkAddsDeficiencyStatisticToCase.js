import { CASE_TYPES_MAP } from '../../../shared/src/business/entities/EntityConstants';
import { Statistic } from '../../../shared/src/business/entities/Statistic';

export const petitionsClerkAddsDeficiencyStatisticToCase = test => {
  return it('petitions clerk adds deficiency statistic to case after QCing', async () => {
    // set up case to allow statistics to be entered
    await test.runSequence('gotoPetitionQcSequence', {
      docketNumber: test.docketNumber,
      tab: 'IrsNotice',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.deficiency,
    });
    await test.runSequence('refreshStatisticsSequence');
    await test.runSequence('updateFormValueSequence', {
      key: 'statistics.0.year',
      value: 2019,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'statistics.0.irsDeficiencyAmount',
      value: 1000,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'statistics.0.irsTotalPenalties',
      value: 100,
    });
    await test.runSequence('saveSavedCaseForLaterSequence');

    expect(test.getState('validationErrors')).toEqual({});

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

    await test.runSequence('submitAddDeficiencyStatisticsSequence');

    expect(test.getState('validationErrors')).toEqual({
      irsDeficiencyAmount:
        Statistic.VALIDATION_ERROR_MESSAGES.irsDeficiencyAmount,
      irsTotalPenalties: Statistic.VALIDATION_ERROR_MESSAGES.irsTotalPenalties,
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
    expect(
      test.getState('currentViewMetadata.caseDetail.caseInformationTab'),
    ).toEqual('statistics');

    const statisticsAfter = test.getState('caseDetail.statistics');

    expect(statisticsAfter.length).toEqual(statisticsBefore.length + 1);
  });
};
