const {
  addExistingUserToCaseInteractor,
} = require('./addExistingUserToCaseInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { ROLES } = require('../entities/EntityConstants');

describe('addExistingUserToCaseInteractor', () => {
  it('throws an unauthorized error on non adminssionsclerk users', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      addExistingUserToCaseInteractor({
        applicationContext,
        docketNumber: '101-20',
        email: 'testing@example.com',
        name: 'Bob Ross',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('throws an error if no user exists with that email', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admissionsClerk,
    });

    applicationContext
      .getPersistenceGateway()
      .getUserByEmail.mockReturnValue(null);

    await expect(
      addExistingUserToCaseInteractor({
        applicationContext,
        docketNumber: '101-20',
        email: 'testing@example.com',
        name: 'Bob Ross',
      }),
    ).rejects.toThrow('no user found with the provided email of ');
  });

  it('throws an error if contact not found with name provided', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admissionsClerk,
    });

    applicationContext
      .getPersistenceGateway()
      .getUserByEmail.mockReturnValue(null);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        contactPrimary: {},
        contactSecondary: {},
      });

    await expect(
      addExistingUserToCaseInteractor({
        applicationContext,
        docketNumber: '101-20',
        email: 'testing@example.com',
        name: 'Bob Ross',
      }),
    ).rejects.toThrow('no user found with the provided email of ');
  });
});
