import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { showSortableHeaders as showSortableHeadersComputed } from './showSortableHeaders';
import { withAppContextDecorator } from '../../withAppContext';

describe('showSortableHeaders', () => {
  const showSortableHeaders = withAppContextDecorator(
    showSortableHeadersComputed,
  );
  const { USER_ROLES } = applicationContext.getConstants();

  it('should return false when user role is not an adc', () => {
    const result = runCompute(showSortableHeaders, {
      state: {
        user: {
          role: USER_ROLES.petitioner,
        },
      },
    });

    expect(result).toBe(false);
  });

  it('should return true when user role is an adc', () => {
    const result = runCompute(showSortableHeaders, {
      state: {
        user: {
          role: USER_ROLES.adc,
        },
      },
    });

    expect(result).toBe(true);
  });
});
