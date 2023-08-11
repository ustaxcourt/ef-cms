import { blockedCasesReportHelper as blockedCasesReportHelperComputed } from '../src/presenter/computeds/blockedCasesReportHelper';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { loginAs, refreshElasticsearchIndex, setupTest } from './helpers';
import { petitionsClerkBlocksCase } from './journey/petitionsClerkBlocksCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

const blockedCasesReportHelper = withAppContextDecorator(
  blockedCasesReportHelperComputed,
);

const createAndBlockCase = (
  cerebralTest,
  procedureType,
  trialLocation,
  overrides = {},
  blockedCases,
) => {
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest, {
    procedureType,
    trialLocation,
  });
  it('track the docket number', () => {
    blockedCases.push({
      docketNumber: cerebralTest.docketNumber,
      procedureType,
    });
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkSetsCaseReadyForTrial(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkBlocksCase(cerebralTest, trialLocation, overrides);
};

describe('Blocking a Case', () => {
  const cerebralTest = setupTest();

  const blockedCases = [];

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const trialLocation = `Charleston, West Virginia, ${Date.now()}`;
  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, { trialLocation });

  createAndBlockCase(
    cerebralTest,
    'Small',
    trialLocation,
    {
      docketNumberSuffix: 'S',
    },
    blockedCases,
  );
  createAndBlockCase(
    cerebralTest,
    'Regular',
    trialLocation,
    undefined,
    blockedCases,
  );
  createAndBlockCase(
    cerebralTest,
    'Small',
    trialLocation,
    {
      docketNumberSuffix: 'S',
    },
    blockedCases,
  );
  createAndBlockCase(
    cerebralTest,
    'Regular',
    trialLocation,
    undefined,
    blockedCases,
  );

  it('petitions clerk views all cases on blocked report', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoBlockedCasesReportSequence');

    await cerebralTest.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });

    expect(cerebralTest.getState('blockedCases')).toMatchObject(
      expect.arrayContaining(
        blockedCases.map(blockedCase =>
          expect.objectContaining({
            docketNumber: blockedCase.docketNumber,
          }),
        ),
      ),
    );
  });

  it('petitions clerk views Small cases on blocked report', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoBlockedCasesReportSequence');

    await cerebralTest.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: 'Small',
    });

    const { blockedCasesFormatted } = runCompute(blockedCasesReportHelper, {
      state: cerebralTest.getState(),
    });

    expect(blockedCasesFormatted).not.toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          procedureType: 'Regular',
        }),
      ]),
    );
  });

  it('petitions clerk views Regular cases on blocked report', async () => {
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: 'Regular',
    });

    const { blockedCasesFormatted } = runCompute(blockedCasesReportHelper, {
      state: cerebralTest.getState(),
    });

    expect(blockedCasesFormatted).not.toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          procedureType: 'Small',
        }),
      ]),
    );
  });

  it('petitions clerk views All cases on blocked report', async () => {
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: 'All',
    });

    const { blockedCasesFormatted } = runCompute(blockedCasesReportHelper, {
      state: cerebralTest.getState(),
    });

    expect(blockedCasesFormatted).toMatchObject(
      expect.arrayContaining(
        blockedCases.map(blockedCase =>
          expect.objectContaining({
            docketNumber: blockedCase.docketNumber,
          }),
        ),
      ),
    );
  });

  it('should reset the procedureType select back to All when changing the trial location dropdown', async () => {
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: 'Small',
    });

    expect(cerebralTest.getState('form.procedureType')).toEqual('Small');

    await cerebralTest.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: 'No existing trial location',
    });

    expect(cerebralTest.getState('form.procedureType')).toEqual('All');
  });
});
