import { blockedCasesReportHelper as blockedCasesReportHelperComputed } from '../src/presenter/computeds/blockedCasesReportHelper';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import {
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
} from './helpers';
import { petitionsClerkBlocksCase } from './journey/petitionsClerkBlocksCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const blockedCasesReportHelper = withAppContextDecorator(
  blockedCasesReportHelperComputed,
);

const createAndBlockCase = (
  cerebralTest,
  procedureType,
  trialLocation,
  overrides = {},
  docketNumbers,
) => {
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest, fakeFile, trialLocation, true, {
    procedureType,
  });
  it('track the docket number', () => {
    docketNumbers.push(cerebralTest.docketNumber);
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkSetsCaseReadyForTrial(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkBlocksCase(cerebralTest, trialLocation, overrides);
};

describe('Blocking a Case', () => {
  const cerebralTest = setupTest();
  const docketNumbers = [];

  beforeAll(() => {
    jest.setTimeout(50000);
  });

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
    docketNumbers,
  );
  createAndBlockCase(
    cerebralTest,
    'Regular',
    trialLocation,
    undefined,
    docketNumbers,
  );
  createAndBlockCase(
    cerebralTest,
    'Small',
    trialLocation,
    {
      docketNumberSuffix: 'S',
    },
    docketNumbers,
  );
  createAndBlockCase(
    cerebralTest,
    'Regular',
    trialLocation,
    undefined,
    docketNumbers,
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
        docketNumbers.map(docketNumber =>
          expect.objectContaining({
            docketNumber,
          }),
        ),
      ),
    );
  });

  it('petitions clerk views small cases on blocked report', async () => {
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

    expect(blockedCasesFormatted.length).toEqual(2);
  });
});
