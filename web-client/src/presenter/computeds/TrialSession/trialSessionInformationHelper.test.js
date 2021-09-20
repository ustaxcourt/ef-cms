import {
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { runCompute } from 'cerebral/test';
import { trialSessionInformationHelper as trialSessionInformationHelperComputed } from './trialSessionInformationHelper';
import { withAppContextDecorator } from '../../../withAppContext';

describe('trialSessionInformationHelper', () => {
  const trialSessionInformationHelper = withAppContextDecorator(
    trialSessionInformationHelperComputed,
    {
      ...applicationContext,
    },
  );

  describe('displayRemoteProceedingForm', () => {
    it(`should be true when form.proceedingType is ${TRIAL_SESSION_PROCEEDING_TYPES.remote}`, () => {
      const result = runCompute(trialSessionInformationHelper, {
        state: {
          form: { proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote },
        },
      });

      expect(result.displayRemoteProceedingForm).toEqual(true);
    });

    it(`should be true when the session scope is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, () => {
      const result = runCompute(trialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote },
        },
      });

      expect(result.displayRemoteProceedingForm).toEqual(true);
    });

    it(`should be false when the session scope is NOT ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote} and form.proceedingType is NOT ${TRIAL_SESSION_PROCEEDING_TYPES.remote}`, () => {
      const result = runCompute(trialSessionInformationHelper, {
        state: {
          form: { proceedingType: 'def', sessionScope: 'abc' },
        },
      });

      expect(result.displayRemoteProceedingForm).toEqual(false);
    });
  });

  describe('isStandaloneSession', () => {
    it(`should be true when form.sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, () => {
      const result = runCompute(trialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote },
        },
      });

      expect(result.displayRemoteProceedingForm).toEqual(true);
    });

    it(`should be false when the session scope is ${TRIAL_SESSION_SCOPE_TYPES.locationBased}`, () => {
      const result = runCompute(trialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased },
        },
      });

      expect(result.displayRemoteProceedingForm).toEqual(false);
    });
  });

  describe('title', () => {
    it(`should be 'Remote Proceeding Information' when form.sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, () => {
      const result = runCompute(trialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote },
        },
      });

      expect(result.title).toEqual('Remote Proceeding Information');
    });

    it(`should be 'Location Information' when form.sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.locationBased}`, () => {
      const result = runCompute(trialSessionInformationHelper, {
        state: {
          form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased },
        },
      });

      expect(result.title).toEqual('Location Information');
    });
  });
});
