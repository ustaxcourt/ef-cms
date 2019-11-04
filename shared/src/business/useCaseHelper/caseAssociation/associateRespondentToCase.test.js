const sinon = require('sinon');
const { associateRespondentToCase } = require('./associateRespondentToCase');
const { User } = require('../../entities/User');

describe('associateRespondentToCase', () => {
  let applicationContext;

  let caseRecord = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    docketNumber: '123-19',
  };

  it('should not add mapping if already there', async () => {
    let associateUserWithCaseSpy = sinon.spy();
    let verifyCaseForUserSpy = sinon.stub().returns(true);
    let updateCaseSpy = sinon.spy();

    const user = {
      name: 'Olivia Jade',
      role: User.ROLES.respondent,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    applicationContext = {
      getPersistenceGateway: () => ({
        associateUserWithCase: associateUserWithCaseSpy,
        getCaseByCaseId: async () => caseRecord,
        updateCase: updateCaseSpy,
        verifyCaseForUser: verifyCaseForUserSpy,
      }),
    };

    await associateRespondentToCase({
      applicationContext,
      caseId: caseRecord.caseId,
      user,
    });

    expect(associateUserWithCaseSpy.called).toEqual(false);
    expect(updateCaseSpy.called).toEqual(false);
  });

  it('should add mapping for a respondent', async () => {
    let associateUserWithCaseSpy = sinon.spy();
    let verifyCaseForUserSpy = sinon.stub().returns(false);
    let updateCaseSpy = sinon.spy();

    const user = {
      name: 'Olivia Jade',
      role: User.ROLES.respondent,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    applicationContext = {
      getPersistenceGateway: () => ({
        associateUserWithCase: associateUserWithCaseSpy,
        getCaseByCaseId: async () => caseRecord,
        updateCase: updateCaseSpy,
        verifyCaseForUser: verifyCaseForUserSpy,
      }),
    };

    await associateRespondentToCase({
      applicationContext,
      caseId: caseRecord.caseId,
      user,
    });

    expect(associateUserWithCaseSpy.called).toEqual(true);
    expect(updateCaseSpy.called).toEqual(true);
  });
});
