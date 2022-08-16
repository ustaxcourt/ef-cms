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

const createAndBlockCase = (
  cerebralTest,
  procedureType,
  trialLocation,
  overrides = {},
) => {
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest, fakeFile, trialLocation, true, {
    procedureType,
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkSetsCaseReadyForTrial(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkBlocksCase(cerebralTest, trialLocation, overrides);
};

describe('Blocking a Case', () => {
  const cerebralTest = setupTest();

  beforeAll(() => {
    jest.setTimeout(50000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const trialLocation = `Charleston, West Virginia, ${Date.now()}`;
  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, { trialLocation });

  //manual block and unblock - check eligible list
  createAndBlockCase(cerebralTest, 'Small', trialLocation, {
    docketNumberSuffix: 'S',
  });
  createAndBlockCase(cerebralTest, 'Regular', trialLocation);
  createAndBlockCase(cerebralTest, 'Small', trialLocation, {
    docketNumberSuffix: 'S',
  });
  createAndBlockCase(cerebralTest, 'Regular', trialLocation);

  it('petitions clerk views all cases on blocked report', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoBlockedCasesReportSequence');

    await cerebralTest.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });

    expect(cerebralTest.getState('blockedCases').length).toEqual(4);
  });
});
