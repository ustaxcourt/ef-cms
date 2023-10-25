import {
  CASE_TYPES_MAP,
  SESSION_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';

describe('Trial Session Eligible Cases - Both small and regular cases get scheduled to the trial session that’s a hybrid session', () => {
  const cerebralTest = setupTest();

  const trialLocation = `Despacito, Texas, ${Date.now()}`;
  const overrides = {
    maxCases: 2,
    preferredTrialCity: trialLocation,
    sessionType: SESSION_TYPES.hybrid,
    trialLocation,
  };
  const createdDocketNumbers: string[] = [];

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe(`Create trial session with Hybrid session type for '${trialLocation}' with max case count = 2`, () => {
    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkCreatesATrialSession(cerebralTest, overrides);
    docketClerkViewsTrialSessionList(cerebralTest);
    docketClerkViewsNewTrialSession(cerebralTest);
  });

  describe(`Also create trial session with Hybrid-S session type for '${trialLocation}' with max case count = 2`, () => {
    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkCreatesATrialSession(cerebralTest, overrides);
    docketClerkViewsTrialSessionList(cerebralTest);
    docketClerkViewsNewTrialSession(cerebralTest);
  });

  describe('Create cases', () => {
    describe(`Case with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small case type with filed date 1/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: CASE_TYPES_MAP.deficiency,
        procedureType: 'Small',
        receivedAt: '2019-01-01T04:00:00.000Z',
      };
      loginAs(cerebralTest, 'petitioner@example.com');
      it('Create case #1', async () => {
        const caseDetail = await uploadPetition(cerebralTest, caseOverrides);
        expect(caseDetail.docketNumber).toBeDefined();
        createdDocketNumbers.push(caseDetail.docketNumber);
        cerebralTest.docketNumber = caseDetail.docketNumber;
      });

      loginAs(cerebralTest, 'petitionsclerk@example.com');
      petitionsClerkSubmitsCaseToIrs(cerebralTest);

      loginAs(cerebralTest, 'docketclerk@example.com');
      docketClerkSetsCaseReadyForTrial(cerebralTest);
    });

    describe(`Case with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Regular case type with filed date 1/2/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: CASE_TYPES_MAP.deficiency,
        procedureType: 'Regular',
        receivedAt: '2019-01-02T04:00:00.000Z',
      };
      loginAs(cerebralTest, 'petitioner@example.com');
      it('Create case #2', async () => {
        const caseDetail = await uploadPetition(cerebralTest, caseOverrides);
        expect(caseDetail.docketNumber).toBeDefined();
        createdDocketNumbers.push(caseDetail.docketNumber);
        cerebralTest.docketNumber = caseDetail.docketNumber;
      });

      loginAs(cerebralTest, 'petitionsclerk@example.com');
      petitionsClerkSubmitsCaseToIrs(cerebralTest);

      loginAs(cerebralTest, 'docketclerk@example.com');
      docketClerkSetsCaseReadyForTrial(cerebralTest);
    });

    describe(`Case with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small case type with filed date 2/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: CASE_TYPES_MAP.deficiency,
        procedureType: 'Small',
        receivedAt: '2019-02-01T04:00:00.000Z',
      };
      loginAs(cerebralTest, 'petitioner@example.com');
      it('Create case #3', async () => {
        const caseDetail = await uploadPetition(cerebralTest, caseOverrides);
        expect(caseDetail.docketNumber).toBeDefined();
        createdDocketNumbers.push(caseDetail.docketNumber);
        cerebralTest.docketNumber = caseDetail.docketNumber;
      });

      loginAs(cerebralTest, 'petitionsclerk@example.com');
      petitionsClerkSubmitsCaseToIrs(cerebralTest);

      loginAs(cerebralTest, 'docketclerk@example.com');
      docketClerkSetsCaseReadyForTrial(cerebralTest);
    });
  });

  describe(`Result: Case #1, #2, and #3 should show as eligible for '${trialLocation}' Hybrid and Hybrid-S sessions`, () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');

    it('Case #1, #2, and #3 should show as eligible for the Hybrid-S session', async () => {
      await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: cerebralTest.trialSessionId,
      });

      expect(
        cerebralTest.getState('trialSession.eligibleCases').length,
      ).toEqual(3);
      expect(
        cerebralTest.getState('trialSession.eligibleCases.0.docketNumber'),
      ).toEqual(createdDocketNumbers[0]);
      expect(
        cerebralTest.getState('trialSession.eligibleCases.1.docketNumber'),
      ).toEqual(createdDocketNumbers[1]);
      expect(
        cerebralTest.getState('trialSession.eligibleCases.2.docketNumber'),
      ).toEqual(createdDocketNumbers[2]);
      expect(cerebralTest.getState('trialSession.isCalendared')).toEqual(false);
    });

    it('Case #1, #2, and #3 should show as eligible for the Hybrid session', async () => {
      await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: cerebralTest.trialSessionId,
      });

      expect(
        cerebralTest.getState('trialSession.eligibleCases').length,
      ).toEqual(3);
      expect(
        cerebralTest.getState('trialSession.eligibleCases.0.docketNumber'),
      ).toEqual(createdDocketNumbers[0]);
      expect(
        cerebralTest.getState('trialSession.eligibleCases.1.docketNumber'),
      ).toEqual(createdDocketNumbers[1]);
      expect(
        cerebralTest.getState('trialSession.eligibleCases.2.docketNumber'),
      ).toEqual(createdDocketNumbers[2]);
      expect(cerebralTest.getState('trialSession.isCalendared')).toEqual(false);
    });
  });

  describe('Calendar clerk marks all eligible cases as QCed', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    markAllCasesAsQCed(cerebralTest, () => [
      createdDocketNumbers[0],
      createdDocketNumbers[1],
      createdDocketNumbers[2],
    ]);
  });

  describe(`Set calendar for '${trialLocation}' session`, () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkSetsATrialSessionsSchedule(cerebralTest);
  });

  describe(`Result: Case #1 and #2 are assigned to '${trialLocation}' session`, () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');

    it(`Case #1 and #2 are assigned to '${trialLocation}' session`, async () => {
      await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: cerebralTest.trialSessionId,
      });

      expect(
        cerebralTest.getState('trialSession.calendaredCases').length,
      ).toEqual(2);
      expect(cerebralTest.getState('trialSession.isCalendared')).toEqual(true);
      expect(
        cerebralTest.getState('trialSession.calendaredCases.0.docketNumber'),
      ).toEqual(createdDocketNumbers[0]);
      expect(
        cerebralTest.getState('trialSession.calendaredCases.1.docketNumber'),
      ).toEqual(createdDocketNumbers[1]);
    });
  });
});
