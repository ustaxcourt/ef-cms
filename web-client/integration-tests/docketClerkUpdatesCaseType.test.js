import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { runCompute } from 'cerebral/test';
import { statisticsFormHelper as statisticsFormHelperComputed } from '../src/presenter/computeds/statisticsFormHelper';
import { withAppContextDecorator } from '../src/withAppContext';

import { loginAs, setupTest, uploadPetition } from './helpers';

const { CASE_TYPES_MAP } = applicationContext.getConstants();
const test = setupTest();

const statisticsFormHelper = withAppContextDecorator(
  statisticsFormHelperComputed,
);

describe('Docket Clerk Verifies Docket Record Display', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  const caseOverrides = {
    caseType: CASE_TYPES_MAP.cdp,
    procedureType: 'Small',
  };

  loginAs(test, 'petitioner@example.com');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(test, caseOverrides);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkSubmitsCaseToIrs(test);

  loginAs(test, 'docketclerk@example.com');
  it('changes the case type to deficiency with irs notice', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoEditPetitionDetailsSequence', {
      docketNumber: test.docketNumber,
    });

    let statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: test.getState(),
    });

    expect(statisticsUiHelper.showStatisticsForm).toEqual(false);

    await test.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.deficiency,
    });

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: test.getState(),
    });

    expect(statisticsUiHelper.showStatisticsForm).toEqual(true);

    await test.runSequence('updatePetitionDetailsSequence');

    expect(test.getState('validationErrors')).toEqual({
      statistics: '"statistics" must contain at least 1 items',
    });

    await test.runSequence('addStatisticToFormSequence');

    await test.runSequence('updatePetitionDetailsSequence');

    expect(test.getState('validationErrors')).toEqual({
      statistics: [
        {
          enterAllValues: 'Enter year, deficiency amount, and total penalties',
          index: 0,
        },
      ],
    });

    await test.runSequence('updateStatisticsFormValueSequence', {
      key: 'statistics.0.year',
      value: 2019,
    });

    await test.runSequence('updateStatisticsFormValueSequence', {
      key: 'statistics.0.irsDeficiencyAmount',
      value: 100,
    });

    await test.runSequence('updateStatisticsFormValueSequence', {
      key: 'statistics.0.irsTotalPenalties',
      value: 100,
    });

    await test.runSequence('updatePetitionDetailsSequence');

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('alertSuccess').message).toEqual('Changes saved.');
    expect(test.getState('caseDetail.statistics').length).toEqual(1);
  });
});
