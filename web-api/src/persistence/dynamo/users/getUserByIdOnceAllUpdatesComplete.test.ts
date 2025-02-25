import { UserRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getUserByIdOnceAllUpdatesComplete } from '@web-api/persistence/dynamo/users/getUserByIdOnceAllUpdatesComplete';
import { sleep } from '@shared/tools/helpers';

describe('getUserByIdOnceAllUpdatesComplete', () => {
  const TEST_USER_ID = 'TEST_USER_ID';
  let RESOLVER: Function;

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(
        () => new Promise(resolve => (RESOLVER = resolve)),
      );
  });

  it('should wait until the user is done updating to return the user record', async () => {
    let COMPLETE_FLAG = false;

    void getUserByIdOnceAllUpdatesComplete({
      applicationContext,
      userId: TEST_USER_ID,
    }).then(userInfo => {
      expect(userInfo).toEqual({ isUpdatingInformation: false });
      COMPLETE_FLAG = true;
    });

    let getUserByIdCalls =
      applicationContext.getPersistenceGateway().getUserById.mock.calls;
    expect(getUserByIdCalls.length).toEqual(1);
    RESOLVER({ isUpdatingInformation: true } as UserRecord);
    await sleep(50);
    expect(COMPLETE_FLAG).toEqual(false);

    getUserByIdCalls =
      applicationContext.getPersistenceGateway().getUserById.mock.calls;
    expect(getUserByIdCalls.length).toEqual(2);
    RESOLVER({ isUpdatingInformation: true } as UserRecord);
    await sleep(50);
    expect(COMPLETE_FLAG).toEqual(false);

    getUserByIdCalls =
      applicationContext.getPersistenceGateway().getUserById.mock.calls;
    expect(getUserByIdCalls.length).toEqual(3);
    RESOLVER({ isUpdatingInformation: false } as UserRecord);
    await sleep(50);
    expect(COMPLETE_FLAG).toEqual(true);
  });
});
