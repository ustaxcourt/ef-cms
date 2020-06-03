import { caseDetailEditHelper as caseDetailEditHelperComputed } from '../../src/presenter/computeds/caseDetailEditHelper';
import { reviewSavedPetitionHelper as reviewSavedPetitionHelperComputed } from '../../src/presenter/computeds/reviewSavedPetitionHelper';
import { runCompute } from 'cerebral/test';
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

export const petitionsClerkEditsPetitionInQCIRSNotice = test => {
  return it('Petitioner edits Petition IRS Notice', async () => {
    await test.runSequence('gotoPetitionQcSequence', {
      docketNumber: test.docketNumber,
      tab: 'IrsNotice',
    });

    expect(test.getState('currentPage')).toEqual('PetitionQc');

    // No IRS notice
    await test.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: false,
    });

    // Set case type
    await test.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: 'CDP (Lien/Levy)',
    });

    let noticeUiHelper = runCompute(caseDetailEditHelper, {
      state: test.getState(),
    });

    let statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: test.getState(),
    });

    expect(noticeUiHelper.shouldShowIrsNoticeDate).toEqual(false);
    expect(statisticsUiHelper.showStatisticsForm).toEqual(false);

    // Has IRS notice
    await test.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });

    noticeUiHelper = runCompute(caseDetailEditHelper, {
      state: test.getState(),
    });

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: test.getState(),
    });

    expect(noticeUiHelper.shouldShowIrsNoticeDate).toEqual(true);
    expect(statisticsUiHelper.showStatisticsForm).toEqual(false);

    // Set case type to deficiency
    await test.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: 'Deficiency',
    });

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: test.getState(),
    });

    expect(statisticsUiHelper.showStatisticsForm).toEqual(true);

    let statistics = test.getState('form.statistics');

    expect(statistics.length).toEqual(0);

    // Add statistic
    await test.runSequence('addStatisticToFormSequence');

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: test.getState(),
    });

    statistics = test.getState('form.statistics');

    expect(statistics.length).toEqual(1);
    expect(statisticsUiHelper.showAddMoreStatisticsButton).toEqual(true);

    // Add 11 more statistics (reaching the maximum number of 12)
    for (let i = 1; i < 12; i++) {
      await test.runSequence('addStatisticToFormSequence');
    }
    statistics = test.getState('form.statistics');

    expect(statistics.length).toEqual(12);

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: test.getState(),
    });

    expect(statisticsUiHelper.showAddMoreStatisticsButton).toEqual(false);

    // Attempt to add statistic after max is reached
    await test.runSequence('addStatisticToFormSequence');
    statistics = test.getState('form.statistics');

    expect(statistics.length).toEqual(12);

    // Attempt to submit without required statistics fields
    await test.runSequence('saveSavedCaseForLaterSequence');

    let errors = test.getState('validationErrors.statistics');

    expect(errors[0].deficiencyAmount).toContain('required');
    expect(errors[0].totalPenalties).toContain('required');
    expect(errors[0].year).toContain('required');

    // Change between a statistic period and year
    await test.runSequence('updateFormValueSequence', {
      key: 'statistics.0.yearOrPeriod',
      value: 'Period',
    });

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: test.getState(),
    });

    expect(statisticsUiHelper.statisticOptions[0].showYearInput).toBeFalsy();
    expect(statisticsUiHelper.statisticOptions[0].showPeriodInput).toEqual(
      true,
    );

    await test.runSequence('saveSavedCaseForLaterSequence');

    errors = test.getState('validationErrors.statistics');

    expect(errors[0].deficiencyAmount).toContain('required');
    expect(errors[0].totalPenalties).toContain('required');
    expect(errors[0].year).toBeUndefined();

    await test.runSequence('updateFormValueSequence', {
      key: 'statistics.0.yearOrPeriod',
      value: 'Year',
    });

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: test.getState(),
    });

    expect(statisticsUiHelper.statisticOptions[0].showYearInput).toEqual(true);
    expect(statisticsUiHelper.statisticOptions[0].showPeriodInput).toBeFalsy();

    // Select calculate penalties for the first statistic
    await test.runSequence('showCalculatePenaltiesModalSequence', {
      statisticIndex: 0,
    });

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: test.getState(),
    });

    let modal = test.getState('modal');

    expect(modal.statisticIndex).toEqual(0);
    expect(modal.penalties).toMatchObject(['', '', '', '', '']);
    expect(modal.showModal).toEqual('CalculatePenaltiesModal');
    expect(statisticsUiHelper.showAddAnotherPenaltyButton).toEqual(true);

    // Add 5 more penalty inputs in the modal (reaching the maximum number of 10)
    for (let i = 5; i < 10; i++) {
      await test.runSequence('addPenaltyInputSequence');
    }

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: test.getState(),
    });

    modal = test.getState('modal');

    expect(modal.penalties.length).toEqual(10); // contains 5 additional elements in penalties array
    expect(statisticsUiHelper.showAddAnotherPenaltyButton).toEqual(false); // UI should not allow additional to be created

    // Attempt to add penalty inputs in modal after max is reached
    await test.runSequence('addPenaltyInputSequence');

    modal = test.getState('modal');

    expect(modal.penalties.length).toEqual(10);

    // Add some penalties and calculate the sum
    await test.runSequence('updateModalValueSequence', {
      key: 'penalties.0',
      value: '1',
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'penalties.1',
      value: '2',
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'penalties.2',
      value: '3.01',
    });

    await test.runSequence('calculatePenaltiesSequence');

    statistics = test.getState('form.statistics');
    modal = test.getState('modal');

    expect(statistics[0].totalPenalties).toEqual('$6.01');
    expect(modal.showModal).toBeUndefined();

    // Attempt to insert a non-number into currency amount inputs
    await test.runSequence('updateFormValueSequence', {
      key: 'statistics.0.deficiencyAmount',
      value: '$100',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'statistics.0.totalPenalties',
      value: '1,000',
    });

    await test.runSequence('saveSavedCaseForLaterSequence');

    errors = test.getState('validationErrors.statistics');

    expect(errors[0].deficiencyAmount).toContain('must be a number');
    expect(errors[0].deficiencyAmount).toContain('must be a number');

    // Fill out all statistics values and submit
    for (let i = 0; i < 12; i++) {
      await test.runSequence('updateFormValueSequence', {
        key: `statistics.${i}.year`,
        value: 2019,
      });

      await test.runSequence('updateFormValueSequence', {
        key: `statistics.${i}.deficiencyAmount`,
        value: 1000 + i,
      });

      await test.runSequence('updateFormValueSequence', {
        key: `statistics.${i}.totalPenalties`,
        value: 100 + i,
      });
    }

    await test.runSequence('saveSavedCaseForLaterSequence');

    errors = test.getState('validationErrors.statistics');
    expect(errors).toBeUndefined();

    expect(test.getState('currentPage')).toEqual('ReviewSavedPetition');

    let reviewUiHelper = runCompute(reviewSavedPetitionHelper, {
      state: test.getState(),
    });

    expect(reviewUiHelper.formattedStatistics).toEqual([
      expect.objectContaining({
        deficiencyAmount: 1000,
        formattedDeficiencyAmount: '$1,000.00',
        formattedTotalPenalties: '$100.00',
        totalPenalties: 100,
        year: 2019,
      }),
      expect.objectContaining({
        deficiencyAmount: 1001,
        formattedDeficiencyAmount: '$1,001.00',
        formattedTotalPenalties: '$101.00',
        totalPenalties: 101,
        year: 2019,
      }),
      expect.objectContaining({
        deficiencyAmount: 1002,
        formattedDeficiencyAmount: '$1,002.00',
        formattedTotalPenalties: '$102.00',
        totalPenalties: 102,
        year: 2019,
      }),
      expect.objectContaining({
        deficiencyAmount: 1003,
        formattedDeficiencyAmount: '$1,003.00',
        formattedTotalPenalties: '$103.00',
        totalPenalties: 103,
        year: 2019,
      }),
      expect.objectContaining({
        deficiencyAmount: 1004,
        formattedDeficiencyAmount: '$1,004.00',
        formattedTotalPenalties: '$104.00',
        totalPenalties: 104,
        year: 2019,
      }),
      expect.objectContaining({
        deficiencyAmount: 1005,
        formattedDeficiencyAmount: '$1,005.00',
        formattedTotalPenalties: '$105.00',
        totalPenalties: 105,
        year: 2019,
      }),
      expect.objectContaining({
        deficiencyAmount: 1006,
        formattedDeficiencyAmount: '$1,006.00',
        formattedTotalPenalties: '$106.00',
        totalPenalties: 106,
        year: 2019,
      }),
      expect.objectContaining({
        deficiencyAmount: 1007,
        formattedDeficiencyAmount: '$1,007.00',
        formattedTotalPenalties: '$107.00',
        totalPenalties: 107,
        year: 2019,
      }),
      expect.objectContaining({
        deficiencyAmount: 1008,
        formattedDeficiencyAmount: '$1,008.00',
        formattedTotalPenalties: '$108.00',
        totalPenalties: 108,
        year: 2019,
      }),
      expect.objectContaining({
        deficiencyAmount: 1009,
        formattedDeficiencyAmount: '$1,009.00',
        formattedTotalPenalties: '$109.00',
        totalPenalties: 109,
        year: 2019,
      }),
      expect.objectContaining({
        deficiencyAmount: 1010,
        formattedDeficiencyAmount: '$1,010.00',
        formattedTotalPenalties: '$110.00',
        totalPenalties: 110,
        year: 2019,
      }),
      expect.objectContaining({
        deficiencyAmount: 1011,
        formattedDeficiencyAmount: '$1,011.00',
        formattedTotalPenalties: '$111.00',
        totalPenalties: 111,
        year: 2019,
      }),
    ]);
  });
};
