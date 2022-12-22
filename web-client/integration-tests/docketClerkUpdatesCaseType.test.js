import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { runCompute } from 'cerebral/test';
import { statisticsFormHelper as statisticsFormHelperComputed } from '../src/presenter/computeds/statisticsFormHelper';
import { withAppContextDecorator } from '../src/withAppContext';

import { loginAs, setupTest, uploadPetition } from './helpers';

const { CASE_TYPES_MAP } = applicationContext.getConstants();
const cerebralTest = setupTest();

const statisticsFormHelper = withAppContextDecorator(
  statisticsFormHelperComputed,
);

describe('Docket Clerk Verifies Docket Record Display', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

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

    await cerebralTest.runSequence('updateStatisticsFormValueSequence', {
      key: 'statistics.0.irsTotalPenalties',
      value: 100,
    });

    await cerebralTest.runSequence('updateCaseDetailsSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Changes saved.',
    );
    expect(cerebralTest.getState('caseDetail.statistics').length).toEqual(1);
  });
});
