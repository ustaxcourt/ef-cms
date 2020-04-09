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
          employer: 'Private',
        },
      },
    });
    expect(result.showFirmName).toBeTruthy();
  });

  it('returns only practitioner and respondent roles', () => {
    const result = runCompute(createPractitionerUserHelper, {
      state: {
        form: {
          employer: 'DOJ',
        },
      },
    });
    expect(result.showFirmName).toBeFalsy();
  });
});
