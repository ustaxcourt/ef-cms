const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  deleteCounselFromCaseInteractor,
} = require('./deleteCounselFromCaseInteractor');
const { MOCK_CASE } = require('../../../test/mockCase.js');
const { User } = require('../../entities/User');

describe('deleteCounselFromCaseInteractor', () => {
  const mockPrivatePractitioners = [
    { role: User.ROLES.privatePractitioner, userId: '456' },
    { role: User.ROLES.privatePractitioner, userId: '789' },
    { role: User.ROLES.privatePractitioner, userId: '012' },
  ];

  const mockIrsPractitioners = [
    { role: User.ROLES.irsPractitioner, userId: '654' },
    { role: User.ROLES.irsPractitioner, userId: '987' },
    { role: User.ROLES.irsPractitioner, userId: '210' },
  ];

  const mockPetitioners = [{ role: User.ROLES.petitioner, userId: '111' }];

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.docketClerk,
      userId: '001',
    });

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(({ userId }) => {
        return mockPrivatePractitioners
          .concat(mockIrsPractitioners)
          .concat(mockPetitioners)
          .find(user => user.userId === userId);
      });

    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockImplementation(({ caseId }) => ({
        ...MOCK_CASE,
        caseId,
        irsPractitioners: mockIrsPractitioners,
        privatePractitioners: mockPrivatePractitioners,
      }));
  });

  it('returns an unauthorized error for a petitioner user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitioner,
    });

    await expect(
      deleteCounselFromCaseInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userIdToDelete: '789',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('deletes a practitioner with the given userId from the associated case', async () => {
    await deleteCounselFromCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      userIdToDelete: '789',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().deleteUserFromCase,
    ).toHaveBeenCalled();
  });

  it('deletes an irsPractitioner with the given userId from the associated case', async () => {
    await deleteCounselFromCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      userIdToDelete: '987',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().deleteUserFromCase,
    ).toHaveBeenCalled();
  });

  it('throws an error if the userIdToDelete is not a privatePractitioner or irsPractitioner role', async () => {
    await expect(
      deleteCounselFromCaseInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userIdToDelete: '111',
      }),
    ).rejects.toThrow('User is not a practitioner');
  });
});
