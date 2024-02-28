import {
  activateAdminAccount,
  createAdminAccount,
  createDawsonUser,
  deactivateAdminAccount,
  enableUser,
} from '../shared/admin-tools/user/admin';
import { createAndEnableSmoketestUser } from './create-and-enable-smoketest-user';
jest.mock('../shared/admin-tools/user/admin', () => ({
  activateAdminAccount: jest.fn(),
  createAdminAccount: jest.fn(),
  createDawsonUser: jest.fn(),
  deactivateAdminAccount: jest.fn(),
  enableUser: jest.fn(),
}));

describe('createAndEnableSmoketestUser', () => {
  it('should create, activate, and deactivate the admin user', async () => {
    await createAndEnableSmoketestUser();

    expect(createAdminAccount).toHaveBeenCalled();
    expect(activateAdminAccount).toHaveBeenCalled();
    expect(deactivateAdminAccount).toHaveBeenCalled();
  });

  it('should create the smoketest user', async () => {
    await createAndEnableSmoketestUser();

    expect(createDawsonUser).toHaveBeenCalled();
    expect(enableUser).toHaveBeenCalled();
  });

  it('should exit with an error code when anything fails', async () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

    createDawsonUser.mockRejectedValueOnce(new Error('oh no!'));

    await createAndEnableSmoketestUser();
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
