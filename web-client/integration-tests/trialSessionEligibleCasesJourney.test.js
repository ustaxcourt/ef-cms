import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition, wait } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';

const cerebralTest = setupTest();
const { CASE_TYPES_MAP, CHIEF_JUDGE, STATUS_TYPES } =
  applicationContext.getConstants();

describe('Trial Session Eligible Cases Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const trialLocation = `Madison, Wisconsin, ${Date.now()}`;
  const overrides = {
    maxCases: 3,
    preferredTrialCity: trialLocation,
    sessionType: 'Small',
    trialLocation,
  };
  const createdDocketNumbers = [];

  describe(`Create trial session with Small session type for '${trialLocation}' with max case count = 1`, () => {
    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkCreatesATrialSession(cerebralTest, overrides);
    docketClerkViewsTrialSessionList(cerebralTest);
    docketClerkViewsNewTrialSession(cerebralTest);
  });

  describe('Create cases', () => {
    describe(`Case #1 with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small procedure type with filed date 1/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: CASE_TYPES_MAP.deficiency,
        procedureType: 'Small',
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

    describe(`Case #2 with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small procedure type with filed date 1/2/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: CASE_TYPES_MAP.deficiency,
        procedureType: 'Small',
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

    describe(`Case #3 with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Regular procedure type with filed date 1/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: CASE_TYPES_MAP.deficiency,
        procedureType: 'Regular',
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

    describe(`Case #4 'L' type with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small procedure type with filed date 5/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: CASE_TYPES_MAP.cdp,
        procedureType: 'Small',
      };
      loginAs(cerebralTest, 'petitioner@example.com');
      it('Create case #4', async () => {
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

    describe(`Case #5 'P' type with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small procedure type with filed date 3/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: 'Passport',
        procedureType: 'Small',
      };
      loginAs(cerebralTest, 'petitioner@example.com');
      it('Create case #5', async () => {
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

  describe(`Result: Case #4, #5, #1, and #2 should show as eligible for '${trialLocation}' session`, () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');

    it(`Case #4, #5, #1, and #2 should show as eligible for '${trialLocation}' session`, async () => {
      await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: cerebralTest.trialSessionId,
      });

      expect(
        cerebralTest.getState('trialSession.eligibleCases').length,
      ).toEqual(4);
      const eligibleCases = cerebralTest.getState('trialSession.eligibleCases');
      expect(eligibleCases.length).toEqual(4);
      // cases with index 3 and 4 should be first because they are CDP/Passport cases
      expect(eligibleCases[0].docketNumber).toEqual(createdDocketNumbers[3]);
      expect(eligibleCases[1].docketNumber).toEqual(createdDocketNumbers[4]);
      expect(eligibleCases[2].docketNumber).toEqual(createdDocketNumbers[0]);
      expect(eligibleCases[3].docketNumber).toEqual(createdDocketNumbers[1]);
      expect(cerebralTest.getState('trialSession.isCalendared')).toEqual(false);
    });
  });

  describe(`Mark case #2 as high priority for '${trialLocation}' session`, () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');

    it(`Case #2 should show as first case eligible for '${trialLocation}' session`, async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[1],
      });
      expect(cerebralTest.getState('caseDetail.status')).not.toEqual(
        STATUS_TYPES.calendared,
      );
      expect(cerebralTest.getState('caseDetail').highPriority).toBeFalsy();

      await cerebralTest.runSequence('updateModalValueSequence', {
        key: 'reason',
        value: 'just because',
      });

      await cerebralTest.runSequence('prioritizeCaseSequence');
      expect(cerebralTest.getState('caseDetail').highPriority).toBeTruthy();
      expect(cerebralTest.getState('caseDetail').highPriorityReason).toEqual(
        'just because',
      );

      await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: cerebralTest.trialSessionId,
      });

      const eligibleCases = cerebralTest.getState('trialSession.eligibleCases');
      expect(eligibleCases.length).toEqual(4);
      // this case should be first because it's high priority
      expect(eligibleCases[0].docketNumber).toEqual(createdDocketNumbers[1]);
      // this case should be second because it's a CDP case
      expect(eligibleCases[1].docketNumber).toEqual(createdDocketNumbers[3]);
      // this case should be third because it's a Passport case
      expect(eligibleCases[2].docketNumber).toEqual(createdDocketNumbers[4]);
      expect(eligibleCases[3].docketNumber).toEqual(createdDocketNumbers[0]);
      expect(cerebralTest.getState('trialSession.isCalendared')).toEqual(false);
    });
  });

  describe(`Remove high priority from case #2 for '${trialLocation}' session`, () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');

    it(`Case #2 should show as last case eligible for '${trialLocation}' session`, async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[1],
      });
      expect(cerebralTest.getState('caseDetail.status')).not.toEqual(
        STATUS_TYPES.calendared,
      );
      expect(cerebralTest.getState('caseDetail').highPriority).toBeTruthy();

      await cerebralTest.runSequence('unprioritizeCaseSequence');
      expect(cerebralTest.getState('caseDetail').highPriority).toBeFalsy();
      expect(
        cerebralTest.getState('caseDetail').highPriorityReason,
      ).toBeFalsy();

      await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: cerebralTest.trialSessionId,
      });

      const eligibleCases = cerebralTest.getState('trialSession.eligibleCases');
      expect(eligibleCases.length).toEqual(4);
      // this case should be first because it's a CDP case
      expect(eligibleCases[0].docketNumber).toEqual(createdDocketNumbers[3]);
      // this case should be second because it's a Passport case
      expect(eligibleCases[1].docketNumber).toEqual(createdDocketNumbers[4]);
      expect(eligibleCases[2].docketNumber).toEqual(createdDocketNumbers[0]);
      expect(eligibleCases[3].docketNumber).toEqual(createdDocketNumbers[1]);
      expect(cerebralTest.getState('trialSession.isCalendared')).toEqual(false);
    });
  });

  describe('Calendar clerk marks all eligible cases as QCed', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    markAllCasesAsQCed(cerebralTest, () => [
      createdDocketNumbers[0],
      createdDocketNumbers[1],
      createdDocketNumbers[3],
      createdDocketNumbers[4],
    ]);
  });

  describe(`Set calendar for '${trialLocation}' session`, () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkSetsATrialSessionsSchedule(cerebralTest);
  });

  describe(`Result: Case #4, #5, and #1 are assigned to '${trialLocation}' session and their case statuses are updated to “Calendared for Trial”`, () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');

    it(`Case #4, #5, and #1 are assigned to '${trialLocation}' session`, async () => {
      await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: cerebralTest.trialSessionId,
      });

      expect(
        cerebralTest.getState('trialSession.calendaredCases').length,
      ).toEqual(3);
      expect(cerebralTest.getState('trialSession.isCalendared')).toEqual(true);
      expect(
        cerebralTest.getState('trialSession.calendaredCases.0.docketNumber'),
      ).toEqual(createdDocketNumbers[3]);
      expect(
        cerebralTest.getState('trialSession.calendaredCases.1.docketNumber'),
      ).toEqual(createdDocketNumbers[4]);
      // this could be either case 0 or 1 depending on which was marked eligible first
      expect(
        cerebralTest.getState('trialSession.calendaredCases.2.docketNumber'),
      ).toEqual(createdDocketNumbers[0]);
    });

    it(`Case #4, #5, and #1 are assigned to '${trialLocation}' session; Case #2 and #3 are not assigned`, async () => {
      //Case #1 - assigned
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[0],
      });
      expect(cerebralTest.getState('caseDetail.status')).toEqual(
        STATUS_TYPES.calendared,
      );
      expect(cerebralTest.getState('caseDetail.trialLocation')).toEqual(
        trialLocation,
      );
      expect(cerebralTest.getState('caseDetail.trialDate')).toEqual(
        '2025-12-12T05:00:00.000Z',
      );
      expect(cerebralTest.getState('caseDetail.associatedJudge')).toEqual(
        'Cohen',
      );

      //Case #2 - not assigned
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[1],
      });
      expect(cerebralTest.getState('caseDetail.status')).not.toEqual(
        STATUS_TYPES.calendared,
      );
      expect(cerebralTest.getState('caseDetail.trialLocation')).toBeUndefined();
      expect(cerebralTest.getState('caseDetail.trialDate')).toBeUndefined();
      expect(cerebralTest.getState('caseDetail.associatedJudge')).toEqual(
        CHIEF_JUDGE,
      );

      //Case #3 - not assigned
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[2],
      });
      expect(cerebralTest.getState('caseDetail.status')).not.toEqual(
        STATUS_TYPES.calendared,
      );

      //Case #4 - assigned
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[3],
      });
      expect(cerebralTest.getState('caseDetail.status')).toEqual(
        STATUS_TYPES.calendared,
      );

      //Case #5 - assigned
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[4],
      });
      expect(cerebralTest.getState('caseDetail.status')).toEqual(
        STATUS_TYPES.calendared,
      );
    });

    it(`verify case #1 can be manually removed from '${trialLocation}' session`, async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[0],
      });

      await cerebralTest.runSequence('removeCaseFromTrialSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({
        caseStatus: 'Enter a case status',
        disposition: 'Enter a disposition',
      });

      await cerebralTest.runSequence(
        'openRemoveFromTrialSessionModalSequence',
        {
          trialSessionId: cerebralTest.trialSessionId,
        },
      );

      await cerebralTest.runSequence('updateModalValueSequence', {
        key: 'disposition',
        value: 'testing',
      });

      await cerebralTest.runSequence('removeCaseFromTrialSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({});

      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[0],
      });
      expect(cerebralTest.getState('caseDetail.status')).not.toEqual(
        STATUS_TYPES.calendared,
      );

      await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: cerebralTest.trialSessionId,
      });

      expect(
        cerebralTest.getState(
          'trialSession.calendaredCases.2.removedFromTrial',
        ),
      ).toBeTruthy();
    });

    it(`verify case #1 can be manually added back to the '${trialLocation}' session`, async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[0],
      });
      expect(cerebralTest.getState('caseDetail.status')).not.toEqual(
        STATUS_TYPES.calendared,
      );

      await cerebralTest.runSequence('openAddToTrialModalSequence');
      await cerebralTest.runSequence('addCaseToTrialSessionSequence');
      await wait(1000);

      expect(cerebralTest.getState('validationErrors')).toEqual({
        trialSessionId: 'Select a Trial Session',
      });

      await cerebralTest.runSequence('openAddToTrialModalSequence');
      cerebralTest.setState(
        'modal.trialSessionId',
        cerebralTest.trialSessionId,
      );

      await cerebralTest.runSequence('addCaseToTrialSessionSequence');
      await wait(1000); // we need to wait for some reason

      expect(cerebralTest.getState('validationErrors')).toEqual({});

      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[0],
      });
      expect(cerebralTest.getState('caseDetail.status')).toEqual(
        STATUS_TYPES.calendared,
      );

      await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: cerebralTest.trialSessionId,
      });

      expect(
        cerebralTest.getState(
          'trialSession.calendaredCases.2.removedFromTrial',
        ),
      ).toBeFalsy();

      expect(
        cerebralTest.getState('trialSession.calendaredCases.2.isManuallyAdded'),
      ).toBeTruthy();
    });
  });
});
