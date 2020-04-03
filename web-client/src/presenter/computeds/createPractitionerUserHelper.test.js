import { User } from '../../../../shared/src/business/entities/User';
import { applicationContext } from '../../applicationContext';
import { createPractitionerUserHelper as createPractitionerUserHelperComputed } from './createPractitionerUserHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const createPractitionerUserHelper = withAppContextDecorator(
  createPractitionerUserHelperComputed,
  applicationContext,
);

describe('createPractitionerUserHelper', () => {
  it('returns only practitioner and respondent roles', () => {
    const result = runCompute(createPractitionerUserHelper, {
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
