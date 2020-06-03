import { applicationContext } from '../../applicationContext';
import { practitionerDetailHelper as practitionerDetailHelperComputed } from './practitionerDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const practitionerDetailHelper = withAppContextDecorator(
  practitionerDetailHelperComputed,
  {
    ...applicationContext,
  },
);

describe('practitionerDetailHelper', () => {
  it('should fall back to Not provided when additionalPhone is not set', () => {
    const { additionalPhone } = runCompute(practitionerDetailHelper, {
      state: {
        permissions: {},
        practitionerDetail: {
          additionalPhone: null,
        },
      },
    });
    expect(additionalPhone).toEqual('Not provided');
  });

  it('should fall back to Not provided when alternateEmail is not set', () => {
    const { alternateEmail } = runCompute(practitionerDetailHelper, {
      state: {
        permissions: {},
        practitionerDetail: {
          alternateEmail: null,
        },
      },
    });
    expect(alternateEmail).toEqual('Not provided');
  });

  it('should format the admissionsDate', () => {
    const { admissionsDateFormatted } = runCompute(practitionerDetailHelper, {
      state: {
        permissions: {},
        practitionerDetail: {
          admissionsDate: '2020-01-27T05:00:00.000Z',
        },
      },
    });
    expect(admissionsDateFormatted).toEqual('01/27/2020');
  });

  it('should show the edit link if the user has ADD_EDIT_PRACTITIONER_USER permission', () => {
    const { showEditLink } = runCompute(practitionerDetailHelper, {
      state: {
        permissions: {
          ADD_EDIT_PRACTITIONER_USER: true,
        },
        practitionerDetail: {
          admissionsDate: '2020-01-27T05:00:00.000Z',
        },
      },
    });
    expect(showEditLink).toBeTruthy();
  });

  it('should not show the edit link if the user does not have ADD_EDIT_PRACTITIONER_USER permission', () => {
    const { showEditLink } = runCompute(practitionerDetailHelper, {
      state: {
        permissions: {
          ADD_EDIT_PRACTITIONER_USER: false,
        },
        practitionerDetail: {
          admissionsDate: '2020-01-27T05:00:00.000Z',
        },
      },
    });
    expect(showEditLink).toBeFalsy();
  });
});
