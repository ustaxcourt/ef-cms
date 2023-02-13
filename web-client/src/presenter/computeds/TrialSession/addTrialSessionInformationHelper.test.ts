import {
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { addTrialSessionInformationHelper as addTrialSessionInformationHelperComputed } from './addTrialSessionInformationHelper';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { runCompute } from 'cerebral/test';
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
        },
      });

      expect(result.displayRemoteProceedingForm).toEqual(true);
    });

    it(`should be true when the session scope is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, () => {
      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote },
        },
      });

      expect(result.displayRemoteProceedingForm).toEqual(true);
    });

    it(`should be false when the session scope is NOT ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote} and form.proceedingType is NOT ${TRIAL_SESSION_PROCEEDING_TYPES.remote}`, () => {
      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { proceedingType: 'def', sessionScope: 'abc' },
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
        },
      });

      expect(result.displayRemoteProceedingForm).toEqual(true);
    });

    it(`should be false when the session scope is ${TRIAL_SESSION_SCOPE_TYPES.locationBased}`, () => {
      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased },
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
        },
      });

      expect(result.title).toEqual('Remote Proceeding Information');
    });

    it(`should be 'Location Information' when form.sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.locationBased}`, () => {
      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased },
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
        },
      });

      expect(result.isStandaloneSession).toEqual(true);
    });

    it(`should be false when form.sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.locationBased}`, () => {
      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased },
        },
      });

      expect(result.isStandaloneSession).toEqual(false);
    });
  });

  describe('sessionTypes', () => {
    it(`should NOT include 'Special' or 'Motion/Hearing' when form.sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, () => {
      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote },
        },
      });

      expect(result.sessionTypes).toEqual(['Regular', 'Small', 'Hybrid']);
    });

    it(`should include 'Special' and 'Motion/Hearing' when form.sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.locationBased}`, () => {
      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased },
        },
      });

      expect(result.sessionTypes).toEqual([
        'Regular',
        'Small',
        'Hybrid',
        'Special',
        'Motion/Hearing',
      ]);
    });
  });

  describe('FEATURE_canDisplayStandaloneRemote', () => {
    // FEATURE FLAG: standalone_remote_session
    it('should return FEATURE_canDisplayStandaloneRemote true if standalone_remote_session feature flag is enabled', () => {
      applicationContext.isFeatureEnabled.mockReturnValueOnce(true);

      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased },
        },
      });

      expect(result.FEATURE_canDisplayStandaloneRemote).toEqual(true);
    });

    // FEATURE FLAG: standalone_remote_session
    it('should NOT return FEATURE_canDisplayStandaloneRemote false if the standalone_remote_session feature flag is NOT enabled', () => {
      applicationContext.isFeatureEnabled.mockReturnValueOnce(false);

      const result = runCompute(addTrialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased },
        },
      });

      expect(result.FEATURE_canDisplayStandaloneRemote).toEqual(false);
    });
  });
});
