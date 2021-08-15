import { CASE_TYPES_MAP } from '../../../shared/src/business/entities/EntityConstants';
import { Statistic } from '../../../shared/src/business/entities/Statistic';

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
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'statistics.0.irsTotalPenalties',
      value: 100,
    });
    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('gotoAddDeficiencyStatisticsSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual(
      'AddDeficiencyStatistics',
    );

    const statisticsBefore = cerebralTest.getState('caseDetail.statistics');

    expect(cerebralTest.getState('form')).toEqual({
      yearOrPeriod: 'Year',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'year',
      value: 2019,
    });

    await cerebralTest.runSequence('submitAddDeficiencyStatisticsSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      irsDeficiencyAmount:
        Statistic.VALIDATION_ERROR_MESSAGES.irsDeficiencyAmount,
      irsTotalPenalties: Statistic.VALIDATION_ERROR_MESSAGES.irsTotalPenalties,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'irsDeficiencyAmount',
      value: 1234,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'irsTotalPenalties',
      value: 0,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'determinationDeficiencyAmount',
      value: 987,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'determinationTotalPenalties',
      value: 22.33,
    });

    await cerebralTest.runSequence('submitAddDeficiencyStatisticsSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(
      cerebralTest.getState(
        'currentViewMetadata.caseDetail.caseInformationTab',
      ),
    ).toEqual('statistics');

    const statisticsAfter = cerebralTest.getState('caseDetail.statistics');

    expect(statisticsAfter.length).toEqual(statisticsBefore.length + 1);
  });
};
