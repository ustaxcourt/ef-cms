import { practitionerSearchFormHelper } from './practitionerSearchFormHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('practitionerSearchFormHelper', () => {
  it('should set showAddPractitioner to true when user has the ADD_EDIT_PRACTITIONER_USER permission', () => {
    const { showAddPractitioner } = runCompute(practitionerSearchFormHelper, {
      state: {
        permissions: {
          ADD_EDIT_PRACTITIONER_USER: true,
        },
      },
    });
    expect(showAddPractitioner).toBeTruthy();
  });

  it('should set showAddPractitioner to false when user has the ADD_EDIT_PRACTITIONER_USER permission', () => {
    const { showAddPractitioner } = runCompute(practitionerSearchFormHelper, {
      state: {
        permissions: {
          ADD_EDIT_PRACTITIONER_USER: false,
        },
      },
    });
    expect(showAddPractitioner).toBeFalsy();
  });
});
