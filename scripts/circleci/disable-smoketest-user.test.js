import { disableSmoketestUser } from './disable-smoketest-user';
import { disableUser } from '../../shared/admin-tools/user/admin';
jest.mock('../../shared/admin-tools/user/admin', () => ({
  disableUser: jest.fn(),
}));

describe('disableSmoketestUser', () => {
  it('should invoke disableUser from the admin library', async () => {
    await disableSmoketestUser();
    expect(disableUser).toHaveBeenCalled();
  });

  it('should exit with an error code when anything fails', async () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

    disableUser.mockRejectedValueOnce(new Error('oh no!'));

    await disableSmoketestUser();
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
