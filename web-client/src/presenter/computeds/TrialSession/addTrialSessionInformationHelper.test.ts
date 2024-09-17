import {
  SESSION_STATUS_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { addTrialSessionInformationHelper as addTrialSessionInformationHelperComputed } from './addTrialSessionInformationHelper';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { docketClerk1User } from '@shared/test/mockUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../withAppContext';

describe('addTrialSessionInformationHelper', () => {
  let trialSession1: TrialSessionInfoDTO;
  let trialSession2: TrialSessionInfoDTO;
  beforeEach(() => {
    trialSession1 = {
      isCalendared: true,
      judge: { name: 'howdy', userId: '1' },
      proceedingType: 'Remote',
      sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
      sessionStatus: 'Open',
      sessionType: 'Regular',
      startDate: '2022-03-01T21:00:00.000Z',
      term: 'Winter',
      termYear: '2022',
      trialLocation: 'Boise',
      trialSessionId: '43bc50b8-8b0b-47db-817b-a666af7a703e',
    };
    trialSession2 = {
      isCalendared: true,
      judge: { name: 'howdy', userId: '2' },
      proceedingType: 'Remote',
      sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
      sessionStatus: 'Open',
      sessionType: 'Regular',
      startDate: '2022-03-01T21:00:00.000Z',
      term: 'Winter',
      termYear: '2022',
      trialLocation: 'Boise',
      trialSessionId: '933ac8d9-68f0-4bfa-b7be-99c465c6799e',
    };
  });
  const addTrialSessionInformationHelper = withAppContextDecorator(
    addTrialSessionInformationHelperComputed,
    {
      ...applicationContext,
    },
  );

  describe('displayRemoteProceedingForm', () => {
    it(`should be true when form.proceedingType is ${TRIAL_SESSION_PROCEEDING_TYPES.remote}`, () => {
      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote },
          user: { role: 'docketclerk' },
        },
      });

      expect(result.displayRemoteProceedingForm).toEqual(true);
    });

    it(`should be true when the session scope is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, () => {
      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote },
          user: { role: 'docketclerk' },
        },
      });

      expect(result.displayRemoteProceedingForm).toEqual(true);
    });

    it(`should be false when the session scope is NOT ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote} and form.proceedingType is NOT ${TRIAL_SESSION_PROCEEDING_TYPES.remote}`, () => {
      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { proceedingType: 'def', sessionScope: 'abc' },
          user: { role: 'docketclerk' },
        },
      });

      expect(result.displayRemoteProceedingForm).toEqual(false);
    });
  });

  describe('isStandaloneSession', () => {
    it(`should be true when form.sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, () => {
      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote },
          user: { role: 'docketclerk' },
        },
      });

      expect(result.displayRemoteProceedingForm).toEqual(true);
    });

    it(`should be false when the session scope is ${TRIAL_SESSION_SCOPE_TYPES.locationBased}`, () => {
      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased },
          user: { role: 'docketclerk' },
        },
      });

      expect(result.displayRemoteProceedingForm).toEqual(false);
    });
  });

  describe('title', () => {
    it(`should be 'Remote Proceeding Information' when form.sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, () => {
      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote },
          user: { role: 'docketclerk' },
        },
      });

      expect(result.title).toEqual('Remote Proceeding Information');
    });

    it(`should be 'Location Information' when form.sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.locationBased}`, () => {
      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased },
          user: { role: 'docketclerk' },
        },
      });

      expect(result.title).toEqual('Location Information');
    });
  });

  describe('isStandaloneSession', () => {
    it(`should be true when form.sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, () => {
      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote },
          user: { role: 'docketclerk' },
        },
      });

      expect(result.isStandaloneSession).toEqual(true);
    });

    it(`should be false when form.sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.locationBased}`, () => {
      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased },
          user: { role: 'docketclerk' },
        },
      });

      expect(result.isStandaloneSession).toEqual(false);
    });
  });

  describe('sessionTypes', () => {
    it(`should NOT include 'Special' or 'Motion/Hearing' when form.sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, () => {
      const user = { role: 'clerkofclerk' };
      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote },
          user,
        },
      });

      expect(result.sessionTypes).toEqual([
        'Regular',
        'Small',
        'Hybrid',
        'Hybrid-S',
      ]);
    });

    it(`should include 'Special' and 'Motion/Hearing' when form.sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.locationBased}`, () => {
      const user = { role: 'clerkofclerk' };
      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased },
          user,
        },
      });

      expect(result.sessionTypes).toEqual([
        'Regular',
        'Small',
        'Hybrid',
        'Hybrid-S',
        'Special',
        'Motion/Hearing',
      ]);
    });

    it("should ONLY include 'Special' or 'Motion/Hearing' trial sessions when role is docketclerk}", () => {
      const user = { role: 'docketclerk' };
      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote },
          user,
        },
      });

      expect(result.sessionTypes).toEqual(['Special', 'Motion/Hearing']);
    });
  });

  describe('showSwingSessionList', () => {
    it('should show the swing session options list when the user has selected that their trial session is part of a swing session', () => {
      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { swingSession: true },
          user: docketClerk1User,
        },
      });

      expect(result.showSwingSessionList).toEqual(true);
    });

    it('should not show the swing session options list when the user has not selected that their trial session is part of a swing session', () => {
      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { swingSession: false },
          user: docketClerk1User,
        },
      });

      expect(result.showSwingSessionList).toEqual(false);
    });
  });

  describe('showSwingSessionOption', () => {
    it('should show the option to associate the current trial session with another swing session when there are valid swing session options', () => {
      const term = 'Fall';
      const termYear = '2020';
      trialSession1.term = term;
      trialSession1.termYear = termYear;
      trialSession1.sessionStatus = SESSION_STATUS_TYPES.open;

      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { swingSession: true, term, termYear },
          trialSession: {
            trialSessionId: '74f24014-2cf1-4e97-b80a-40f970d5376d',
          },
          trialSessions: [trialSession1],
          user: docketClerk1User,
        },
      });

      expect(result.showSwingSessionOption).toEqual(true);
    });

    it('should not show the option to associate the current trial session with another swing session when there are no valid swing session options', () => {
      const term = 'Fall';
      const termYear = '2020';

      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { swingSession: true, term, termYear },
          trialSession: {
            trialSessionId: '74f24014-2cf1-4e97-b80a-40f970d5376d',
          },
          trialSessions: [],
          user: docketClerk1User,
        },
      });

      expect(result.showSwingSessionOption).toEqual(false);
    });
  });

  describe('swingSessions', () => {
    describe('valid swing sessions', () => {
      it('should show only trial sessions in the same term year as the current trial session', () => {
        const term = 'Fall';
        const termYear = '2020';
        trialSession1.term = term;
        trialSession1.termYear = termYear;
        trialSession1.sessionStatus = SESSION_STATUS_TYPES.open;
        trialSession2.term = term;
        trialSession2.termYear = '2021';
        trialSession2.sessionStatus = SESSION_STATUS_TYPES.open;

        const result = runCompute(addTrialSessionInformationHelper, {
          state: {
            form: { swingSession: true, term, termYear },
            trialSession: {
              trialSessionId: '74f24014-2cf1-4e97-b80a-40f970d5376d',
            },
            trialSessions: [trialSession1, trialSession2],
            user: docketClerk1User,
          },
        });

        expect(result.swingSessions[0].trialSessionId).toEqual(
          trialSession1.trialSessionId,
        );
        expect(result.swingSessions.length).toEqual(1);
      });

      it('should show only trial sessions in the same term as the current trial session', () => {
        const term = 'Fall';
        const termYear = '2020';
        trialSession1.term = term;
        trialSession1.termYear = termYear;
        trialSession1.sessionStatus = SESSION_STATUS_TYPES.open;
        trialSession2.term = 'Summer';
        trialSession2.termYear = termYear;
        trialSession2.sessionStatus = SESSION_STATUS_TYPES.open;

        const result = runCompute(addTrialSessionInformationHelper, {
          state: {
            form: { swingSession: true, term, termYear },
            trialSession: {
              trialSessionId: '74f24014-2cf1-4e97-b80a-40f970d5376d',
            },
            trialSessions: [trialSession1, trialSession2],
            user: docketClerk1User,
          },
        });

        expect(result.swingSessions[0].trialSessionId).toEqual(
          trialSession1.trialSessionId,
        );
        expect(result.swingSessions.length).toEqual(1);
      });

      it('should not show closed trial sessions as valid swing sessions', () => {
        const term = 'Fall';
        const termYear = '2020';
        trialSession1.term = term;
        trialSession1.termYear = termYear;
        trialSession1.sessionStatus = SESSION_STATUS_TYPES.closed;

        const result = runCompute(addTrialSessionInformationHelper, {
          state: {
            form: { swingSession: true, term, termYear },
            trialSession: {
              trialSessionId: '74f24014-2cf1-4e97-b80a-40f970d5376d',
            },
            trialSessions: [trialSession1],
            user: docketClerk1User,
          },
        });

        expect(result.swingSessions.length).toEqual(0);
      });

      it('should not show the current trial session as a valid trialSession option to create a swing session with', () => {
        const term = 'Fall';
        const termYear = '2020';
        trialSession1.term = term;
        trialSession1.termYear = termYear;
        trialSession1.sessionStatus = SESSION_STATUS_TYPES.open;

        const result = runCompute(addTrialSessionInformationHelper, {
          state: {
            form: { swingSession: true, term, termYear },
            trialSession: {
              trialSessionId: trialSession1.trialSessionId,
            },
            trialSessions: [trialSession1, trialSession2],
            user: docketClerk1User,
          },
        });

        expect(result.swingSessions.length).toEqual(0);
      });
    });

    describe('sorting', () => {
      it('should sort swing session options by trial location', () => {
        const term = 'Fall';
        const termYear = '2020';
        trialSession1.term = term;
        trialSession1.termYear = termYear;
        trialSession1.sessionStatus = SESSION_STATUS_TYPES.open;
        trialSession1.trialLocation = 'San Diego, California';
        trialSession2.term = term;
        trialSession2.termYear = termYear;
        trialSession2.sessionStatus = SESSION_STATUS_TYPES.open;
        trialSession2.trialLocation = 'Birmingham, Alabama';

        const result = runCompute(addTrialSessionInformationHelper, {
          state: {
            form: { swingSession: true, term, termYear },
            trialSession: {
              trialSessionId: '74f24014-2cf1-4e97-b80a-40f970d5376d',
            },
            trialSessions: [trialSession1, trialSession2],
            user: docketClerk1User,
          },
        });

        expect(result.swingSessions[0].trialSessionId).toEqual(
          trialSession2.trialSessionId,
        );
        expect(result.swingSessions[1].trialSessionId).toEqual(
          trialSession1.trialSessionId,
        );
      });
    });
  });
});
