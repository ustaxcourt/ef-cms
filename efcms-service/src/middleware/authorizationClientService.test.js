const expect = require('chai').expect;
const { GET_CASES_BY_STATUS, isAuthorized } = require('./authorizationClientService');
const chai = require('chai');
chai.use(require('chai-string'));

describe('Authorization client service', () => {

  it('should authorize a petitions clerk for getCasesByStatus', () => {
    expect(isAuthorized('petitionsclerk', GET_CASES_BY_STATUS)).to.be.true;
  });

  it('should set the message', () => {
    expect(isAuthorized('notapetitionsclerk', GET_CASES_BY_STATUS)).to.be.false;
  });
});