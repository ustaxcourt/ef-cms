import * as userAdmin from '../../shared/admin-tools/user/admin';
import { createAndEnableSmoketestUser } from './create-and-enable-smoketest-user-helpers';

jest.mock('../shared/admin-tools/user/admin');
const activateAdminAccount = jest
  .spyOn(userAdmin, 'activateAdminAccount')
  .mockImplementation();
const createAdminAccount = jest
  .spyOn(userAdmin, 'createAdminAccount')
  .mockImplementation();
const createDawsonUser = jest
  .spyOn(userAdmin, 'createDawsonUser')
  .mockImplementation();
const deactivateAdminAccount = jest
  .spyOn(userAdmin, 'deactivateAdminAccount')
  .mockImplementation();
const enableUser = jest.spyOn(userAdmin, 'enableUser').mockImplementation();

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
    const mockExit = jest.spyOn(process, 'exit').mockImplementation();

    createDawsonUser.mockRejectedValueOnce(new Error('oh no!'));

    await createAndEnableSmoketestUser();
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
