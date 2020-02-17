const sinon = require('sinon');
const {
  submitPendingCaseAssociationRequestInteractor,
} = require('./submitPendingCaseAssociationRequestInteractor');
const { User } = require('../../entities/User');

describe('submitPendingCaseAssociationRequest', () => {
  let applicationContext;

  let caseRecord = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    docketNumber: '123-19',
  };

  it('should throw an error when not authorized', async () => {
    let error;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            name: 'Olivia Jade',
            role: User.ROLES.adc,
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          };
        },

        getPersistenceGateway: () => ({
          verifyCaseForUser: async () => true,
          verifyPendingCaseForUser: async () => false,
        }),
      };
      await submitPendingCaseAssociationRequestInteractor({
        applicationContext,
        caseId: caseRecord.caseId,
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('should not add mapping if already associated', async () => {
    let associateUserWithCasePendingSpy = sinon.spy();
    let verifyCaseForUserSpy = sinon.stub().returns(true);
    let verifyPendingCaseForUserSpy = sinon.stub().returns(false);

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          name: 'Olivia Jade',
          role: User.ROLES.practitioner,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        };
      },
      getPersistenceGateway: () => ({
        associateUserWithCasePending: associateUserWithCasePendingSpy,
        getUserById: () => ({
          name: 'Olivia Jade',
          role: User.ROLES.practitioner,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
        verifyCaseForUser: verifyCaseForUserSpy,
        verifyPendingCaseForUser: verifyPendingCaseForUserSpy,
      }),
    };

    await submitPendingCaseAssociationRequestInteractor({
      applicationContext,
      caseId: caseRecord.caseId,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(associateUserWithCasePendingSpy.called).toEqual(false);
  });

  it('should not add mapping if these is already a pending association', async () => {
    let associateUserWithCasePendingSpy = sinon.spy();
    let verifyCaseForUserSpy = sinon.stub().returns(false);
    let verifyPendingCaseForUserSpy = sinon.stub().returns(true);

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          name: 'Olivia Jade',
          role: User.ROLES.practitioner,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        };
      },
      getPersistenceGateway: () => ({
        associateUserWithCasePending: associateUserWithCasePendingSpy,
        getUserById: () => ({
          name: 'Olivia Jade',
          role: User.ROLES.practitioner,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
        verifyCaseForUser: verifyCaseForUserSpy,

        verifyPendingCaseForUser: verifyPendingCaseForUserSpy,
      }),
    };

    await submitPendingCaseAssociationRequestInteractor({
      applicationContext,
      caseId: caseRecord.caseId,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(associateUserWithCasePendingSpy.called).toEqual(false);
  });

  it('should add mapping', async () => {
    let associateUserWithCasePendingSpy = sinon.spy();
    let verifyCaseForUserSpy = sinon.stub().returns(false);
    let verifyPendingCaseForUserSpy = sinon.stub().returns(false);

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          name: 'Olivia Jade',
          role: User.ROLES.practitioner,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        };
      },
      getPersistenceGateway: () => ({
        associateUserWithCasePending: associateUserWithCasePendingSpy,
        getUserById: () => ({
          name: 'Olivia Jade',
          role: User.ROLES.practitioner,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
        verifyCaseForUser: verifyCaseForUserSpy,
        verifyPendingCaseForUser: verifyPendingCaseForUserSpy,
      }),
    };

    await submitPendingCaseAssociationRequestInteractor({
      applicationContext,
      caseId: caseRecord.caseId,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(associateUserWithCasePendingSpy.called).toEqual(true);
  });
});
