import {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { caseInformationHelper as caseInformationHelperComputed } from './caseInformationHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('caseInformationHelper', () => {
  const caseInformationHelper = withAppContextDecorator(
    caseInformationHelperComputed,
    applicationContext,
  );

  const getBaseState = user => {
    return {
      permissions: getUserPermissions(user),
    };
  };

  it('should show add counsel section if user is an internal user', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseInformationHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          petitioners: [],
        },
        form: {},
      },
    });
    expect(result.showAddCounsel).toEqual(true);
  });

  it('should show hearings table if there are hearings on the case', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseInformationHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          hearings: [{ trialSessionId: 'trial-id-123' }],
          petitioners: [],
        },
        form: {},
      },
    });
    expect(result.showHearingsTable).toEqual(true);
  });

  it('should not show hearings table if there are no hearings on the case', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseInformationHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          hearings: [],
          petitioners: [],
        },
        form: {},
      },
    });
    expect(result.showHearingsTable).toEqual(false);
  });

  it('should not show add counsel section if user is an external user', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseInformationHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          petitioners: [],
        },
        form: {},
      },
    });
    expect(result.showAddCounsel).toEqual(false);
  });

  it('should show edit privatePractitioners and irsPractitioners buttons if user is an internal user and there are privatePractitioners and irsPractitioners on the case', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseInformationHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          irsPractitioners: [{ userId: '2' }],
          petitioners: [],
          privatePractitioners: [{ userId: '1' }],
        },
        form: {},
      },
    });
    expect(result.showEditPrivatePractitioners).toBeTruthy();
    expect(result.showEditIrsPractitioners).toBeTruthy();
  });

  it('should not show edit privatePractitioners or irsPractitioners buttons if user is an internal user and there are not privatePractitioners and irsPractitioners on the case', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseInformationHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          petitioners: [],
        },
        form: {},
      },
    });
    expect(result.showEditPrivatePractitioners).toBeFalsy();
    expect(result.showEditIrsPractitioners).toBeFalsy();
  });

  it('should not show edit privatePractitioners or irsPractitioners buttons if user is not an internal user', () => {
    const user = {
      role: ROLES.petitioner,
      userId: '789',
    };
    const result = runCompute(caseInformationHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          irsPractitioners: [{ userId: '2' }],
          petitioners: [],
          privatePractitioners: [{ userId: '1' }],
        },
        form: {},
      },
    });
    expect(result.showEditPrivatePractitioners).toBeFalsy();
    expect(result.showEditIrsPractitioners).toBeFalsy();
  });

  it('should not show Seal Case button if user does not have SEAL_CASE permission', () => {
    const user = {
      role: ROLES.petitionsClerk, // does not have SEAL_CASE permission
      userId: '789',
    };
    const result = runCompute(caseInformationHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          petitioners: [],
        },
        form: {},
      },
    });
    expect(result.showSealCaseButton).toBeFalsy();
  });

  it('should show Seal Case button if user has SEAL_CASE permission and case is not already sealed', () => {
    const user = {
      role: ROLES.docketClerk, // has SEAL_CASE permission
      userId: '789',
    };
    const result = runCompute(caseInformationHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          petitioners: [],
        },
        form: {},
      },
    });
    expect(result.showSealCaseButton).toBeTruthy();
  });

  it('should not show Seal Case button if user has SEAL_CASE permission and case is already sealed', () => {
    const user = {
      role: ROLES.docketClerk, // has SEAL_CASE permission
      userId: '789',
    };
    const result = runCompute(caseInformationHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { isSealed: true, petitioners: [] },
        form: {},
      },
    });
    expect(result.showSealCaseButton).toBeFalsy();
  });

  describe('other petitioners', () => {
    let baseState;

    beforeEach(() => {
      const user = {
        role: ROLES.docketClerk, // has SEAL_CASE permission
        userId: '789',
      };

      baseState = {
        ...getBaseState(user),
        caseDetail: {},
        form: {},
      };
    });

    it('shows "Hide" display if showingAdditionalPetitioners is true', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...baseState,
          showingAdditionalPetitioners: true,
        },
      });

      expect(result.toggleAdditionalPetitionersDisplay).toEqual('Hide');
    });

    it('shows "View" display if showingAdditionalPetitioners is false', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...baseState,
          caseDetail: {
            petitioners: [],
          },
          showingAdditionalPetitioners: false,
        },
      });

      expect(result.toggleAdditionalPetitionersDisplay).toEqual('View');
    });

    it('paginates and shows four petitioner if showingAdditionalPetitioners is false', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...baseState,
          caseDetail: {
            petitioners: [
              { a: '1', contactType: CONTACT_TYPES.primary },
              { a: '1', contactType: CONTACT_TYPES.secondary },
              { a: '1', contactType: CONTACT_TYPES.otherPetitioner },
              { a: '1', contactType: CONTACT_TYPES.otherPetitioner },
              { a: '1', contactType: CONTACT_TYPES.otherPetitioner },
              { a: '1', contactType: CONTACT_TYPES.otherPetitioner },
            ],
          },
          showingAdditionalPetitioners: false,
        },
      });

      expect(result.formattedPetitioners.length).toEqual(4);
    });

    it('does not paginate (shows all) if showingAdditionalPetitioners is true', () => {
      const result = runCompute(caseInformationHelper, {
        state: {
          ...baseState,
          caseDetail: {
            petitioners: [
              { a: '1', contactType: CONTACT_TYPES.primary },
              { a: '1', contactType: CONTACT_TYPES.otherPetitioner },
              { a: '1', contactType: CONTACT_TYPES.otherPetitioner },
              { a: '1', contactType: CONTACT_TYPES.otherPetitioner },
              { a: '1', contactType: CONTACT_TYPES.otherPetitioner },
              { a: '1', contactType: CONTACT_TYPES.otherPetitioner },
              { a: '1', contactType: CONTACT_TYPES.otherPetitioner },
            ],
          },
          showingAdditionalPetitioners: true,
        },
      });

      expect(result.formattedPetitioners.length).toEqual(7);
    });
  });

  describe('showSealAddressLink', () => {
    it('should be true when the user is a docket clerk', () => {
      const user = {
        role: ROLES.docketClerk,
        userId: '789',
      };
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            petitioners: [],
          },
          form: {},
        },
      });
      expect(result.showSealAddressLink).toEqual(true);
    });

    it('should be false when the user is not a docket clerk', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '789',
      };
      const result = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            petitioners: [],
          },
          form: {},
        },
      });
      expect(result.showSealAddressLink).toEqual(false);
    });
  });

  describe('contactPrimaryEmailFormatted', () => {
    const mockEmail = 'error@example.com';
    const user = {
      role: ROLES.petitioner,
      userId: '789',
    };

    it('should display the case contact primary email when it is defined', () => {
      const { contactPrimaryEmailFormatted } = runCompute(
        caseInformationHelper,
        {
          state: {
            ...getBaseState(user),
            caseDetail: {
              petitioners: [
                {
                  contactType: CONTACT_TYPES.primary,
                  email: mockEmail,
                },
              ],
            },
            form: {},
          },
        },
      );
      expect(contactPrimaryEmailFormatted).toBe(mockEmail);
    });

    it('should display `Not provided` when the case contact primary does not have an email', () => {
      const { contactPrimaryEmailFormatted } = runCompute(
        caseInformationHelper,
        {
          state: {
            ...getBaseState(user),
            caseDetail: {
              petitioners: [
                {
                  contactType: CONTACT_TYPES.primary,
                  pendingEmail: mockEmail,
                },
              ],
            },
            form: {},
          },
        },
      );
      expect(contactPrimaryEmailFormatted).toBe('Not provided');
    });
  });

  describe('contactSecondaryEmailFormatted', () => {
    const mockEmail = 'error@example.com';
    const user = {
      role: ROLES.petitioner,
      userId: '789',
    };

    it('should be true when the case contact secondary has an email', () => {
      const mockEmailSecondary = 'petitioner2@example.com';
      const { contactSecondaryEmailFormatted } = runCompute(
        caseInformationHelper,
        {
          state: {
            ...getBaseState(user),
            caseDetail: {
              petitioners: [
                {
                  contactType: CONTACT_TYPES.primary,
                },
                {
                  contactType: CONTACT_TYPES.secondary,
                  email: mockEmailSecondary,
                },
              ],
            },
            form: {},
          },
        },
      );
      expect(contactSecondaryEmailFormatted).toBe(mockEmailSecondary);
    });

    it('should be false when the case contact secondary does not have an email', () => {
      const { contactSecondaryEmailFormatted } = runCompute(
        caseInformationHelper,
        {
          state: {
            ...getBaseState(user),
            caseDetail: {
              petitioners: [
                {
                  contactType: CONTACT_TYPES.primary,
                },
                {
                  contactType: CONTACT_TYPES.secondary,
                  pendingEmail: mockEmail,
                },
              ],
            },
            form: {},
          },
        },
      );
      expect(contactSecondaryEmailFormatted).toBe('Not provided');
    });
  });

  describe('showAddPetitionerButton', () => {
    it('should be true when case status is not new and user has ADD_PETITIONER_TO_CASE permission', () => {
      const user = {
        role: ROLES.docketClerk,
        userId: '789',
      };

      const { showAddPetitionerButton } = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            petitioners: [],
            status: CASE_STATUS_TYPES.generalDocket,
          },
          form: {},
        },
      });

      expect(showAddPetitionerButton).toBeTruthy();
    });

    it('should be false when case status is new and user has ADD_PETITIONER_TO_CASE permission', () => {
      const user = {
        role: ROLES.docketClerk,
        userId: '789',
      };

      const { showAddPetitionerButton } = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            petitioners: [],
            status: CASE_STATUS_TYPES.new,
          },
          form: {},
        },
      });

      expect(showAddPetitionerButton).toBeFalsy();
    });

    it('should be false when case status is not new and user does not have ADD_PETITIONER_TO_CASE permission', () => {
      const user = {
        role: ROLES.petitionsClerk,
        userId: '789',
      };

      const { showAddPetitionerButton } = runCompute(caseInformationHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            petitioners: [],
            status: CASE_STATUS_TYPES.generalDocket,
          },
          form: {},
        },
      });

      expect(showAddPetitionerButton).toBeFalsy();
    });
  });
});
