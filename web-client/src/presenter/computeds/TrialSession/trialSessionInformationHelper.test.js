import { TRIAL_SESSION_PROCEEDING_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
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
    it(`should return true when form.proceedingType is ${TRIAL_SESSION_PROCEEDING_TYPES.remote}`, () => {
      const result = runCompute(trialSessionInformationHelper, {
        state: {
          form: { proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote },
        },
      });

      expect(result.displayRemoteProceedingForm).toEqual(true);
    });
  });
});
