import { MOCK_CASE } from '../../shared/src/test/mockCase.js';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkCreatesARemoteTrialSession } from './journey/docketClerkCreatesARemoteTrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { formattedTrialSessionDetails } from '../src/presenter/computeds/formattedTrialSessionDetails';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkManuallyAddsCaseToTrial } from './journey/petitionsClerkManuallyAddsCaseToTrial';
import { petitionsClerkSetsARemoteTrialSessionsSchedule } from './journey/petitionsClerkSetsARemoteTrialSessionsSchedule';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs.js';
import { petitionsClerkViewsNewTrialSession } from './journey/petitionsClerkViewsNewTrialSession';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';
import axios from 'axios';

const test = setupTest();

describe('petitions clerk sets a remote trial session calendar', () => {
  const {
    CASE_TYPES_MAP,
    CHIEF_JUDGE,
    STATUS_TYPES,
  } = applicationContext.getConstants();
  const axiosInstance = axios.create({
    headers: {
      Authorization:
        // mocked admin user
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluIiwibmFtZSI6IlRlc3QgQWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJ1c2VySWQiOiI4NmMzZjg3Yi0zNTBiLTQ3N2QtOTJjMy00M2JkMDk1Y2IwMDYiLCJjdXN0b206cm9sZSI6ImFkbWluIiwic3ViIjoiODZjM2Y4N2ItMzUwYi00NzdkLTkyYzMtNDNiZDA5NWNiMDA2IiwiaWF0IjoxNTgyOTIxMTI1fQ.PBmSyb6_E_53FNG0GiEpAFqTNmooSh4rI0ApUQt3UH8',
      'Content-Type': 'application/json',
    },
    timeout: 2000,
  });
  const trialLocation = `Denver, Colorado, ${Date.now()}`;
  const overrides = {
    maxCases: 2,
    preferredTrialCity: trialLocation,
    sessionType: 'Small',
    trialLocation,
  };
  const caseToMigrate = {
    ...MOCK_CASE,
    associatedJudge: CHIEF_JUDGE,
    caseCaption: 'Migrated Eligible Case',
    docketNumber: '777-17',
    preferredTrialCity: trialLocation,
    procedureType: 'Small',
    status: STATUS_TYPES.generalDocketReadyForTrial,
  };

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  describe(`Create a remote trial session with Small session type for '${trialLocation}'`, () => {
    loginAs(test, 'docketclerk@example.com');
    docketClerkCreatesARemoteTrialSession(test, overrides);
    docketClerkViewsTrialSessionList(test);
    docketClerkViewsNewTrialSession(test);
  });

  describe('Create cases', () => {
    describe('cases #1-3 - eligible for trial', () => {
      const caseOverrides = {
        ...overrides,
        caseType: CASE_TYPES_MAP.cdp,
        procedureType: 'Small',
      };

      for (let i = 0; i < 3; i++) {
        loginAs(test, 'petitioner@example.com');
        it(`create case ${i} and set ready for trial`, async () => {
          const caseDetail = await uploadPetition(test, caseOverrides);
          expect(caseDetail.docketNumber).toBeDefined();
          test.docketNumber = caseDetail.docketNumber;
        });

        loginAs(test, 'petitionsclerk@example.com');
        petitionsClerkSubmitsCaseToIrs(test);

        loginAs(test, 'docketclerk@example.com');
        docketClerkSetsCaseReadyForTrial(test);
      }
    });

    describe('case #4 - migrated and eligible for trial', () => {
      it('migrate case', async () => {
        await axiosInstance.post(
          'http://localhost:4000/migrate/case',
          caseToMigrate,
        );
      });
    });

    describe('case #5 - manually added to session', () => {
      loginAs(test, 'petitionsclerk@example.com');
      test.casesReadyForTrial = [];
      petitionsClerkCreatesNewCase(test, fakeFile, trialLocation);
      petitionsClerkManuallyAddsCaseToTrial(test);
    });
  });

  describe('petitions clerk sets calendar for trial session', () => {
    petitionsClerkViewsNewTrialSession(test);
    markAllCasesAsQCed(test, () => [
      test.docketNumber,
      caseToMigrate.docketNumber,
    ]);

    petitionsClerkSetsARemoteTrialSessionsSchedule(test);

    it('petitions clerk should be redirected to print paper service for the trial session', async () => {
      expect(test.getState('currentPage')).toEqual('PrintPaperTrialNotices');
    });

    it('petitions clerk verifies that both cases were set on the trial session', async () => {
      await test.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: test.trialSessionId,
      });

      const trialSessionFormatted = runCompute(
        withAppContextDecorator(formattedTrialSessionDetails),
        {
          state: test.getState(),
        },
      );

      expect(trialSessionFormatted.openCases.length).toEqual(2);
    });
  });
});
