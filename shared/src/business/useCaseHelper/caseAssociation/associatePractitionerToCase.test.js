const sinon = require('sinon');
const {
  associatePractitionerToCase,
} = require('./associatePractitionerToCase');
const { User } = require('../../entities/User');

describe('associatePractitionerToCase', () => {
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
      role: User.ROLES.practitioner,
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

    await associatePractitionerToCase({
      applicationContext,
      caseId: caseRecord.caseId,
      representingPrimary: true,
      representingSecondary: false,
      user,
    });

    expect(associateUserWithCaseSpy.called).toEqual(false);
    expect(updateCaseSpy.called).toEqual(false);
  });

  it('should add mapping for a practitioner', async () => {
    let associateUserWithCaseSpy = sinon.spy();
    let verifyCaseForUserSpy = sinon.stub().returns(false);
    let updateCaseSpy = sinon.spy();

    const user = {
      name: 'Olivia Jade',
      role: User.ROLES.practitioner,
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

    await associatePractitionerToCase({
      applicationContext,
      caseId: caseRecord.caseId,
      representingPrimary: true,
      representingSecondary: false,
      user,
    });

    expect(associateUserWithCaseSpy.called).toEqual(true);
    expect(updateCaseSpy.called).toEqual(true);
  });
});
