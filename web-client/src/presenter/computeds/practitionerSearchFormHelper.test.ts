import { applicationContext } from '../../applicationContext';
import { practitionerSearchFormHelper as practitionerSearchFormHelperComputed } from './practitionerSearchFormHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('practitionerSearchFormHelper', () => {
  const practitionerSearchFormHelper = withAppContextDecorator(
    practitionerSearchFormHelperComputed,
    {
      ...applicationContext,
    },
  );

  it('should set showAddPractitioner to true when user has the ADD_EDIT_PRACTITIONER_USER permission and isPublicUser is false', () => {
    const { showAddPractitioner } = runCompute(practitionerSearchFormHelper, {
      state: {
        permissions: {
          ADD_EDIT_PRACTITIONER_USER: true,
        },
      },
    });
    expect(showAddPractitioner).toBeTruthy();
  });

  it('should set showAddPractitioner to false when user has the ADD_EDIT_PRACTITIONER_USER permission and isPublicUser is false', () => {
    const { showAddPractitioner } = runCompute(practitionerSearchFormHelper, {
      state: {
        permissions: {
          ADD_EDIT_PRACTITIONER_USER: false,
        },
      },
    });
    expect(showAddPractitioner).toBeFalsy();
  });

  it('should set showAddPractitioner to true when user has the ADD_EDIT_PRACTITIONER_USER permission and isPublicUser is true', () => {
    const test_practitionerSearchFormHelper = withAppContextDecorator(
      practitionerSearchFormHelperComputed,
      {
        ...applicationContext,
        isPublicUser: () => true,
      },
    );

    const { showAddPractitioner } = runCompute(
      test_practitionerSearchFormHelper,
      {
        state: {
          permissions: {
            ADD_EDIT_PRACTITIONER_USER: true,
          },
        },
      },
    );
    expect(showAddPractitioner).toBeFalsy();
  });

  it('should set showAddPractitioner to false when user has the ADD_EDIT_PRACTITIONER_USER permission and isPublicUser is true', () => {
    const test_practitionerSearchFormHelper = withAppContextDecorator(
      practitionerSearchFormHelperComputed,
      {
        ...applicationContext,
        isPublicUser: () => true,
      },
    );

    const { showAddPractitioner } = runCompute(
      test_practitionerSearchFormHelper,
      {
        state: {
          permissions: {
            ADD_EDIT_PRACTITIONER_USER: false,
          },
        },
      },
    );
    expect(showAddPractitioner).toBeFalsy();
  });
});
