import { CHIEF_JUDGE } from '../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition, wait } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';

const test = setupTest();
const { STATUS_TYPES } = applicationContext.getConstants();

describe('Trial Session Eligible Cases Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  const trialLocation = `Madison, Wisconsin, ${Date.now()}`;
  const overrides = {
    maxCases: 3,
    preferredTrialCity: trialLocation,
    sessionType: 'Small',
    trialLocation,
  };
  const createdCaseIds = [];
  const createdDocketNumbers = [];

  describe(`Create trial session with Small session type for '${trialLocation}' with max case count = 1`, () => {
    loginAs(test, 'docketclerk');
    docketClerkCreatesATrialSession(test, overrides);
    docketClerkViewsTrialSessionList(test, overrides);
    docketClerkViewsNewTrialSession(test);
  });

  describe('Create cases', () => {
    describe(`Case #1 with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small procedure type with filed date 1/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: 'Deficiency',
        procedureType: 'Small',
      };
      loginAs(test, 'petitioner');
      it('Create case #1', async () => {
        const caseDetail = await uploadPetition(test, caseOverrides);
        expect(caseDetail.docketNumber).toBeDefined();
        createdCaseIds.push(caseDetail.caseId);
        createdDocketNumbers.push(caseDetail.docketNumber);
        test.docketNumber = caseDetail.docketNumber;
      });

      loginAs(test, 'petitionsclerk');
      petitionsClerkSubmitsCaseToIrs(test);

      loginAs(test, 'docketclerk');
      docketClerkSetsCaseReadyForTrial(test);
    });

    describe(`Case #2 with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small procedure type with filed date 1/2/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: 'Deficiency',
        procedureType: 'Small',
      };
      loginAs(test, 'petitioner');
      it('Create case #2', async () => {
        const caseDetail = await uploadPetition(test, caseOverrides);
        expect(caseDetail.docketNumber).toBeDefined();
        createdCaseIds.push(caseDetail.caseId);
        createdDocketNumbers.push(caseDetail.docketNumber);
        test.docketNumber = caseDetail.docketNumber;
      });

      loginAs(test, 'petitionsclerk');
      petitionsClerkSubmitsCaseToIrs(test);

      loginAs(test, 'docketclerk');
      docketClerkSetsCaseReadyForTrial(test);
    });

    describe(`Case #3 with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Regular procedure type with filed date 1/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: 'Deficiency',
        procedureType: 'Regular',
      };
      loginAs(test, 'petitioner');
      it('Create case #3', async () => {
        const caseDetail = await uploadPetition(test, caseOverrides);
        expect(caseDetail.docketNumber).toBeDefined();
        createdCaseIds.push(caseDetail.caseId);
        createdDocketNumbers.push(caseDetail.docketNumber);
        test.docketNumber = caseDetail.docketNumber;
      });

      loginAs(test, 'petitionsclerk');
      petitionsClerkSubmitsCaseToIrs(test);

      loginAs(test, 'docketclerk');
      docketClerkSetsCaseReadyForTrial(test);
    });

    describe(`Case #4 'L' type with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small procedure type with filed date 5/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: 'CDP (Lien/Levy)',
        procedureType: 'Small',
      };
      loginAs(test, 'petitioner');
      it('Create case #4', async () => {
        const caseDetail = await uploadPetition(test, caseOverrides);
        expect(caseDetail.docketNumber).toBeDefined();
        createdCaseIds.push(caseDetail.caseId);
        createdDocketNumbers.push(caseDetail.docketNumber);
        test.docketNumber = caseDetail.docketNumber;
      });

      loginAs(test, 'petitionsclerk');
      petitionsClerkSubmitsCaseToIrs(test);

      loginAs(test, 'docketclerk');
      docketClerkSetsCaseReadyForTrial(test);
    });

    describe(`Case #5 'P' type with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small procedure type with filed date 3/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: 'Passport',
        procedureType: 'Small',
      };
      loginAs(test, 'petitioner');
      it('Create case #5', async () => {
        const caseDetail = await uploadPetition(test, caseOverrides);
        expect(caseDetail.docketNumber).toBeDefined();
        createdCaseIds.push(caseDetail.caseId);
        createdDocketNumbers.push(caseDetail.docketNumber);
        test.docketNumber = caseDetail.docketNumber;
      });

      loginAs(test, 'petitionsclerk');
      petitionsClerkSubmitsCaseToIrs(test);

      loginAs(test, 'docketclerk');
      docketClerkSetsCaseReadyForTrial(test);
    });
  });

  describe(`Result: Case #4, #5, #1, and #2 should show as eligible for '${trialLocation}' session`, () => {
    loginAs(test, 'petitionsclerk');

    it(`Case #4, #5, #1, and #2 should show as eligible for '${trialLocation}' session`, async () => {
      await test.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: test.trialSessionId,
      });

      expect(test.getState('trialSession.eligibleCases').length).toEqual(4);
      const eligibleCases = test.getState('trialSession.eligibleCases');
      expect(eligibleCases.length).toEqual(4);
      // cases with index 3 and 4 should be first because they are CDP/Passport cases
      expect(eligibleCases[0].caseId).toEqual(createdCaseIds[3]);
      expect(eligibleCases[1].caseId).toEqual(createdCaseIds[4]);
      expect(eligibleCases[2].caseId).toEqual(createdCaseIds[0]);
      expect(eligibleCases[3].caseId).toEqual(createdCaseIds[1]);
      expect(test.getState('trialSession.isCalendared')).toEqual(false);
    });
  });

  describe(`Mark case #2 as high priority for '${trialLocation}' session`, () => {
    loginAs(test, 'petitionsclerk');

    it(`Case #2 should show as first case eligible for '${trialLocation}' session`, async () => {
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[1],
      });
      expect(test.getState('caseDetail.status')).not.toEqual(
        STATUS_TYPES.calendared,
      );
      expect(test.getState('caseDetail').highPriority).toBeFalsy();

      await test.runSequence('updateModalValueSequence', {
        key: 'reason',
        value: 'just because',
      });

      await test.runSequence('prioritizeCaseSequence');
      expect(test.getState('caseDetail').highPriority).toBeTruthy();
      expect(test.getState('caseDetail').highPriorityReason).toEqual(
        'just because',
      );

      await test.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: test.trialSessionId,
      });

      const eligibleCases = test.getState('trialSession.eligibleCases');
      expect(eligibleCases.length).toEqual(4);
      // this case should be first because it's high priority
      expect(eligibleCases[0].caseId).toEqual(createdCaseIds[1]);
      // this case should be second because it's a CDP case
      expect(eligibleCases[1].caseId).toEqual(createdCaseIds[3]);
      // this case should be third because it's a Passport case
      expect(eligibleCases[2].caseId).toEqual(createdCaseIds[4]);
      expect(eligibleCases[3].caseId).toEqual(createdCaseIds[0]);
      expect(test.getState('trialSession.isCalendared')).toEqual(false);
    });
  });

  describe(`Remove high priority from case #2 for '${trialLocation}' session`, () => {
    loginAs(test, 'petitionsclerk');

    it(`Case #2 should show as last case eligible for '${trialLocation}' session`, async () => {
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[1],
      });
      expect(test.getState('caseDetail.status')).not.toEqual(
        STATUS_TYPES.calendared,
      );
      expect(test.getState('caseDetail').highPriority).toBeTruthy();

      await test.runSequence('unprioritizeCaseSequence');
      expect(test.getState('caseDetail').highPriority).toBeFalsy();
      expect(test.getState('caseDetail').highPriorityReason).toBeFalsy();

      await test.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: test.trialSessionId,
      });

      const eligibleCases = test.getState('trialSession.eligibleCases');
      expect(eligibleCases.length).toEqual(4);
      // this case should be first because it's a CDP case
      expect(eligibleCases[0].caseId).toEqual(createdCaseIds[3]);
      // this case should be second because it's a Passport case
      expect(eligibleCases[1].caseId).toEqual(createdCaseIds[4]);
      expect(eligibleCases[2].caseId).toEqual(createdCaseIds[0]);
      expect(eligibleCases[3].caseId).toEqual(createdCaseIds[1]);
      expect(test.getState('trialSession.isCalendared')).toEqual(false);
    });
  });

  describe('Calendar clerk marks all eligible cases as QCed', () => {
    loginAs(test, 'petitionsclerk');
    markAllCasesAsQCed(test, () => [
      createdCaseIds[0],
      createdCaseIds[1],
      createdCaseIds[3],
      createdCaseIds[4],
    ]);
  });

  describe(`Set calendar for '${trialLocation}' session`, () => {
    loginAs(test, 'petitionsclerk');
    petitionsClerkSetsATrialSessionsSchedule(test);
  });

  describe(`Result: Case #4, #5, and #1 are assigned to '${trialLocation}' session and their case statuses are updated to “Calendared for Trial”`, () => {
    loginAs(test, 'petitionsclerk');

    it(`Case #4, #5, and #1 are assigned to '${trialLocation}' session`, async () => {
      await test.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: test.trialSessionId,
      });

      expect(test.getState('trialSession.calendaredCases').length).toEqual(3);
      expect(test.getState('trialSession.isCalendared')).toEqual(true);
      expect(test.getState('trialSession.calendaredCases.0.caseId')).toEqual(
        createdCaseIds[3],
      );
      expect(test.getState('trialSession.calendaredCases.1.caseId')).toEqual(
        createdCaseIds[4],
      );
      // this could be either case 0 or 1 depending on which was marked eligible first
      expect(test.getState('trialSession.calendaredCases.2.caseId')).toEqual(
        createdCaseIds[0],
      );
    });

    it(`Case #4, #5, and #1 are assigned to '${trialLocation}' session; Case #2 and #3 are not assigned`, async () => {
      //Case #1 - assigned
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[0],
      });
      expect(test.getState('caseDetail.status')).toEqual(
        STATUS_TYPES.calendared,
      );
      expect(test.getState('caseDetail.trialLocation')).toEqual(trialLocation);
      expect(test.getState('caseDetail.trialDate')).toEqual(
        '2025-12-12T05:00:00.000Z',
      );
      expect(test.getState('caseDetail.associatedJudge')).toEqual(
        'Judge Cohen',
      );

      //Case #2 - not assigned
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[1],
      });
      expect(test.getState('caseDetail.status')).not.toEqual(
        STATUS_TYPES.calendared,
      );
      expect(test.getState('caseDetail.trialLocation')).toBeUndefined();
      expect(test.getState('caseDetail.trialDate')).toBeUndefined();
      expect(test.getState('caseDetail.associatedJudge')).toEqual(CHIEF_JUDGE);

      //Case #3 - not assigned
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[2],
      });
      expect(test.getState('caseDetail.status')).not.toEqual(
        STATUS_TYPES.calendared,
      );

      //Case #4 - assigned
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[3],
      });
      expect(test.getState('caseDetail.status')).toEqual(
        STATUS_TYPES.calendared,
      );

      //Case #5 - assigned
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[4],
      });
      expect(test.getState('caseDetail.status')).toEqual(
        STATUS_TYPES.calendared,
      );
    });

    it(`verify case #1 can be manually removed from '${trialLocation}' session`, async () => {
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[0],
      });

      await test.runSequence('removeCaseFromTrialSequence');

      expect(test.getState('validationErrors')).toEqual({
        disposition: 'Enter a disposition',
      });

      await test.runSequence('updateModalValueSequence', {
        key: 'disposition',
        value: 'testing',
      });

      await test.runSequence('removeCaseFromTrialSequence');

      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[0],
      });
      expect(test.getState('caseDetail.status')).not.toEqual(
        STATUS_TYPES.calendared,
      );

      await test.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: test.trialSessionId,
      });

      expect(
        test.getState('trialSession.calendaredCases.2.removedFromTrial'),
      ).toBeTruthy();
    });

    it(`verify case #1 can be manually added back to the '${trialLocation}' session`, async () => {
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[0],
      });
      expect(test.getState('caseDetail.status')).not.toEqual(
        STATUS_TYPES.calendared,
      );

      await test.runSequence('addCaseToTrialSessionSequence');
      await wait(1000);

      expect(test.getState('validationErrors')).toEqual({
        trialSessionId: 'Select a Trial Session',
      });

      test.setState('modal.trialSessionId', test.trialSessionId);

      await test.runSequence('addCaseToTrialSessionSequence');
      await wait(1000); // we need to wait for some reason

      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[0],
      });
      expect(test.getState('caseDetail.status')).toEqual(
        STATUS_TYPES.calendared,
      );

      await test.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: test.trialSessionId,
      });

      expect(
        test.getState('trialSession.calendaredCases.2.removedFromTrial'),
      ).toBeFalsy();

      expect(
        test.getState('trialSession.calendaredCases.2.isManuallyAdded'),
      ).toBeTruthy();
    });
  });
});
