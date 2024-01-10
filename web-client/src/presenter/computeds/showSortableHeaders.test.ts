import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { showSortableHeaders as showSortableHeadersComputed } from './showSortableHeaders';
import { withAppContextDecorator } from '../../withAppContext';

describe('showSortableHeaders', () => {
  const showSortableHeaders = withAppContextDecorator(
    showSortableHeadersComputed,
  );
  const { USER_ROLES } = applicationContext.getConstants();

  it('should return false when user role is external', () => {
    const result = runCompute(showSortableHeaders, {
      state: {
        user: {
          role: USER_ROLES.petitioner,
        },
      },
    });

    expect(result).toBe(false);
  });

  it('should return false when user role is external (practitioner)', () => {
    const result = runCompute(showSortableHeaders, {
      state: {
        user: {
          role: USER_ROLES.privatePractitioner,
        },
      },
    });

    expect(result).toBe(false);
  });

  it('should return true when user role is internal', () => {
    const result = runCompute(showSortableHeaders, {
      state: {
        user: {
          role: USER_ROLES.adc,
        },
      },
    });

    expect(result).toBe(true);
  });

  it('should return true when user role is internal (docketclerk)', () => {
    const result = runCompute(showSortableHeaders, {
      state: {
        user: {
          role: USER_ROLES.docketClerk,
        },
      },
    });

    expect(result).toBe(true);
  });
});
