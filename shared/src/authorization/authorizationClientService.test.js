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
        { userId: 'petitionsclerk', role: 'petitionsclerk' },
        GET_CASES_BY_STATUS,
      ),
    ).to.be.true;
  });

  it('should authorize a user who is owner always', () => {
    expect(
      isAuthorized(
        { userId: 'someUser', role: 'petitioner' },
        'unknown action',
        'someUser',
      ),
    ).to.be.true;
  });

  it('should authorize a petitionsclerk for getCase', () => {
    expect(
      isAuthorized(
        { userId: 'petitionsclerk', role: 'petitionsclerk' },
        GET_CASE,
      ),
    ).to.be.true;
  });

  it('should authorize a intakeclerk for getCase', () => {
    expect(
      isAuthorized({ userId: 'intakeclerk', role: 'intakeclerk' }, GET_CASE),
    ).to.be.true;
  });

  it('should return false when a user doesnt have a petitionsclerk role', () => {
    expect(
      isAuthorized(
        { userId: 'intakeclerk', role: 'petitioner' },
        GET_CASES_BY_STATUS,
      ),
    ).to.be.false;
  });

  it('should authorize a petitions clerk for workitems', () => {
    expect(
      isAuthorized(
        { userId: 'petitionsclerk', role: 'petitionsclerk' },
        WORKITEM,
      ),
    ).to.be.true;
  });

  it('should authorize a docket clerk for workitems', () => {
    expect(
      isAuthorized({ userId: 'docketclerk', role: 'docketclerk' }, WORKITEM),
    ).to.be.true;
  });

  it('should authorize a seniorattorney for workitems', () => {
    expect(
      isAuthorized(
        { userId: 'seniorattorney', role: 'seniorattorney' },
        WORKITEM,
      ),
    ).to.be.true;
  });

  it('should authorize a respondent for getCase', () => {
    expect(
      isAuthorized({ userId: 'respondent', role: 'respondent' }, UPDATE_CASE),
    ).to.be.true;
  });

  it('should authorize a docketclerk for updatecase', () => {
    expect(
      isAuthorized({ userId: 'docketclerk', role: 'docketclerk' }, UPDATE_CASE),
    ).to.be.true;
  });
});
