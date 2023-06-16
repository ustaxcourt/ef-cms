import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { userContactEditHelper as userContactEditHelperComputed } from './userContactEditHelper';
import { withAppContextDecorator } from '../../withAppContext';

const userContactEditHelper = withAppContextDecorator(
  userContactEditHelperComputed,
  applicationContext,
);

describe('userContactEditHelper', () => {
  it('returns true for showFirmName if role is privatePractitioner', () => {
    const result = runCompute(userContactEditHelper, {
      state: {
        user: {
          role: ROLES.privatePractitioner,
        },
      },
    });
    expect(result.showFirmName).toBeTruthy();
  });

  it('returns false for showFirmName if role is NOT privatePractitioner', () => {
    const result = runCompute(userContactEditHelper, {
      state: {
        user: {
          role: ROLES.irsPractitioner,
        },
      },
    });
    expect(result.showFirmName).toBeFalsy();
  });
});
