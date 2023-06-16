import { CASE_TYPES_MAP } from '../../shared/src/business/entities/EntityConstants';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { statisticsFormHelper as statisticsFormHelperComputed } from '../src/presenter/computeds/statisticsFormHelper';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Docket Clerk Verifies Docket Record Display', () => {
  const cerebralTest = setupTest();

  const statisticsFormHelper = withAppContextDecorator(
    statisticsFormHelperComputed,
  );

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const caseOverrides = {
    caseType: CASE_TYPES_MAP.cdp,
    procedureType: 'Small',
  };

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, caseOverrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkSubmitsCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('changes the case type to deficiency with irs notice', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoEditCaseDetailsSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    let statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: cerebralTest.getState(),
    });

    expect(statisticsUiHelper.showStatisticsForm).toEqual(false);

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.deficiency,
    });

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: cerebralTest.getState(),
    });

    expect(statisticsUiHelper.showStatisticsForm).toEqual(true);

    await cerebralTest.runSequence('updateCaseDetailsSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      statistics: '"statistics" must contain at least 1 items',
    });

    await cerebralTest.runSequence('addStatisticToFormSequence');

    await cerebralTest.runSequence('updateCaseDetailsSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      statistics: [
        {
          enterAllValues: 'Enter year, deficiency amount, and total penalties',
          index: 0,
        },
      ],
    });

    await cerebralTest.runSequence('updateStatisticsFormValueSequence', {
      key: 'statistics.0.year',
      value: 2019,
    });

    await cerebralTest.runSequence('updateStatisticsFormValueSequence', {
      key: 'statistics.0.irsDeficiencyAmount',
      value: 100,
    });

    let statisticId = cerebralTest.getState('form.statistics.0.statisticId');

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

    await cerebralTest.runSequence('addPenaltyInputSequence');
    await cerebralTest.runSequence('addPenaltyInputSequence');

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'penalties.2.penaltyAmount',
      value: 200,
    });

    await cerebralTest.runSequence('calculatePenaltiesSequence');

    await cerebralTest.runSequence('showCalculatePenaltiesModalSequence', {
      key: 'irsTotalPenalties',
      statisticId,
      statisticIndex: 0,
      subkey: 'irsPenaltyAmount',
      title: 'Calculate Penalties on IRS Notice',
    });

    const penaltiesOnModal = cerebralTest.getState('modal.penalties');

    expect(penaltiesOnModal.length).toEqual(2);

    await cerebralTest.runSequence('calculatePenaltiesSequence');

    await cerebralTest.runSequence('updateCaseDetailsSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Changes saved.',
    );
    expect(cerebralTest.getState('caseDetail.statistics').length).toEqual(1);
  });
});
