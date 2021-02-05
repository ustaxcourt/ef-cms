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

  it('returns emailFormatted defaulted to Not provided if one is not present', () => {
    const result = runCompute(createPractitionerUserHelper, {
      state: {
        form: {
          email: null,
        },
      },
    });
    expect(result.emailFormatted).toEqual('Not provided');
  });

  it('returns emailFormatted as the email if one is present on the form', () => {
    const result = runCompute(createPractitionerUserHelper, {
      state: {
        form: {
          email: 'abc@example.com',
        },
      },
    });
    expect(result.emailFormatted).toEqual('abc@example.com');
  });

  it('returns isAddingPractitioner false and isEditingPractitioner true when barNumber is set on the form', () => {
    const result = runCompute(createPractitionerUserHelper, {
      state: {
        form: {
          barNumber: 'PT1234',
        },
      },
    });

    expect(result.isAddingPractitioner).toBeFalsy();
    expect(result.isEditingPractitioner).toBeTruthy();
  });

  it('returns isAddingPractitioner true and isEditingPractitioner false when barNumber is NOT set on the form', () => {
    const result = runCompute(createPractitionerUserHelper, {
      state: {
        form: {},
      },
    });

    expect(result.isAddingPractitioner).toBeTruthy();
    expect(result.isEditingPractitioner).toBeFalsy();
  });
});
