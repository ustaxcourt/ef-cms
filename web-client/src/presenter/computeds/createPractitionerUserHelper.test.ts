import { applicationContext } from '../../applicationContext';
import { createPractitionerUserHelper as createPractitionerUserHelperComputed } from './createPractitionerUserHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const createPractitionerUserHelper = withAppContextDecorator(
  createPractitionerUserHelperComputed,
  applicationContext,
);

describe('createPractitionerUserHelper', () => {
  it('returns true for showFirmName if practiceType is Private', () => {
    const result = runCompute(createPractitionerUserHelper, {
      state: {
        form: {
          practiceType: 'Private',
        },
      },
    });
    expect(result.showFirmName).toBeTruthy();
  });

  it('returns false for showFirmName if practiceType is not Private', () => {
    const result = runCompute(createPractitionerUserHelper, {
      state: {
        form: {
          practiceType: 'DOJ',
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

  it('returns formattedOriginalEmail defaulted to Not provided if one is not present', () => {
    const result = runCompute(createPractitionerUserHelper, {
      state: {
        form: {
          originalEmail: null,
        },
      },
    });
    expect(result.formattedOriginalEmail).toEqual('Not provided');
  });

  it('returns formattedOriginalEmail as the originalEmail if one is present on the form', () => {
    const result = runCompute(createPractitionerUserHelper, {
      state: {
        form: {
          originalEmail: 'abc@example.com',
        },
      },
    });
    expect(result.formattedOriginalEmail).toEqual('abc@example.com');
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
