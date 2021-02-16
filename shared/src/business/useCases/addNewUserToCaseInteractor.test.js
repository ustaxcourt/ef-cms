const { addNewUserToCaseInteractor } = require('./addNewUserToCaseInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { ROLES } = require('../entities/EntityConstants');

describe('addNewUserToCaseInteractor', () => {
  it('throws an unauthorized error on non adminssionsclerk users', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      addNewUserToCaseInteractor({
        applicationContext,
        docketNumber: '101-20',
        email: 'testing@example.com',
        name: 'Bob Ross',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('throws an error if the email provided already exists', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admissionsClerk,
    });

    applicationContext.getPersistenceGateway().getUserByEmail.mockReturnValue({
      name: 'Bob Ross',
    });

    await expect(
      addNewUserToCaseInteractor({
        applicationContext,
        docketNumber: '101-20',
        email: 'testing@example.com',
        name: 'Bob Ross',
      }),
    ).rejects.toThrow('A user was already found with that provided email of');
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
      addNewUserToCaseInteractor({
        applicationContext,
        docketNumber: '101-20',
        email: 'testing@example.com',
        name: 'Bob Ross',
      }),
    ).rejects.toThrow(
      'no contact primary or secondary found with that user name of',
    );
  });
});
