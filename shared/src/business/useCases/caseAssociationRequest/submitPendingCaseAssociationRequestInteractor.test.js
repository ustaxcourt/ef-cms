const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  submitPendingCaseAssociationRequestInteractor,
} = require('./submitPendingCaseAssociationRequestInteractor');
const { User } = require('../../entities/User');

describe('submitPendingCaseAssociationRequest', () => {
  let caseRecord = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    docketNumber: '123-19',
  };

  it('should throw an error when not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Olivia Jade',
      role: User.ROLES.adc,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await expect(
      submitPendingCaseAssociationRequestInteractor({
        applicationContext,
        caseId: caseRecord.caseId,
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should not add mapping if already associated', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Olivia Jade',
      role: User.ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      name: 'Olivia Jade',
      role: User.ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(true);

    await submitPendingCaseAssociationRequestInteractor({
      applicationContext,
      caseId: caseRecord.caseId,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCasePending,
    ).not.toBeCalled();
  });

  it('should not add mapping if these is already a pending association', async () => {
    await submitPendingCaseAssociationRequestInteractor({
      applicationContext,
      caseId: caseRecord.caseId,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCasePending,
    ).not.toBeCalled();
  });

  it('should add mapping', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);
    applicationContext
      .getPersistenceGateway()
      .verifyPendingCaseForUser.mockReturnValue(false);

    await submitPendingCaseAssociationRequestInteractor({
      applicationContext,
      caseId: caseRecord.caseId,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCasePending,
    ).toBeCalled();
  });
});
