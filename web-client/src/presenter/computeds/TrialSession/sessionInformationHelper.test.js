import { sessionInformationHelper as sessionInformationHelperComputed } from './addCourtIssuedDocketEntryHelper';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('sessionInformationHelper', () => {
  const sessionInformationHelper = withAppContextDecorator(
    sessionInformationHelperComputed,
    {
      ...applicationContext,
    },
  );

  it('should return isStandaloneSession true when form TRIAL_SESSION_SCOPE_TYPES is `Standalone Remote`', () => {
    const result = runCompute(sessionInformationHelper, { state });
    expect(result.isStandaloneSession).toEqual(true);
  });

  //todo: should return false when TRIAL_SESSION_SCOPE_TYPES.locationBased
});
