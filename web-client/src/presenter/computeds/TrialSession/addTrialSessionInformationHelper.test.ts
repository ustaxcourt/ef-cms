import {
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { addTrialSessionInformationHelper as addTrialSessionInformationHelperComputed } from './addTrialSessionInformationHelper';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../withAppContext';

describe('addTrialSessionInformationHelper', () => {
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
});
