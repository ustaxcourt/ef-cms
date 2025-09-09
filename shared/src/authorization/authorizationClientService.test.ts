import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  AUTHORIZATION_MAP,
  ROLE_PERMISSIONS,
  isAuthorized,
} from './authorizationClientService';
import {
  mockAdcUser,
  mockCaseServicesSupervisorUser,
  mockChambersUser,
  mockDocketClerkUser,
  mockJudgeUser,
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

describe('Authorization client service', () => {
  it('should return false when the user is undefined', () => {
    expect(isAuthorized(undefined, 'unknown action' as any)).toBeFalsy();
  });

  it('should return false when the role provided is not found in the AUTHORIZATION_MAP', () => {
    expect(isAuthorized(mockPetitionerUser, ROLE_PERMISSIONS.WORKITEM)).toBe(
      false,
    );
  });

  it('should contain NO falsy values in the AUTHORIZATION_MAP', () => {
    Object.keys(AUTHORIZATION_MAP).forEach(role => {
      AUTHORIZATION_MAP[role].forEach(permission => {
        expect(permission).toBeTruthy();
      });
    });
  });

  it('should return false if user is missing role property, even if permission might match', () => {
    const userWithoutRole = {
      name: 'No Role Provided',
      userId: 'abc-123',
    };
    const result = isAuthorized(
      userWithoutRole as any,
      ROLE_PERMISSIONS.WORKITEM,
    );
    expect(result).toBe(false);
  });

  it('should return false if user has a recognized role, but the permission is not in the role array', () => {
    const permissionNotInDocketClerk = ROLE_PERMISSIONS.CREATE_USER;

    const result = isAuthorized(
      mockDocketClerkUser,
      permissionNotInDocketClerk,
    );
    expect(result).toBe(false);
  });

  it('should return false when a role is recognized in AUTHORIZATION_MAP but grants zero permissions', () => {
    const legacyJudgeUser = {
      name: 'Ancient Judge',
      role: 'legacyJudge',
      userId: 'legacy-666',
    } as AuthUser;
    const somePermission = ROLE_PERMISSIONS.ADD_CASE_TO_TRIAL_SESSION;

    const result = isAuthorized(legacyJudgeUser, somePermission);
    expect(result).toBe(false);
  });

  it('should return false if the permission is definitely not in the user`s permission array', () => {
    const result = isAuthorized(
      mockPetitionsClerkUser,
      ROLE_PERMISSIONS.UNSEAL_CASE,
    );
    expect(result).toBe(false);
  });

  describe('adc role', () => {
    it('should be authorized for the WORK_ITEM permission', () => {
      expect(isAuthorized(mockAdcUser, ROLE_PERMISSIONS.WORKITEM)).toBeTruthy();
    });

    it('should be authorized to stamp a motion', () => {
      expect(
        isAuthorized(mockAdcUser, ROLE_PERMISSIONS.STAMP_MOTION),
      ).toBeTruthy();
    });

    it('should be authorized for motion order response', () => {
      expect(
        isAuthorized(mockAdcUser, ROLE_PERMISSIONS.MOTION_ORDER_RESPONSE),
      ).toBeTruthy();
    });
  });

  describe('chambers role', () => {
    it('should be authorized to stamp a motion', () => {
      expect(
        isAuthorized(mockChambersUser, ROLE_PERMISSIONS.STAMP_MOTION),
      ).toBeTruthy();
    });

    it('should be authorized for motion order response', () => {
      expect(
        isAuthorized(mockChambersUser, ROLE_PERMISSIONS.MOTION_ORDER_RESPONSE),
      ).toBeTruthy();
    });
  });

  describe('case services supervisor role', () => {
    it('should be authorized to perform both docket clerk and petitions clerk specific actions', () => {
      expect(
        isAuthorized(
          mockCaseServicesSupervisorUser,
          ROLE_PERMISSIONS.ADD_EDIT_STATISTICS,
        ),
      ).toBeTruthy();
      expect(
        isAuthorized(
          mockCaseServicesSupervisorUser,
          ROLE_PERMISSIONS.QC_PETITION,
        ),
      ).toBeTruthy();
    });
  });

  describe('docketClerk role', () => {
    it('should be authorized for the WORK_ITEM permission', () => {
      expect(
        isAuthorized(mockDocketClerkUser, ROLE_PERMISSIONS.WORKITEM),
      ).toBeTruthy();
    });

    it('should be authorized to seal an address', () => {
      expect(
        isAuthorized(mockDocketClerkUser, ROLE_PERMISSIONS.SEAL_ADDRESS),
      ).toBeTruthy();
    });

    it('should be authorized to perform track items operations', () => {
      expect(
        isAuthorized(mockDocketClerkUser, ROLE_PERMISSIONS.TRACKED_ITEMS),
      ).toBeTruthy();
    });

    it('should be authorized to update a case', () => {
      expect(
        isAuthorized(mockDocketClerkUser, ROLE_PERMISSIONS.UPDATE_CASE),
      ).toBeTruthy();
    });
  });

  describe('judge role', () => {
    it('should be authorized to stamp a motion', () => {
      expect(
        isAuthorized(mockJudgeUser, ROLE_PERMISSIONS.STAMP_MOTION),
      ).toBeTruthy();
    });

    it('should be authorized for motion order response', () => {
      expect(
        isAuthorized(mockJudgeUser, ROLE_PERMISSIONS.MOTION_ORDER_RESPONSE),
      ).toBeTruthy();
    });
  });

  describe('petitionsClerk role', () => {
    it('should be authorized to get case data', () => {
      expect(
        isAuthorized(
          mockPetitionsClerkUser,
          ROLE_PERMISSIONS.GET_ALL_CASE_DATA,
        ),
      ).toBeTruthy();
    });

    it('should be authorized to perform track items operations', () => {
      expect(
        isAuthorized(mockDocketClerkUser, ROLE_PERMISSIONS.TRACKED_ITEMS),
      ).toBeTruthy();
    });

    it('should be authorized for the WORK_ITEM permission', () => {
      expect(
        isAuthorized(mockPetitionsClerkUser, ROLE_PERMISSIONS.WORKITEM),
      ).toBeTruthy();
    });

    it('should be authorized to start a case from paper', () => {
      expect(
        isAuthorized(mockPetitionsClerkUser, ROLE_PERMISSIONS.START_PAPER_CASE),
      ).toBeTruthy();
    });

    it('should be authorized to serve a petition', () => {
      expect(
        isAuthorized(mockPetitionsClerkUser, ROLE_PERMISSIONS.SERVE_PETITION),
      ).toBeTruthy();
    });

    it('should be authorized to seal a docket entry', () => {
      expect(
        isAuthorized(mockDocketClerkUser, ROLE_PERMISSIONS.SEAL_DOCKET_ENTRY),
      ).toBeTruthy();
    });
  });
});

describe('line 363 coverage - actionInRoleAuthorization boolean conversion', () => {
  it('should return true when permission exists in role permissions array (!! converts truthy to true)', () => {
    // Test case where indexOf finds the permission and !!permissions[index] returns true
    const result = isAuthorized(
      mockDocketClerkUser,
      ROLE_PERMISSIONS.ADD_PETITIONER_TO_CASE,
    );
    expect(result).toBe(true);
  });

  it('should return false when permission does not exist in role permissions array (!! converts undefined to false)', () => {
    // Test case where indexOf returns -1, so permissions[-1] is undefined, and !!undefined is false
    const result = isAuthorized(
      mockPetitionerUser,
      ROLE_PERMISSIONS.ADD_PETITIONER_TO_CASE,
    );
    expect(result).toBe(false);
  });

  it('should return false when permission is not found (indexOf returns -1, !!permissions[-1] is false)', () => {
    // Explicitly test a permission that definitely doesn't exist for petitioner
    const result = isAuthorized(
      mockPetitionerUser,
      ROLE_PERMISSIONS.DOCKET_ENTRY,
    );
    expect(result).toBe(false);
  });

  it('should handle edge case where role has empty permissions array', () => {
    const inactivePractitionerUser = {
      name: 'Inactive Practitioner',
      role: 'inactivePractitioner',
      userId: 'inactive-123',
    } as AuthUser;

    // Test with empty permissions array - indexOf returns -1, !!permissions[-1] is false
    const result = isAuthorized(
      inactivePractitionerUser,
      ROLE_PERMISSIONS.PETITION,
    );
    expect(result).toBe(false);
  });

  it('should return false for legacyJudge role with any permission (empty permissions array)', () => {
    const legacyJudgeUser = {
      name: 'Legacy Judge',
      role: 'legacyJudge',
      userId: 'legacy-123',
    } as AuthUser;

    // Test that !!permissions[-1] returns false for empty permission arrays
    const result = isAuthorized(legacyJudgeUser, ROLE_PERMISSIONS.JUDGES_NOTES);
    expect(result).toBe(false);
  });

  it('should return true when permission string is found at valid index (tests truthy permission string conversion)', () => {
    // Verify that finding a permission string at a valid index converts to true
    const result = isAuthorized(mockJudgeUser, ROLE_PERMISSIONS.JUDGES_NOTES);
    expect(result).toBe(true);
  });

  it('should return false when searching for permission not in chambers role', () => {
    // Test case where chambers user doesn't have a specific permission
    const result = isAuthorized(mockChambersUser, ROLE_PERMISSIONS.QC_PETITION);
    expect(result).toBe(false);
  });
});

describe('additional edge cases for comprehensive line 363 coverage', () => {
  it('should handle case where user role exists but permission is at beginning of array', () => {
    // Test when permission is at index 0 - !!permissions[0] should be true
    const result = isAuthorized(
      mockPetitionerUser,
      ROLE_PERMISSIONS.EMAIL_MANAGEMENT,
    );
    expect(result).toBe(true);
  });

  it('should handle case where user role exists but permission is at end of array', () => {
    // Find a permission that's likely at the end of an array to test !!permissions[lastIndex]
    const result = isAuthorized(
      mockDocketClerkUser,
      ROLE_PERMISSIONS.VIEW_SEALED_ADDRESS,
    );
    expect(result).toBe(true);
  });

  it('should return false when role is undefined/null in AUTHORIZATION_MAP lookup', () => {
    const userWithNullRole = {
      name: 'User with null role',
      role: null,
      userId: 'null-role-123',
    } as any;

    const result = isAuthorized(userWithNullRole, ROLE_PERMISSIONS.WORKITEM);
    expect(result).toBe(false);
  });
});
