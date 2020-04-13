import { applicationContext } from '../../applicationContext';
import { createPractitionerUserHelper as createPractitionerUserHelperComputed } from './createPractitionerUserHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const createPractitionerUserHelper = withAppContextDecorator(
  createPractitionerUserHelperComputed,
  applicationContext,
);

describe('createPractitionerUserHelper', () => {
  it('returns true for showFirmName if employer is Private', () => {
    const result = runCompute(createPractitionerUserHelper, {
      state: {
        form: {
          employer: 'Private',
        },
      },
    });
    expect(result.showFirmName).toBeTruthy();
  });

  it('returns false for showFirmName if employer is not Private', () => {
    const result = runCompute(createPractitionerUserHelper, {
      state: {
        form: {
          employer: 'DOJ',
        },
      },
    });
    expect(result.showFirmName).toBeFalsy();
  });

  it('returns canEditEmail false and canEditAdmissionStatus true if barNumber is present on form (editing a practitioner)', () => {
    const result = runCompute(createPractitionerUserHelper, {
      state: {
        form: {
          barNumber: 'AB1234',
        },
      },
    });
    expect(result.canEditEmail).toBeFalsy();
    expect(result.canEditAdmissionStatus).toBeTruthy();
  });

  it('returns canEditEmail true and canEditAdmissionStatus false if barNumber is not present on form (adding a new practitioner)', () => {
    const result = runCompute(createPractitionerUserHelper, {
      state: {
        form: {},
      },
    });
    expect(result.canEditEmail).toBeTruthy();
    expect(result.canEditAdmissionStatus).toBeFalsy();
  });
});
