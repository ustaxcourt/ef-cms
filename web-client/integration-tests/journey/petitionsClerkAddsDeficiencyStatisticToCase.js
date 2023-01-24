import { CASE_TYPES_MAP } from '../../../shared/src/business/entities/EntityConstants';
import { Penalty } from '../../../shared/src/business/entities/Penalty';
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

    // Do we get it from form or from caseDetail lets figure this out,
    let statisticId = cerebralTest.getState('form.statistics.0.statisticId');
    console.log('statistic', statisticId);

    //! FIXME
    // await cerebralTest.runSequence('updateFormValueSequence', {
    //   key: 'statistics.0.irsTotalPenalties',
    //   value: 100,
    // });

    // run the sequence that opens the modal
    await cerebralTest.runSequence('showCalculatePenaltiesModalSequence', {
      key: 'irsTotalPenalties',
      statisticId,
      statisticIndex: 0,
      subkey: 'irsPenaltyAmount',
      title: 'Calculate Penalties on IRS Notice',
    });

    // update penalties on modal to set irsTotalPenalties on Statistic form as it is a disabled
    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'penalties.0.penaltyAmount',
      value: 100,
    });
    // I don't think we need this anymore?
    // await cerebralTest.runSequence('updateModalValueSequence', {
    //   key: 'penalties.0.inProgress',
    //   value: true,
    // });

    // on onconfirm sequence on modal to save changes and prepare state on statistic form
    // this will set irsTotalPenalties directly
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

    // Do here what we did above
    // Do we get it from form or from caseDetail lets figure this out,
    statisticId = cerebralTest.getState('form.statisticId');
    console.log('statistic', statisticId);
    // run the sequence that opens the modal
    await cerebralTest.runSequence('showCalculatePenaltiesModalSequence', {
      key: 'irsTotalPenalties',
      statisticId,
      subkey: 'irsPenaltyAmount',
      title: 'Calculate Penalties on IRS Notice',
    });

    // update penalties on modal to set irsTotalPenalties on Statistic form as it is a disabled
    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'penalties.0.penaltyAmount',
      value: 200,
    });

    // on onconfirm sequence on modal to save changes and prepare state on statistic form
    // this will set irsTotalPenalties directly
    await cerebralTest.runSequence('calculatePenaltiesSequence');

    // await cerebralTest.runSequence('updateFormValueSequence', {
    //   key: 'irsTotalPenalties',
    //   value: 0,
    // });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'determinationDeficiencyAmount',
      value: 987,
    });

    //! FIXME
    // await cerebralTest.runSequence('updateFormValueSequence', {
    //   key: 'determinationTotalPenalties',
    //   value: 22.33,
    // });
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

    expect(statisticsAfter.length).toEqual(statisticsBefore.length + 1);
  });
};
