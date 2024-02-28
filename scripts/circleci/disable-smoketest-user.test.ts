import * as userAdmin from '../../shared/admin-tools/user/admin';
import { disableSmoketestUser } from './disable-smoketest-user';

jest.mock('../../shared/admin-tools/user/admin');
const disableUser = jest.spyOn(userAdmin, 'disableUser').mockImplementation();

describe('disableSmoketestUser', () => {
  it('should invoke disableUser from the admin library', async () => {
    await disableSmoketestUser();
    expect(disableUser).toHaveBeenCalled();
  });

  it('should exit with an error code when anything fails', async () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation();

    disableUser.mockRejectedValueOnce(new Error('oh no!'));

    await disableSmoketestUser();
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
