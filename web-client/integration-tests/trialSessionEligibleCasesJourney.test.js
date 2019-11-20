import { Case } from '../../shared/src/business/entities/cases/Case';
import { setupTest } from './helpers';
import { uploadPetition } from './helpers';
import captureCreatedCase from './journey/captureCreatedCase';
import docketClerkCreatesATrialSession from './journey/docketClerkCreatesATrialSession';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSetsCaseReadyForTrial from './journey/docketClerkSetsCaseReadyForTrial';
import docketClerkViewsAnUpcomingTrialSession from './journey/docketClerkViewsAnUpcomingTrialSession';
import docketClerkViewsTrialSessionList from './journey/docketClerkViewsTrialSessionList';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkRunsBatchProcess from './journey/petitionsClerkRunsBatchProcess';
import petitionsClerkSendsCaseToIRSHoldingQueue from './journey/petitionsClerkSendsCaseToIRSHoldingQueue';
import petitionsClerkSetsATrialSessionsSchedule from './journey/petitionsClerkSetsATrialSessionsSchedule';
import petitionsClerkUpdatesFiledBy from './journey/petitionsClerkUpdatesFiledBy';
import userSignsOut from './journey/petitionerSignsOut';

const test = setupTest();

describe('Trial Session Eligible Cases Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  const trialLocation = `Madison, Wisconsin, ${Date.now()}`;
  const overrides = {
    maxCases: 3,
    preferredTrialCity: trialLocation,
    sessionType: 'Small',
    trialLocation,
  };
  const createdCases = [];
  const createdDocketNumbers = [];

  describe(`Create trial session with Small session type for '${trialLocation}' with max case count = 1`, () => {
    docketClerkLogIn(test);
    docketClerkCreatesATrialSession(test, overrides);
    docketClerkViewsTrialSessionList(test, overrides);
    docketClerkViewsAnUpcomingTrialSession(test);
    userSignsOut(test);
  });

  describe('Create cases', () => {
    describe(`Case #1 with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small procedure type with filed date 1/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: 'Deficiency',
        procedureType: 'Small',
        receivedAtDay: '01',
        receivedAtMonth: '01',
        receivedAtYear: '2019',
      };
      petitionerLogin(test);
      it('Create case #1', async () => {
        await uploadPetition(test, caseOverrides);
      });
      petitionerViewsDashboard(test);
      captureCreatedCase(test, createdCases, createdDocketNumbers);
      userSignsOut(test);
      petitionsClerkLogIn(test);
      petitionsClerkUpdatesFiledBy(test, caseOverrides);
      petitionsClerkSendsCaseToIRSHoldingQueue(test);
      petitionsClerkRunsBatchProcess(test);
      userSignsOut(test);
      docketClerkLogIn(test);
      docketClerkSetsCaseReadyForTrial(test);
      userSignsOut(test);
    });

    describe(`Case #2 with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small procedure type with filed date 1/2/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: 'Deficiency',
        procedureType: 'Small',
        receivedAtDay: '02',
        receivedAtMonth: '01',
        receivedAtYear: '2019',
      };
      petitionerLogin(test);
      it('Create case #2', async () => {
        await uploadPetition(test, caseOverrides);
      });
      petitionerViewsDashboard(test);
      captureCreatedCase(test, createdCases, createdDocketNumbers);
      userSignsOut(test);
      petitionsClerkLogIn(test);
      petitionsClerkUpdatesFiledBy(test, caseOverrides);
      petitionsClerkSendsCaseToIRSHoldingQueue(test);
      petitionsClerkRunsBatchProcess(test);
      userSignsOut(test);
      docketClerkLogIn(test);
      docketClerkSetsCaseReadyForTrial(test);
      userSignsOut(test);
    });

    describe(`Case #3 with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Regular procedure type with filed date 1/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: 'Deficiency',
        procedureType: 'Regular',
        receivedAtDay: '01',
        receivedAtMonth: '01',
        receivedAtYear: '2019',
      };
      petitionerLogin(test);
      it('Create case #3', async () => {
        await uploadPetition(test, caseOverrides);
      });
      petitionerViewsDashboard(test);
      captureCreatedCase(test, createdCases, createdDocketNumbers);
      userSignsOut(test);
      petitionsClerkLogIn(test);
      petitionsClerkUpdatesFiledBy(test, caseOverrides);
      petitionsClerkSendsCaseToIRSHoldingQueue(test);
      petitionsClerkRunsBatchProcess(test);
      userSignsOut(test);
      docketClerkLogIn(test);
      docketClerkSetsCaseReadyForTrial(test);
      userSignsOut(test);
    });

    describe(`Case #4 'L' type with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small procedure type with filed date 5/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: 'CDP (Lien/Levy)',
        procedureType: 'Small',
        receivedAtDay: '01',
        receivedAtMonth: '02',
        receivedAtYear: '2019',
      };
      petitionerLogin(test);
      it('Create case #4', async () => {
        await uploadPetition(test, caseOverrides);
      });
      petitionerViewsDashboard(test);
      captureCreatedCase(test, createdCases, createdDocketNumbers);
      userSignsOut(test);
      petitionsClerkLogIn(test);
      petitionsClerkUpdatesFiledBy(test, caseOverrides);
      petitionsClerkSendsCaseToIRSHoldingQueue(test);
      petitionsClerkRunsBatchProcess(test);
      userSignsOut(test);
      docketClerkLogIn(test);
      docketClerkSetsCaseReadyForTrial(test);
      userSignsOut(test);
    });

    describe(`Case #5 'P' type with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small procedure type with filed date 3/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: 'Passport',
        procedureType: 'Small',
        receivedAtDay: '01',
        receivedAtMonth: '03',
        receivedAtYear: '2019',
      };
      petitionerLogin(test);
      it('Create case #5', async () => {
        await uploadPetition(test, caseOverrides);
      });
      petitionerViewsDashboard(test);
      captureCreatedCase(test, createdCases, createdDocketNumbers);
      userSignsOut(test);
      petitionsClerkLogIn(test);
      petitionsClerkUpdatesFiledBy(test, caseOverrides);
      petitionsClerkSendsCaseToIRSHoldingQueue(test);
      petitionsClerkRunsBatchProcess(test);
      userSignsOut(test);
      docketClerkLogIn(test);
      docketClerkSetsCaseReadyForTrial(test);
      userSignsOut(test);
    });
  });

  describe(`Result: Case #4, #5, #1, and #2 should show as eligible for '${trialLocation}' session`, () => {
    petitionsClerkLogIn(test);

    it(`Case #4, #5, #1, and #2 should show as eligible for '${trialLocation}' session`, async () => {
      await test.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: test.trialSessionId,
      });

      expect(test.getState('trialSession.eligibleCases').length).toEqual(4);
      expect(test.getState('trialSession.eligibleCases.0.caseId')).toEqual(
        createdCases[3],
      );
      expect(test.getState('trialSession.eligibleCases.1.caseId')).toEqual(
        createdCases[4],
      );
      expect(test.getState('trialSession.eligibleCases.2.caseId')).toEqual(
        createdCases[0],
      );
      expect(test.getState('trialSession.eligibleCases.3.caseId')).toEqual(
        createdCases[1],
      );
      expect(test.getState('trialSession.status')).toEqual('Upcoming');
      expect(test.getState('trialSession.isCalendared')).toEqual(false);
    });

    userSignsOut(test);
  });

  describe(`Mark case #2 as high priority for '${trialLocation}' session`, () => {
    petitionsClerkLogIn(test);

    it(`Case #2 should show as first case eligible for '${trialLocation}' session`, async () => {
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[1],
      });
      expect(test.getState('caseDetail.status')).not.toEqual('Calendared');
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

      expect(test.getState('trialSession.eligibleCases').length).toEqual(4);
      expect(test.getState('trialSession.eligibleCases.0.caseId')).toEqual(
        createdCases[1],
      );
      expect(test.getState('trialSession.eligibleCases.1.caseId')).toEqual(
        createdCases[3],
      );
      expect(test.getState('trialSession.eligibleCases.2.caseId')).toEqual(
        createdCases[4],
      );
      expect(test.getState('trialSession.eligibleCases.3.caseId')).toEqual(
        createdCases[0],
      );
      expect(test.getState('trialSession.status')).toEqual('Upcoming');
      expect(test.getState('trialSession.isCalendared')).toEqual(false);
    });

    userSignsOut(test);
  });

  describe(`Remove high priority from case #2 for '${trialLocation}' session`, () => {
    petitionsClerkLogIn(test);

    it(`Case #2 should show as last case eligible for '${trialLocation}' session`, async () => {
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[1],
      });
      expect(test.getState('caseDetail.status')).not.toEqual('Calendared');
      expect(test.getState('caseDetail').highPriority).toBeTruthy();

      await test.runSequence('unprioritizeCaseSequence');
      expect(test.getState('caseDetail').highPriority).toBeFalsy();
      expect(test.getState('caseDetail').highPriorityReason).toBeFalsy();

      await test.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: test.trialSessionId,
      });

      expect(test.getState('trialSession.eligibleCases').length).toEqual(4);
      expect(test.getState('trialSession.eligibleCases.0.caseId')).toEqual(
        createdCases[3],
      );
      expect(test.getState('trialSession.eligibleCases.1.caseId')).toEqual(
        createdCases[4],
      );
      expect(test.getState('trialSession.eligibleCases.2.caseId')).toEqual(
        createdCases[0],
      );
      expect(test.getState('trialSession.eligibleCases.3.caseId')).toEqual(
        createdCases[1],
      );
      expect(test.getState('trialSession.status')).toEqual('Upcoming');
      expect(test.getState('trialSession.isCalendared')).toEqual(false);
    });

    userSignsOut(test);
  });

  describe(`Set calendar for '${trialLocation}' session`, () => {
    petitionsClerkLogIn(test);
    petitionsClerkSetsATrialSessionsSchedule(test);
    userSignsOut(test);
  });

  describe(`Result: Case #4, #5, and #1 are assigned to '${trialLocation}' session and their case statuses are updated to “Calendared for Trial”`, () => {
    petitionsClerkLogIn(test);

    it(`Case #4, #5, and #1 are assigned to '${trialLocation}' session`, async () => {
      await test.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: test.trialSessionId,
      });

      expect(test.getState('trialSession.calendaredCases').length).toEqual(3);
      expect(test.getState('trialSession.isCalendared')).toEqual(true);
      expect(test.getState('trialSession.calendaredCases.0.caseId')).toEqual(
        createdCases[3],
      );
      expect(test.getState('trialSession.calendaredCases.1.caseId')).toEqual(
        createdCases[4],
      );
      expect(test.getState('trialSession.calendaredCases.2.caseId')).toEqual(
        createdCases[0],
      );
    });

    it(`Case #4, #5, and #1 are assigned to '${trialLocation}' session; Case #2 and #3 are not assigned`, async () => {
      //Case #1 - assigned
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[0],
      });
      expect(test.getState('caseDetail.status')).toEqual('Calendared');
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
      expect(test.getState('caseDetail.status')).not.toEqual('Calendared');
      expect(test.getState('caseDetail.trialLocation')).toBeUndefined();
      expect(test.getState('caseDetail.trialDate')).toBeUndefined();
      expect(test.getState('caseDetail.associatedJudge')).toEqual(
        Case.CHIEF_JUDGE,
      );

      //Case #3 - not assigned
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[2],
      });
      expect(test.getState('caseDetail.status')).not.toEqual('Calendared');

      //Case #4 - assigned
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[3],
      });
      expect(test.getState('caseDetail.status')).toEqual('Calendared');

      //Case #5 - assigned
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[4],
      });
      expect(test.getState('caseDetail.status')).toEqual('Calendared');
    });

    it(`verify case #1 can be manually removed from '${trialLocation}' session`, async () => {
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[0],
      });

      await test.runSequence('removeFromTrialSessionSequence');

      expect(test.getState('validationErrors')).toEqual({
        disposition: 'Enter a disposition',
      });

      await test.runSequence('updateModalValueSequence', {
        key: 'disposition',
        value: 'testing',
      });

      await test.runSequence('removeFromTrialSessionSequence');

      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[0],
      });
      expect(test.getState('caseDetail.status')).not.toEqual('Calendared');

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
      expect(test.getState('caseDetail.status')).not.toEqual('Calendared');

      await test.runSequence('addCaseToTrialSessionSequence');

      expect(test.getState('validationErrors')).toEqual({
        trialSessionId: 'Select a Trial Session',
      });

      test.setState('modal.trialSessionId', test.trialSessionId);

      await test.runSequence('addCaseToTrialSessionSequence');

      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[0],
      });
      expect(test.getState('caseDetail.status')).toEqual('Calendared');

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

    userSignsOut(test);
  });
});
