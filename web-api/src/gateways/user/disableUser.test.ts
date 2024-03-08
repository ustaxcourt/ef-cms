import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { disableUser } from '@web-api/gateways/user/disableUser';

describe('disableUser', () => {
  it('should make a call to disable the provided userId', async () => {
    const mockUserId = 'afde08bd-7ccc-4163-9242-87f78cbb2452';
    const mockUserPoolId = 'test';
    process.env.USER_POOL_ID = mockUserPoolId;

    await disableUser(applicationContext, {
      userId: mockUserId,
    });

    expect(
      applicationContext.getCognito().adminDisableUser,
    ).toHaveBeenCalledWith({
      UserPoolId: mockUserPoolId,
      Username: mockUserId,
    });
  });
});
