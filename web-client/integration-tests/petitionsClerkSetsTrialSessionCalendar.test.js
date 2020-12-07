import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { fakeFile, loginAs, setupTest } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkManuallyAddsCaseToTrial } from './journey/petitionsClerkManuallyAddsCaseToTrial';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkViewsNewTrialSession } from './journey/petitionsClerkViewsNewTrialSession';

const test = setupTest();

describe('petitions clerk sets a trial session calendar', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  const trialLocation = `Denver, Colorado, ${Date.now()}`;
  console.log('trial location is', trialLocation);
  const overrides = {
    preferredTrialCity: trialLocation,
    sessionType: 'Small',
    trialLocation,
  };

  describe(`Create trial session with Small session type for '${trialLocation}'`, () => {
    loginAs(test, 'docketclerk@example.com');
    docketClerkCreatesATrialSession(test, overrides);
    docketClerkViewsTrialSessionList(test, overrides);
    docketClerkViewsNewTrialSession(test);
  });

  describe('Create cases', () => {
    describe('case #1 - eligible for trial', () => {
      loginAs(test, 'petitionsclerk@example.com');
      petitionsClerkCreatesNewCase(test, fakeFile, trialLocation);

      loginAs(test, 'docketclerk@example.com');
      docketClerkSetsCaseReadyForTrial(test);
    });

    describe('case #2 - manually added to session', () => {
      loginAs(test, 'petitionsclerk@example.com');
      test.casesReadyForTrial = [];
      petitionsClerkCreatesNewCase(test, fakeFile, trialLocation);
      petitionsClerkManuallyAddsCaseToTrial(test);
    });
  });

  describe('petitions clerk sets calendar for trial session', () => {
    petitionsClerkViewsNewTrialSession(test);
    markAllCasesAsQCed(test, () => [test.docketNumber]);
    petitionsClerkSetsATrialSessionsSchedule(test);
    it('petitions clerk should be redirected to print paper service for the trial session', async () => {
      expect(test.getState('currentPage')).toEqual('PrintPaperTrialNotices');
    });
  });
});
