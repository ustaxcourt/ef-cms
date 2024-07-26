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
  mockIrsPractitionerUser,
  mockJudgeUser,
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

describe('Authorization client service', () => {
  it('should return false when the user is undefined', () => {
    expect(
      isAuthorized(undefined, 'unknown action' as any, 'someUser'),
    ).toBeFalsy();
  });

  it('should return true for any user whose userId matches the 3rd owner argument, in this case "someUser" === "someUser"', () => {
    expect(
      isAuthorized(
        mockPetitionerUser,
        'unknown action' as any,
        mockPetitionerUser.userId,
      ),
    ).toBeTruthy();
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

  describe('adc role', () => {
    it('should be authorized for the WORK_ITEM permission', () => {
      expect(isAuthorized(mockAdcUser, ROLE_PERMISSIONS.WORKITEM)).toBeTruthy();
    });

    it('should be authorized to stamp a motion', () => {
      expect(
        isAuthorized(mockAdcUser, ROLE_PERMISSIONS.STAMP_MOTION),
      ).toBeTruthy();
    });
  });

  describe('chambers role', () => {
    it('should be authorized to stamp a motion', () => {
      expect(
        isAuthorized(mockChambersUser, ROLE_PERMISSIONS.STAMP_MOTION),
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

  describe('irsPractitioner', () => {
    it('should be authorized to get a case', () => {
      expect(
        isAuthorized(mockIrsPractitionerUser, ROLE_PERMISSIONS.GET_CASE),
      ).toBeTruthy();
    });
  });

  describe('judge role', () => {
    it('should be authorized to stamp a motion', () => {
      expect(
        isAuthorized(mockJudgeUser, ROLE_PERMISSIONS.STAMP_MOTION),
      ).toBeTruthy();
    });
  });

  describe('petitionsClerk role', () => {
    it('should be authorized to get a case', () => {
      expect(
        isAuthorized(mockPetitionsClerkUser, ROLE_PERMISSIONS.GET_CASE),
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
