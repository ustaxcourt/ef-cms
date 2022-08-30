import { ROLES } from '../entities/EntityConstants';
import { User } from '../entities/User';
import { applicationContext } from '../test/createTestApplicationContext';
import { getUserByIdInteractor } from './getUserByIdInteractor';

const MOCK_REQUEST_USER = new User({
  name: 'Test Petitions clerk',
  role: ROLES.petitionsClerk,
  userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
});

const MOCK_RETRIEVED_USER = {
  name: 'Test Practitioner',
  role: ROLES.privatePractitioner,
  section: 'privatePractitioner',
  userId: '4f67802c-1948-4749-b070-38f7316b15c5',
};

describe('getUserByIdInteractor', () => {
  it('throws an error if the user is not authorized to manage practitioner users', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Test Petitioner',
        role: ROLES.petitioner,
        userId: 'e93ce149-b42b-4764-802f-5d321ba36950',
      }),
    );

    await expect(
      getUserByIdInteractor(applicationContext, {
        userId: '4f67802c-1948-4749-b070-38f7316b15c5',
      }),
    ).rejects.toThrow('Unauthorized for getting practitioner user');
  });

  it('throws an error if the user retrieved is not a privatePractitioner or irsPractitioner user', async () => {
    applicationContext.getCurrentUser.mockReturnValue(MOCK_REQUEST_USER);
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue(
      new User({
        name: 'Test Petitioner',
        role: ROLES.petitioner,
        userId: 'e93ce149-b42b-4764-802f-5d321ba36950',
      }),
    );

    await expect(
      getUserByIdInteractor(applicationContext, {
        userId: '4f67802c-1948-4749-b070-38f7316b15c5',
      }),
    ).rejects.toThrow(
      'Unauthorized to retrieve users other than practitioners',
    );
  });

  it('calls the persistence method to get the user', async () => {
    applicationContext.getCurrentUser.mockReturnValue(MOCK_REQUEST_USER);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(MOCK_RETRIEVED_USER);

    const user = await getUserByIdInteractor(applicationContext, {
      userId: '4f67802c-1948-4749-b070-38f7316b15c5',
    });

    expect(user).toEqual({
      barNumber: undefined,
      email: undefined,
      entityName: 'User',
      name: 'Test Practitioner',
      role: ROLES.privatePractitioner,
      section: 'privatePractitioner',
      token: undefined,
      userId: '4f67802c-1948-4749-b070-38f7316b15c5',
    });
  });
});
