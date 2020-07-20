const {
  AUTHORIZATION_MAP,
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('./authorizationClientService');
const { ROLES } = require('../business/entities/EntityConstants');

describe('Authorization client service', () => {
  it('returns true for any user whose userId matches the 3rd owner argument, in this case "someUser" === "someUser"', () => {
    expect(
      isAuthorized(
        { role: ROLES.petitioner, userId: 'someUser' },
        'unknown action',
        'someUser',
      ),
    ).toBeTruthy();
  });

  it('should authorize a petitionsclerk for getCase', () => {
    expect(
      isAuthorized(
        { role: ROLES.petitionsClerk, userId: 'petitionsclerk' },
        ROLE_PERMISSIONS.GET_CASE,
      ),
    ).toBeTruthy();
  });

  it("should return false when a user doesn't have a petitionsclerk role", () => {
    expect(
      isAuthorized(
        { role: ROLES.petitioner, userId: 'someUser' },
        ROLE_PERMISSIONS.GET_CASES_BY_STATUS,
      ),
    ).toBeFalsy();
  });

  it('should authorize a petitions clerk for work items', () => {
    expect(
      isAuthorized(
        { role: ROLES.petitionsClerk, userId: 'petitionsclerk' },
        ROLE_PERMISSIONS.WORKITEM,
      ),
    ).toBeTruthy();
  });

  it('should authorize a petitions clerk for start a case from paper', () => {
    expect(
      isAuthorized(
        { role: ROLES.petitionsClerk, userId: 'petitionsclerk' },
        ROLE_PERMISSIONS.START_PAPER_CASE,
      ),
    ).toBeTruthy();
  });

  it('should authorize a petitions serve petition', () => {
    expect(
      isAuthorized(
        { role: ROLES.petitionsClerk, userId: 'petitionsclerk' },
        ROLE_PERMISSIONS.SERVE_PETITION,
      ),
    ).toBeTruthy();
  });

  it('should authorize a docket clerk for work items', () => {
    expect(
      isAuthorized(
        { role: ROLES.docketClerk, userId: 'docketclerk' },
        ROLE_PERMISSIONS.WORKITEM,
      ),
    ).toBeTruthy();
  });

  it('should authorize an adc user for work items', () => {
    expect(
      isAuthorized(
        { role: ROLES.adc, userId: 'adc' },
        ROLE_PERMISSIONS.WORKITEM,
      ),
    ).toBeTruthy();
  });

  it('should authorize an irsPractitioner for getCase', () => {
    expect(
      isAuthorized(
        { role: ROLES.irsPractitioner, userId: 'irsPractitioner' },
        ROLE_PERMISSIONS.GET_CASE,
      ),
    ).toBeTruthy();
  });

  it('should authorize a docketclerk for update case', () => {
    expect(
      isAuthorized(
        { role: ROLES.docketClerk, userId: 'docketclerk' },
        ROLE_PERMISSIONS.UPDATE_CASE,
      ),
    ).toBeTruthy();
  });

  it('should evaluate owner when the owner param is provided', () => {
    expect(
      isAuthorized(
        { role: ROLES.docketClerk, userId: '123456' },
        ROLE_PERMISSIONS.UPDATE_CASE,
        123456,
      ),
    ).toBeTruthy();
  });

  it('should contain NO falsy values in the AUTHORIZATION_MAP', async () => {
    Object.keys(AUTHORIZATION_MAP).forEach(role => {
      AUTHORIZATION_MAP[role].forEach(permission => {
        expect(permission).toBeTruthy();
      });
    });
  });
});
