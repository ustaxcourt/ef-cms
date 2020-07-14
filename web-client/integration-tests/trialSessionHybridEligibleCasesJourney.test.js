import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';

const test = setupTest();
const { CASE_TYPES_MAP } = applicationContext.getConstants();

describe('Trial Session Eligible Cases - Both small and regular cases get scheduled to the trial session that’s a hybrid session', () => {
  beforeAll(() => {
    jest.setTimeout(50000);
  });

  afterAll(() => {
    test.closeSocket();
  });
  const trialLocation = `Despacito, Texas, ${Date.now()}`;
  const overrides = {
    maxCases: 2,
    preferredTrialCity: trialLocation,
    sessionType: 'Hybrid',
    trialLocation,
  };
  const createdCaseIds = [];

  describe(`Create trial session with Hybrid session type for '${trialLocation}' with max case count = 2`, () => {
    loginAs(test, 'docketclerk@example.com');
    docketClerkCreatesATrialSession(test, overrides);
    docketClerkViewsTrialSessionList(test, overrides);
    docketClerkViewsNewTrialSession(test);
  });

  describe('Create cases', () => {
    describe(`Case with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small case type with filed date 1/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: CASE_TYPES_MAP.deficiency,
        procedureType: 'Small',
        receivedAtDay: '01',
        receivedAtMonth: '01',
        receivedAtYear: '2019',
      };
      loginAs(test, 'petitioner@example.com');
      it('Create case #1', async () => {
        const caseDetail = await uploadPetition(test, caseOverrides);
        expect(caseDetail.docketNumber).toBeDefined();
        createdCaseIds.push(caseDetail.caseId);
        test.docketNumber = caseDetail.docketNumber;
      });

      loginAs(test, 'petitionsclerk@example.com');
      petitionsClerkSubmitsCaseToIrs(test);

      loginAs(test, 'docketclerk@example.com');
      docketClerkSetsCaseReadyForTrial(test);
    });

    describe(`Case with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Regular case type with filed date 1/2/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: CASE_TYPES_MAP.deficiency,
        procedureType: 'Regular',
        receivedAtDay: '02',
        receivedAtMonth: '01',
        receivedAtYear: '2019',
      };
      loginAs(test, 'petitioner@example.com');
      it('Create case #2', async () => {
        const caseDetail = await uploadPetition(test, caseOverrides);
        expect(caseDetail.docketNumber).toBeDefined();
        createdCaseIds.push(caseDetail.caseId);
        test.docketNumber = caseDetail.docketNumber;
      });

      loginAs(test, 'petitionsclerk@example.com');
      petitionsClerkSubmitsCaseToIrs(test);

      loginAs(test, 'docketclerk@example.com');
      docketClerkSetsCaseReadyForTrial(test);
    });

    describe(`Case with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small case type with filed date 2/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: CASE_TYPES_MAP.deficiency,
        procedureType: 'Small',
        receivedAtDay: '01',
        receivedAtMonth: '02',
        receivedAtYear: '2019',
      };
      loginAs(test, 'petitioner@example.com');
      it('Create case #3', async () => {
        const caseDetail = await uploadPetition(test, caseOverrides);
        expect(caseDetail.docketNumber).toBeDefined();
        createdCaseIds.push(caseDetail.caseId);
        test.docketNumber = caseDetail.docketNumber;
      });

      loginAs(test, 'petitionsclerk@example.com');
      petitionsClerkSubmitsCaseToIrs(test);

      loginAs(test, 'docketclerk@example.com');
      docketClerkSetsCaseReadyForTrial(test);
    });
  });

  describe(`Result: Case #1, #2, and #3 should show as eligible for '${trialLocation}' session`, () => {
    loginAs(test, 'petitionsclerk@example.com');

    it(`Case #1, #2, and #3 should show as eligible for '${trialLocation}' session`, async () => {
      await test.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: test.trialSessionId,
      });

      expect(test.getState('trialSession.eligibleCases').length).toEqual(3);
      expect(test.getState('trialSession.eligibleCases.0.caseId')).toEqual(
        createdCaseIds[0],
      );
      expect(test.getState('trialSession.eligibleCases.1.caseId')).toEqual(
        createdCaseIds[1],
      );
      expect(test.getState('trialSession.eligibleCases.2.caseId')).toEqual(
        createdCaseIds[2],
      );
      expect(test.getState('trialSession.isCalendared')).toEqual(false);
    });
  });

  describe('Calendar clerk marks all eligible cases as QCed', () => {
    loginAs(test, 'petitionsclerk@example.com');
    markAllCasesAsQCed(test, () => [
      createdCaseIds[0],
      createdCaseIds[1],
      createdCaseIds[2],
    ]);
  });

  describe(`Set calendar for '${trialLocation}' session`, () => {
    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkSetsATrialSessionsSchedule(test);
  });

  describe(`Result: Case #1 and #2 are assigned to '${trialLocation}' session`, () => {
    loginAs(test, 'petitionsclerk@example.com');

    it(`Case #1 and #2 are assigned to '${trialLocation}' session`, async () => {
      await test.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: test.trialSessionId,
      });

      expect(test.getState('trialSession.calendaredCases').length).toEqual(2);
      expect(test.getState('trialSession.isCalendared')).toEqual(true);
      expect(test.getState('trialSession.calendaredCases.0.caseId')).toEqual(
        createdCaseIds[0],
      );
      expect(test.getState('trialSession.calendaredCases.1.caseId')).toEqual(
        createdCaseIds[1],
      );
    });
  });
});
