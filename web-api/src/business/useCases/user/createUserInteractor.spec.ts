import { ROLES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { createOrUpdateUser } from '../../../../../shared/admin-tools/user/admin';
import { createUserInteractor } from '@web-api/business/useCases/user/createUserInteractor';
import { docketClerk1User } from '@shared/test/mockUsers';

jest.mock('../../../../../shared/admin-tools/user/admin', () => ({
  createOrUpdateUser: jest.fn(),
}));

describe('createUserInteractor', () => {
  it('should throw an error if a user with create permissions tries to create a user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.legacyJudge,
      userId: '47cc9719-a392-4cb0-b744-ffb243eff3a3',
    });
    await expect(
      createUserInteractor(applicationContext, {
        user: { ...docketClerk1User, password: 'junkPass' },
      }),
    ).rejects.toThrow('Unauthorized');
    expect(createOrUpdateUser).not.toHaveBeenCalled();
  });

  it('should create a new user when an admin tries to create a user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admin,
      userId: '3aa4b9c3-a66a-486a-bd01-fb370f52f45a',
    });

    await createUserInteractor(applicationContext, {
      user: { ...docketClerk1User, password: 'junkPass' },
    });

    expect(createOrUpdateUser).toHaveBeenCalledWith(expect.anything(), {
      password: 'junkPass',
      user: docketClerk1User,
    });
  });
});
