const expect = require('chai').expect;
const {
  GET_CASES_BY_STATUS,
  GET_CASE,
  UPDATE_CASE,
  WORKITEM,
  isAuthorized,
} = require('./authorizationClientService');
const chai = require('chai');
chai.use(require('chai-string'));

describe('Authorization client service', () => {
  it('should authorize a petitions clerk for getCasesByStatus', () => {
    expect(
      isAuthorized(
        { role: 'petitionsclerk', userId: 'petitionsclerk' },
        GET_CASES_BY_STATUS,
      ),
    ).to.be.true;
  });

  it('returns true for any user whose userId matches the 3rd owner argument, in this case "someUser" === "someUser"', () => {
    expect(
      isAuthorized(
        { role: 'petitioner', userId: 'someUser' },
        'unknown action',
        'someUser',
      ),
    ).to.be.true;
  });

  it('should authorize a petitionsclerk for getCase', () => {
    expect(
      isAuthorized(
        { role: 'petitionsclerk', userId: 'petitionsclerk' },
        GET_CASE,
      ),
    ).to.be.true;
  });

  it('should authorize a intakeclerk for getCase', () => {
    expect(
      isAuthorized({ role: 'intakeclerk', userId: 'intakeclerk' }, GET_CASE),
    ).to.be.true;
  });

  it('should return false when a user doesnt have a petitionsclerk role', () => {
    expect(
      isAuthorized(
        { role: 'petitioner', userId: 'someUser' },
        GET_CASES_BY_STATUS,
      ),
    ).to.be.false;
  });

  it('should authorize a petitions clerk for workitems', () => {
    expect(
      isAuthorized(
        { role: 'petitionsclerk', userId: 'petitionsclerk' },
        WORKITEM,
      ),
    ).to.be.true;
  });

  it('should authorize a docket clerk for workitems', () => {
    expect(
      isAuthorized({ role: 'docketclerk', userId: 'docketclerk' }, WORKITEM),
    ).to.be.true;
  });

  it('should authorize a seniorattorney for workitems', () => {
    expect(
      isAuthorized(
        { role: 'seniorattorney', userId: 'seniorattorney' },
        WORKITEM,
      ),
    ).to.be.true;
  });

  it('should authorize a respondent for getCase', () => {
    expect(
      isAuthorized({ role: 'respondent', userId: 'respondent' }, UPDATE_CASE),
    ).to.be.true;
  });

  it('should authorize a docketclerk for updatecase', () => {
    expect(
      isAuthorized({ role: 'docketclerk', userId: 'docketclerk' }, UPDATE_CASE),
    ).to.be.true;
  });
});
