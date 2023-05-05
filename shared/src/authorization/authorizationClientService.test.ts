import {
  AUTHORIZATION_MAP,
  ROLE_PERMISSIONS,
  isAuthorized,
} from './authorizationClientService';
import { ROLES } from '../business/entities/EntityConstants';

describe('Authorization client service', () => {
  it('should return false when the user is undefined', () => {
    expect(isAuthorized(undefined, 'unknown action', 'someUser')).toBeFalsy();
  });

  it('should return true for any user whose userId matches the 3rd owner argument, in this case "someUser" === "someUser"', () => {
    expect(
      isAuthorized(
        { role: ROLES.petitioner, userId: 'someUser' },
        'unknown action',
        'someUser',
      ),
    ).toBeTruthy();
  });

  it('should return false when the role provided is not found in the AUTHORIZATION_MAP', () => {
    expect(
      isAuthorized(
        { role: 'NOT_A_ROLE', userId: 'judgebuch' },
        ROLE_PERMISSIONS.WORKITEM,
      ),
    ).toBe(false);
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
      expect(
        isAuthorized(
          { role: ROLES.adc, userId: 'adc' },
          ROLE_PERMISSIONS.WORKITEM,
        ),
      ).toBeTruthy();
    });

    it('should be authorized to stamp a motion', () => {
      expect(
        isAuthorized(
          { role: ROLES.adc, userId: 'adc' },
          ROLE_PERMISSIONS.STAMP_MOTION,
        ),
      ).toBeTruthy();
    });
  });

  describe('chambers role', () => {
    it('should be authorized to stamp a motion', () => {
      expect(
        isAuthorized(
          { role: ROLES.chambers, userId: 'chambers1' },
          ROLE_PERMISSIONS.STAMP_MOTION,
        ),
      ).toBeTruthy();
    });
  });

  describe('case services supervisor role', () => {
    it('should be authorized to perform both docket clerk and petitions clerk specific actions', () => {
      expect(
        isAuthorized(
          {
            role: ROLES.caseServicesSupervisor,
            userId: 'caseServicesSupervisor1',
          },
          ROLE_PERMISSIONS.ADD_EDIT_STATISTICS,
        ),
      ).toBeTruthy();
      expect(
        isAuthorized(
          {
            role: ROLES.caseServicesSupervisor,
            userId: 'caseServicesSupervisor1',
          },
          ROLE_PERMISSIONS.QC_PETITION,
        ),
      ).toBeTruthy();
    });
  });

  describe('docketClerk role', () => {
    it('should be authorized for the WORK_ITEM permission', () => {
      expect(
        isAuthorized(
          { role: ROLES.docketClerk, userId: 'docketclerk' },
          ROLE_PERMISSIONS.WORKITEM,
        ),
      ).toBeTruthy();
    });

    it('should be authorized to seal an address', () => {
      expect(
        isAuthorized(
          { role: ROLES.docketClerk, userId: 'docketclerk' },
          ROLE_PERMISSIONS.SEAL_ADDRESS,
        ),
      ).toBeTruthy();
    });

    it('should be authorized to perform track items operations', () => {
      expect(
        isAuthorized(
          { role: ROLES.docketClerk, userId: 'docketclerk' },
          ROLE_PERMISSIONS.TRACKED_ITEMS,
        ),
      ).toBeTruthy();
    });

    it('should be authorized to update a case', () => {
      expect(
        isAuthorized(
          { role: ROLES.docketClerk, userId: 'docketclerk' },
          ROLE_PERMISSIONS.UPDATE_CASE,
        ),
      ).toBeTruthy();
    });
  });

  describe('irsPractitioner', () => {
    it('should be authorized to get a case', () => {
      expect(
        isAuthorized(
          { role: ROLES.irsPractitioner, userId: 'irsPractitioner' },
          ROLE_PERMISSIONS.GET_CASE,
        ),
      ).toBeTruthy();
    });
  });

  describe('judge role', () => {
    it('should be authorized to stamp a motion', () => {
      expect(
        isAuthorized(
          { role: ROLES.judge, userId: 'judgebuch' },
          ROLE_PERMISSIONS.STAMP_MOTION,
        ),
      ).toBeTruthy();
    });
  });

  describe('petitionsClerk role', () => {
    it('should be authorized to get a case', () => {
      expect(
        isAuthorized(
          { role: ROLES.petitionsClerk, userId: 'petitionsclerk' },
          ROLE_PERMISSIONS.GET_CASE,
        ),
      ).toBeTruthy();
    });

    it('should be authorized to perform track items operations', () => {
      expect(
        isAuthorized(
          { role: ROLES.docketClerk, userId: 'docketclerk' },
          ROLE_PERMISSIONS.TRACKED_ITEMS,
        ),
      ).toBeTruthy();
    });

    it('should be authorized for the WORK_ITEM permission', () => {
      expect(
        isAuthorized(
          { role: ROLES.petitionsClerk, userId: 'petitionsclerk' },
          ROLE_PERMISSIONS.WORKITEM,
        ),
      ).toBeTruthy();
    });

    it('should be authorized to start a case from paper', () => {
      expect(
        isAuthorized(
          { role: ROLES.petitionsClerk, userId: 'petitionsclerk' },
          ROLE_PERMISSIONS.START_PAPER_CASE,
        ),
      ).toBeTruthy();
    });

    it('should be authorized to serve a petition', () => {
      expect(
        isAuthorized(
          { role: ROLES.petitionsClerk, userId: 'petitionsclerk' },
          ROLE_PERMISSIONS.SERVE_PETITION,
        ),
      ).toBeTruthy();
    });

    it('should be authorized to seal a docket entry', () => {
      expect(
        isAuthorized(
          { role: ROLES.docketClerk, userId: 'docketclerk' },
          ROLE_PERMISSIONS.SEAL_DOCKET_ENTRY,
        ),
      ).toBeTruthy();
    });
  });
});
