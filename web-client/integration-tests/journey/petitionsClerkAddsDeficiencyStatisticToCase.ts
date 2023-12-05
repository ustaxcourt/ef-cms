import { CASE_TYPES_MAP } from '../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';

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
      value: '-1000',
    });
    await cerebralTest.runSequence('checkForNegativeValueSequence', {
      key: 'statistics.0.irsDeficiencyAmount',
      value: '-1000',
    });

    const confirmationTextForIrsDeficiencyAmount = cerebralTest.getState(
      'confirmationText.statistics.0.irsDeficiencyAmount',
    );

    expect(confirmationTextForIrsDeficiencyAmount).toBe(
      applicationContext.getConstants().NEGATIVE_VALUE_CONFIRMATION_TEXT,
    );

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

    // Setup second statistic

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

    await cerebralTest.runSequence('addPenaltyInputSequence');

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'penalties.1.penaltyAmount',
      value: '',
    });

    await cerebralTest.runSequence('addPenaltyInputSequence');

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'penalties.2.penaltyAmount',
      value: 800,
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

    expect(cerebralTest.getState('modal.penalties')).toEqual([
      {
        name: 'Penalty 1 (IRS)',
        penaltyAmount: 200,
        penaltyType: 'irsPenaltyAmount',
        statisticId: cerebralTest.getState('form.statisticId'),
      },
      {
        name: 'Penalty 3 (IRS)',
        penaltyAmount: 800,
        penaltyType: 'irsPenaltyAmount',
        statisticId: cerebralTest.getState('form.statisticId'),
      },
    ]);

    const irsTotalPenalties = cerebralTest.getState('form.irsTotalPenalties');
    const determinationTotalPenalties = cerebralTest.getState(
      'form.determinationTotalPenalties',
    );

    expect(irsTotalPenalties).toEqual('1000.00');
    expect(determinationTotalPenalties).toEqual('22.33');

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
