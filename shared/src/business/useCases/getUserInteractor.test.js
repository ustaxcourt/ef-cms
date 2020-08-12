const { applicationContext } = require('../test/createTestApplicationContext');
const { getUserInteractor } = require('./getUserInteractor');
const { PETITIONS_SECTION, ROLES } = require('../entities/EntityConstants');
const { User } = require('../entities/User');

describe('getUserInteractor', () => {
  it('calls the persistence method to get the user', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Test Petitionsclerk',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      name: 'Test Petitionsclerk',
      role: ROLES.petitionsClerk,
      section: PETITIONS_SECTION,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    const user = await getUserInteractor({
      applicationContext,
    });

    expect(user).toEqual({
      barNumber: undefined,
      email: undefined,
      entityName: 'User',
      name: 'Test Petitionsclerk',
      role: ROLES.petitionsClerk,
      section: PETITIONS_SECTION,
      token: undefined,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });

  it('calls the persistence method to get the user (that is a judge)', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Test Judge',
        role: ROLES.judge,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      name: 'Test Judge',
      role: ROLES.judge,
      section: 'judge',
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    const user = await getUserInteractor({
      applicationContext,
    });

    expect(user).toEqual({
      barNumber: undefined,
      email: undefined,
      entityName: 'User',
      name: 'Test Judge',
      role: ROLES.judge,
      section: 'judge',
      token: undefined,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });
});
