import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { caseDetailEditHelper as caseDetailEditHelperComputed } from '../../src/presenter/computeds/caseDetailEditHelper';
import { reviewSavedPetitionHelper as reviewSavedPetitionHelperComputed } from '../../src/presenter/computeds/reviewSavedPetitionHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { statisticsFormHelper as statisticsFormHelperComputed } from '../../src/presenter/computeds/statisticsFormHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailEditHelper = withAppContextDecorator(
  caseDetailEditHelperComputed,
);

const reviewSavedPetitionHelper = withAppContextDecorator(
  reviewSavedPetitionHelperComputed,
);

const statisticsFormHelper = withAppContextDecorator(
  statisticsFormHelperComputed,
);

const { CASE_TYPES_MAP } = applicationContext.getConstants();

export const petitionsClerkEditsPetitionInQCIRSNotice = cerebralTest => {
  return it('Petitions clerk edits Petition IRS Notice', async () => {
    await cerebralTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: cerebralTest.docketNumber,
      tab: 'IrsNotice',
    });

    expect(cerebralTest.getState('currentPage')).toEqual('PetitionQc');

    // No IRS notice
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: false,
    });

    // Set case type
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.cdp,
    });

    let noticeUiHelper = runCompute(caseDetailEditHelper, {
      state: cerebralTest.getState(),
    });

    let statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: cerebralTest.getState(),
    });

    expect(noticeUiHelper.shouldShowIrsNoticeDate).toEqual(false);
    expect(statisticsUiHelper.showStatisticsForm).toEqual(false);

    // Has IRS notice
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });

    noticeUiHelper = runCompute(caseDetailEditHelper, {
      state: cerebralTest.getState(),
    });

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: cerebralTest.getState(),
    });

    expect(noticeUiHelper.shouldShowIrsNoticeDate).toEqual(true);
    expect(statisticsUiHelper.showStatisticsForm).toEqual(false);

    // Set case type to deficiency
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.deficiency,
    });

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: cerebralTest.getState(),
    });

    expect(statisticsUiHelper.showStatisticsForm).toEqual(true);

    let statistics = cerebralTest.getState('form.statistics');

    expect(statistics.length).toEqual(0);

    // Add statistic
    await cerebralTest.runSequence('addStatisticToFormSequence');

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: cerebralTest.getState(),
    });

    statistics = cerebralTest.getState('form.statistics');

    expect(statistics.length).toEqual(1);
    expect(statisticsUiHelper.showAddMoreStatisticsButton).toEqual(true);

    // Add 11 more statistics (reaching the maximum number of 12)
    for (let i = 1; i < 12; i++) {
      await cerebralTest.runSequence('addStatisticToFormSequence');
    }
    statistics = cerebralTest.getState('form.statistics');

    expect(statistics.length).toEqual(12);

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: cerebralTest.getState(),
    });

    expect(statisticsUiHelper.showAddMoreStatisticsButton).toEqual(false);

    // Attempt to add statistic after max is reached
    await cerebralTest.runSequence('addStatisticToFormSequence');
    statistics = cerebralTest.getState('form.statistics');

    expect(statistics.length).toEqual(12);

    // Attempt to submit without required statistics fields
    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    let errors = cerebralTest.getState('validationErrors');

    expect(errors).toEqual({
      statistics: [
        {
          enterAllValues: 'Enter year, deficiency amount, and total penalties',
          index: 0,
        },
      ],
    });

    // Change between a statistic period and year
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'statistics.0.yearOrPeriod',
      value: 'Period',
    });

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: cerebralTest.getState(),
    });

    expect(statisticsUiHelper.statisticOptions[0].showYearInput).toBeFalsy();
    expect(statisticsUiHelper.statisticOptions[0].showPeriodInput).toEqual(
      true,
    );

    // Attempt to submit without required (period) statistics fields
    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    errors = cerebralTest.getState('validationErrors');

    expect(errors).toEqual({
      statistics: [
        {
          enterAllValues: 'Enter year, deficiency amount, and total penalties',
          index: 0,
        },
      ],
    });

    // Switch back to year input
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'statistics.0.yearOrPeriod',
      value: 'Year',
    });

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: cerebralTest.getState(),
    });

    expect(statisticsUiHelper.statisticOptions[0].showYearInput).toEqual(true);
    expect(statisticsUiHelper.statisticOptions[0].showPeriodInput).toBeFalsy();

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    errors = cerebralTest.getState('validationErrors');

    expect(errors).toEqual({
      statistics: [
        {
          enterAllValues: 'Enter year, deficiency amount, and total penalties',
          index: 0,
        },
      ],
    });

    let statisticId = cerebralTest.getState('form.statistics.0.statisticId');

    // Select calculate penalties for the first statistic
    await cerebralTest.runSequence('showCalculatePenaltiesModalSequence', {
      key: 'irsTotalPenalties',
      statisticId,
      statisticIndex: 0,
      subkey: 'irsPenaltyAmount',
      title: 'Calculate Penalties on IRS Notice',
    });

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: cerebralTest.getState(),
    });

    let modal = cerebralTest.getState('modal');

    expect(modal.statisticIndex).toEqual(0);
    expect(modal.penalties).toMatchObject([
      {
        name: 'Penalty 1 (IRS)',
        penaltyAmount: '',
        penaltyType:
          applicationContext.getConstants().PENALTY_TYPES.IRS_PENALTY_AMOUNT,
      },
    ]);
    expect(modal.showModal).toEqual('CalculatePenaltiesModal');
    expect(statisticsUiHelper.showAddAnotherPenaltyButton).toEqual(true);

    // Add 9 more penalty inputs in the modal (reaching the maximum number of 10)
    for (let i = 1; i < 10; i++) {
      await cerebralTest.runSequence('addPenaltyInputSequence');
    }

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: cerebralTest.getState(),
    });

    modal = cerebralTest.getState('modal');

    expect(modal.penalties.length).toEqual(10); // contains 9 additional elements in penalties array
    expect(statisticsUiHelper.showAddAnotherPenaltyButton).toEqual(false); // UI should not allow additional to be created

    // Attempt to add penalty inputs in modal after max is reached
    await cerebralTest.runSequence('addPenaltyInputSequence');

    modal = cerebralTest.getState('modal');

    expect(modal.penalties.length).toEqual(10);

    // Add some penalties and calculate the sum
    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'penalties.0.penaltyAmount',
      value: '1',
    });

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'penalties.1.penaltyAmount',
      value: '2',
    });

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'penalties.2.penaltyAmount',
      value: '3.01',
    });

    await cerebralTest.runSequence('calculatePenaltiesSequence');

    statistics = cerebralTest.getState('form.statistics');
    modal = cerebralTest.getState('modal');

    expect(statistics[0].irsTotalPenalties).toEqual('6.01');
    expect(modal.showModal).toBeUndefined();

    // Attempt to insert a non-number into currency amount inputs
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'statistics.0.irsDeficiencyAmount',
      value: '$100',
    });

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    errors = cerebralTest.getState('validationErrors');

    expect(errors).toEqual({
      statistics: [
        {
          enterAllValues: 'Enter year, deficiency amount, and total penalties',
          index: 0,
        },
      ],
    });

    // Add 11 more statistics (reaching the maximum number of 12) back to form - they were removed
    // before by empty statistic filtering
    for (let i = 1; i < 12; i++) {
      await cerebralTest.runSequence('addStatisticToFormSequence');
    }
    statistics = cerebralTest.getState('form.statistics');

    expect(statistics.length).toEqual(12);

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: cerebralTest.getState(),
    });

    // Fill out all statistics values except the last one and submit
    // -- the last one should be removed from the form because it was not filled in
    for (let i = 0; i < 11; i++) {
      await cerebralTest.runSequence('updateFormValueSequence', {
        key: `statistics.${i}.year`,
        value: 2019,
      });

      await cerebralTest.runSequence('updateFormValueSequence', {
        key: `statistics.${i}.irsDeficiencyAmount`,
        value: 1000 + i,
      });

      statisticId = cerebralTest.getState(`form.statistics.${i}.statisticId`);

      await cerebralTest.runSequence('showCalculatePenaltiesModalSequence', {
        key: 'irsTotalPenalties',
        statisticId,
        statisticIndex: i,
        subkey: 'irsPenaltyAmount',
        title: 'Calculate Penalties on IRS Notice',
      });

      await cerebralTest.runSequence('updateModalValueSequence', {
        key: 'penalties.0.penaltyAmount',
        value: 100 + i,
      });

      await cerebralTest.runSequence('calculatePenaltiesSequence');
    }

    statistics = cerebralTest.getState('form.statistics');

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    errors = cerebralTest.getState('validationErrors');
    expect(errors).toEqual({});

    expect(cerebralTest.getState('currentPage')).toEqual('ReviewSavedPetition');

    let reviewUiHelper = runCompute(reviewSavedPetitionHelper, {
      state: cerebralTest.getState(),
    });

    expect(reviewUiHelper.formattedStatistics).toEqual([
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,000.00',
        formattedIrsTotalPenalties: '$105.01',
        irsDeficiencyAmount: 1000,
        irsTotalPenalties: '105.01',
        year: 2019,
      }),
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,001.00',
        formattedIrsTotalPenalties: '$101.00',
        irsDeficiencyAmount: 1001,
        irsTotalPenalties: '101.00',
        year: 2019,
      }),
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,002.00',
        formattedIrsTotalPenalties: '$102.00',
        irsDeficiencyAmount: 1002,
        irsTotalPenalties: '102.00',
        year: 2019,
      }),
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,003.00',
        formattedIrsTotalPenalties: '$103.00',
        irsDeficiencyAmount: 1003,
        irsTotalPenalties: '103.00',
        year: 2019,
      }),
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,004.00',
        formattedIrsTotalPenalties: '$104.00',
        irsDeficiencyAmount: 1004,
        irsTotalPenalties: '104.00',
        year: 2019,
      }),
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,005.00',
        formattedIrsTotalPenalties: '$105.00',
        irsDeficiencyAmount: 1005,
        irsTotalPenalties: '105.00',
        year: 2019,
      }),
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,006.00',
        formattedIrsTotalPenalties: '$106.00',
        irsDeficiencyAmount: 1006,
        irsTotalPenalties: '106.00',
        year: 2019,
      }),
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,007.00',
        formattedIrsTotalPenalties: '$107.00',
        irsDeficiencyAmount: 1007,
        irsTotalPenalties: '107.00',
        year: 2019,
      }),
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,008.00',
        formattedIrsTotalPenalties: '$108.00',
        irsDeficiencyAmount: 1008,
        irsTotalPenalties: '108.00',
        year: 2019,
      }),
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,009.00',
        formattedIrsTotalPenalties: '$109.00',
        irsDeficiencyAmount: 1009,
        irsTotalPenalties: '109.00',
        year: 2019,
      }),
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,010.00',
        formattedIrsTotalPenalties: '$110.00',
        irsDeficiencyAmount: 1010,
        irsTotalPenalties: '110.00',
        year: 2019,
      }),
    ]);
  });
};
