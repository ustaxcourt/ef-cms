const {
  GET_CASE,
  GET_CASES_BY_STATUS,
  isAuthorized,
  PETITION,
  UPDATE_CASE,
  WORKITEM,
} = require('./authorizationClientService');

describe('Authorization client service', () => {
  it('returns true for any user whose userId matches the 3rd owner argument, in this case "someUser" === "someUser"', () => {
    expect(
      isAuthorized(
        { role: 'petitioner', userId: 'someUser' },
        'unknown action',
        'someUser',
      ),
    ).toBeTruthy();
  });

  it('should authorize a petitionsclerk for getCase', () => {
    expect(
      isAuthorized(
        { role: 'petitionsclerk', userId: 'petitionsclerk' },
        GET_CASE,
      ),
    ).toBeTruthy();
  });

  it('should return false when a user doesnt have a petitionsclerk role', () => {
    expect(
      isAuthorized(
        { role: 'petitioner', userId: 'someUser' },
        GET_CASES_BY_STATUS,
      ),
    ).toBeFalsy();
  });

  it('should authorize a petitions clerk for workitems', () => {
    expect(
      isAuthorized(
        { role: 'petitionsclerk', userId: 'petitionsclerk' },
        WORKITEM,
      ),
    ).toBeTruthy();
  });

  it('should authorize a petitions clerk for petition creation', () => {
    expect(
      isAuthorized(
        { role: 'petitionsclerk', userId: 'petitionsclerk' },
        PETITION,
      ),
    ).toBeTruthy();
  });

  it('should authorize a docket clerk for workitems', () => {
    expect(
      isAuthorized({ role: 'docketclerk', userId: 'docketclerk' }, WORKITEM),
    ).toBeTruthy();
  });

  it('should authorize a seniorattorney for workitems', () => {
    expect(
      isAuthorized(
        { role: 'seniorattorney', userId: 'seniorattorney' },
        WORKITEM,
      ),
    ).toBeTruthy();
  });

  it('should authorize a respondent for getCase', () => {
    expect(
      isAuthorized({ role: 'respondent', userId: 'respondent' }, UPDATE_CASE),
    ).toBeTruthy();
  });

  it('should authorize a docketclerk for updatecase', () => {
    expect(
      isAuthorized({ role: 'docketclerk', userId: 'docketclerk' }, UPDATE_CASE),
    ).toBeTruthy();
  });

  it('should evaluate owner when the owner param is provided', () => {
    expect(
      isAuthorized(
        { role: 'docketclerk', userId: '123456' },
        UPDATE_CASE,
        123456,
      ),
    ).toBeTruthy();
  });
});
