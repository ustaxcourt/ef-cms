const { getUserByIdInteractor } = require('./getUserByIdInteractor');
const { User } = require('../entities/User');

describe('getUserByIdInteractor', () => {
  let applicationContext;
  let mockRequestUser;
  let mockRetrievedUser;

  beforeEach(() => {
    mockRequestUser = new User({
      name: 'Test Petitions clerk',
      role: User.ROLES.petitionsClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    mockRetrievedUser = {
      name: 'Test Practitioner',
      role: User.ROLES.privatePractitioner,
      section: 'privatePractitioner',
      userId: '4f67802c-1948-4749-b070-38f7316b15c5',
    };

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => mockRequestUser,
      getPersistenceGateway: () => ({
        getUserById: () => mockRetrievedUser,
      }),
    };
  });

  it('throws an error if the user is not authorized to manage attorney users', async () => {
    mockRequestUser = new User({
      name: 'Test Petitioner',
      role: User.ROLES.petitioner,
      userId: 'e93ce149-b42b-4764-802f-5d321ba36950',
    });

    await expect(
      getUserByIdInteractor({
        applicationContext,
        userId: '4f67802c-1948-4749-b070-38f7316b15c5',
      }),
    ).rejects.toThrow('Unauthorized for getting attorney user');
  });

  it('throws an error if the user retrieved is not a privatePractitioner or irsPractitioner user', async () => {
    mockRetrievedUser = new User({
      name: 'Test Petitioner',
      role: User.ROLES.petitioner,
      userId: 'e93ce149-b42b-4764-802f-5d321ba36950',
    });

    await expect(
      getUserByIdInteractor({
        applicationContext,
        userId: '4f67802c-1948-4749-b070-38f7316b15c5',
      }),
    ).rejects.toThrow('Unauthorized to retrieve users other than attorneys');
  });

  it('calls the persistence method to get the user', async () => {
    const user = await getUserByIdInteractor({
      applicationContext,
      userId: '4f67802c-1948-4749-b070-38f7316b15c5',
    });

    expect(user).toEqual({
      name: 'Test Practitioner',
      role: User.ROLES.privatePractitioner,
      section: 'privatePractitioner',
      userId: '4f67802c-1948-4749-b070-38f7316b15c5',
    });
  });
});
