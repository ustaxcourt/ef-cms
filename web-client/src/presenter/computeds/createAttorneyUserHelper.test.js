import { User } from '../../../../shared/src/business/entities/User';
import { applicationContext } from '../../applicationContext';
import { createAttorneyUserHelper as createAttorneyUserHelperComputed } from './createAttorneyUserHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const createAttorneyUserHelper = withAppContextDecorator(
  createAttorneyUserHelperComputed,
  applicationContext,
);

describe('createAttorneyUserHelper', () => {
  it('returns only practitioner and respondent roles', () => {
    const result = runCompute(createAttorneyUserHelper, {
      state: {
        form: {
          documentTitle: 'Order',
        },
      },
    });

    expect(result.roles).toEqual([
      User.ROLES.privatePractitioner,
      User.ROLES.irsPractitioner,
      User.ROLES.inactivePractitioner,
      User.ROLES.inactivePractitioner,
    ]);
  });
});
