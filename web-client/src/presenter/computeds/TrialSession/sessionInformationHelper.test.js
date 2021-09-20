import { TRIAL_SESSION_SCOPE_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { runCompute } from 'cerebral/test';
import { sessionInformationHelper as sessionInformationHelperComputed } from './sessionInformationHelper';
import { withAppContextDecorator } from '../../../withAppContext';

describe('sessionInformationHelper', () => {
  const sessionInformationHelper = withAppContextDecorator(
    sessionInformationHelperComputed,
    {
      ...applicationContext,
    },
  );

  it(`should return isStandaloneSession true when form TRIAL_SESSION_SCOPE_TYPES is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, () => {
    const result = runCompute(sessionInformationHelper, {
      state: {
        form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote },
      },
    });
    expect(result.isStandaloneSession).toEqual(true);
  });

  //todo: should return false when TRIAL_SESSION_SCOPE_TYPES.locationBased

  it(`should not include 'Special' or 'Motion/Hearing' as session types when form TRIAL_SESSION_SCOPE_TYPES is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, () => {
    const result = runCompute(sessionInformationHelper, {
      state: {
        form: { sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote },
      },
    });
    expect(result.sessionTypes).toEqual(['Regular', 'Small', 'Hybrid']);
  });
});
