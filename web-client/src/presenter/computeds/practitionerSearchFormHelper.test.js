import { practitionerSearchFormHelper } from './practitionerSearchFormHelper';
import { runCompute } from 'cerebral/test';

describe('practitionerSearchFormHelper', () => {
  it('should set showAddPractitioner to true when user has the MANAGE_PRACTITIONER_USERS permission', () => {
    const { showAddPractitioner } = runCompute(practitionerSearchFormHelper, {
      state: {
        permissions: {
          MANAGE_PRACTITIONER_USERS: true,
        },
      },
    });
    expect(showAddPractitioner).toBeTruthy();
  });

  it('should set showAddPractitioner to false when user has the MANAGE_PRACTITIONER_USERS permission', () => {
    const { showAddPractitioner } = runCompute(practitionerSearchFormHelper, {
      state: {
        permissions: {
          MANAGE_PRACTITIONER_USERS: false,
        },
      },
    });
    expect(showAddPractitioner).toBeFalsy();
  });
});
