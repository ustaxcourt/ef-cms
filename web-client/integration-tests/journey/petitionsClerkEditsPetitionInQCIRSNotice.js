import { caseDetailEditHelper as caseDetailEditHelperComputed } from '../../src/presenter/computeds/caseDetailEditHelper';
import { runCompute } from 'cerebral/test';
import { statisticsFormHelper as statisticsFormHelperComputed } from '../../src/presenter/computeds/statisticsFormHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailEditHelper = withAppContextDecorator(
  caseDetailEditHelperComputed,
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

    let modal = test.getState('modal');

    expect(modal.statisticIndex).toEqual(0);
    expect(modal.penalties).toMatchObject(['', '', '', '', '']);
    expect(modal.showModal).toEqual('CalculatePenaltiesModal');

    // Add additional penalty inputs in the modal
    await test.runSequence('addPenaltyInputSequence');

    expect(modal.penalties).toMatchObject(['', '', '', '', '', '']); // contains additional element in penalties array

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

    // Fill out all statistics values and submit
    for (let i = 0; i < 12; i++) {
      await test.runSequence('updateFormValueSequence', {
        key: `statistics.${i}.year`,
        value: 2019,
      });

      await test.runSequence('updateFormValueSequence', {
        key: `statistics.${i}.deficiencyAmount`,
        value: '$1,000',
      });

      await test.runSequence('updateFormValueSequence', {
        key: `statistics.${i}.totalPenalties`,
        value: '$100',
      });
    }

    //await test.runSequence('saveSavedCaseForLaterSequence');
  });
};
