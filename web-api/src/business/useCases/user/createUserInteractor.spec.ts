import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { createOrUpdateUser } from '../../../../../shared/admin-tools/user/admin';
import { createUserInteractor } from '@web-api/business/useCases/user/createUserInteractor';
import { docketClerk1User } from '@shared/test/mockUsers';
import { mockAdminUser, mockPetitionerUser } from '@shared/test/mockAuthUsers';

jest.mock('../../../../../shared/admin-tools/user/admin', () => ({
  createOrUpdateUser: jest.fn(),
}));

describe('createUserInteractor', () => {
  it('should throw an error if a user with create permissions tries to create a user', async () => {
    await expect(
      createUserInteractor(
        applicationContext,
        {
          user: { ...docketClerk1User, password: 'junkPass' },
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
    expect(createOrUpdateUser).not.toHaveBeenCalled();
  });

  it('should create a new user when an admin tries to create a user', async () => {
    await createUserInteractor(
      applicationContext,
      {
        user: { ...docketClerk1User, password: 'junkPass' },
      },
      mockAdminUser,
    );

    expect(createOrUpdateUser).toHaveBeenCalledWith(expect.anything(), {
      password: 'junkPass',
      setPasswordAsPermanent: false,
      user: docketClerk1User,
    });
  });
});
