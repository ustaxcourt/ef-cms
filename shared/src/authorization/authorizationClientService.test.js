const expect = require('chai').expect;
const {
  GET_CASES_BY_STATUS,
  GET_CASE,
  WORKITEM,
  isAuthorized,
} = require('./authorizationClientService');
const chai = require('chai');
chai.use(require('chai-string'));

describe('Authorization client service', () => {
  it('should authorize a petitions clerk for getCasesByStatus', () => {
    expect(isAuthorized('petitionsclerk', GET_CASES_BY_STATUS)).to.be.true;
  });

  it('should authorize a user who is owner always', () => {
    expect(isAuthorized('someUser', 'unknown action', 'someUser')).to.be.true;
  });

  it('should authorize a petitionsclerk for getCase', () => {
    expect(isAuthorized('petitionsclerk', GET_CASE)).to.be.true;
  });

  it('should authorize a intakeclerk for getCase', () => {
    expect(isAuthorized('intakeclerk', GET_CASE)).to.be.true;
  });

  it('should return false when a user doesnt have a petitionsclerk role', () => {
    expect(isAuthorized('notapetitionsclerk', GET_CASES_BY_STATUS)).to.be.false;
  });

  it('should authorize a petitions clerk for workitems', () => {
    expect(isAuthorized('petitionsclerk', WORKITEM)).to.be.true;
  });

  it('should authorize a docket clerk for workitems', () => {
    expect(isAuthorized('docketclerk', WORKITEM)).to.be.true;
  });

  it('should authorize a seniorattorney for workitems', () => {
    expect(isAuthorized('seniorattorney', WORKITEM)).to.be.true;
  });
});
