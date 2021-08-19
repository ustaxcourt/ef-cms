import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { formattedTrialSessionDetails } from '../src/presenter/computeds/formattedTrialSessionDetails';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkManuallyAddsCaseToTrial } from './journey/petitionsClerkManuallyAddsCaseToTrial';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs.js';
import { petitionsClerkViewsNewTrialSession } from './journey/petitionsClerkViewsNewTrialSession';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const cerebralTest = setupTest();

describe('petitions clerk sets a trial session calendar', () => {
  const { CASE_TYPES_MAP } = applicationContext.getConstants();
  const trialLocation = `Denver, Colorado, ${Date.now()}`;
  const overrides = {
    maxCases: 2,
    preferredTrialCity: trialLocation,
    sessionType: 'Small',
    trialLocation,
  };

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe(`Create trial session with Small session type for '${trialLocation}'`, () => {
    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkCreatesATrialSession(cerebralTest, overrides);
    docketClerkViewsTrialSessionList(cerebralTest);
    docketClerkViewsNewTrialSession(cerebralTest);
  });

  describe('Create cases', () => {
    describe('cases #1-3 - eligible for trial', () => {
      const caseOverrides = {
        ...overrides,
        caseType: CASE_TYPES_MAP.cdp,
        procedureType: 'Small',
      };

      for (let i = 0; i < 3; i++) {
        loginAs(cerebralTest, 'petitioner@example.com');
        it(`create case ${i} and set ready for trial`, async () => {
          const caseDetail = await uploadPetition(cerebralTest, caseOverrides);
          expect(caseDetail.docketNumber).toBeDefined();
          cerebralTest.docketNumber = caseDetail.docketNumber;
        });

        loginAs(cerebralTest, 'petitionsclerk@example.com');
        petitionsClerkSubmitsCaseToIrs(cerebralTest);

        loginAs(cerebralTest, 'docketclerk@example.com');
        docketClerkSetsCaseReadyForTrial(cerebralTest);
      }
    });

    describe('case #5 - manually added to session', () => {
      loginAs(cerebralTest, 'petitionsclerk@example.com');
      cerebralTest.casesReadyForTrial = [];
      petitionsClerkCreatesNewCase(cerebralTest, fakeFile, trialLocation);
      petitionsClerkManuallyAddsCaseToTrial(cerebralTest);
    });
  });

  describe('petitions clerk sets calendar for trial session', () => {
    petitionsClerkViewsNewTrialSession(cerebralTest);
    markAllCasesAsQCed(cerebralTest, () => [cerebralTest.docketNumber]);
    petitionsClerkSetsATrialSessionsSchedule(cerebralTest);

    it('petitions clerk should be redirected to print paper service for the trial session', () => {
      expect(cerebralTest.getState('currentPage')).toEqual(
        'PrintPaperTrialNotices',
      );
    });

    it('petitions clerk verifies that both cases were set on the trial session', async () => {
      await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: cerebralTest.trialSessionId,
      });

      const trialSessionFormatted = runCompute(
        withAppContextDecorator(formattedTrialSessionDetails),
        {
          state: cerebralTest.getState(),
        },
      );

      expect(trialSessionFormatted.openCases.length).toEqual(1);
    });
  });
});
