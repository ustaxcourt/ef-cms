import {
  getConnection,
  getConnectionsByUserId,
  loginAs,
  setupTest,
  wait,
} from './helpers';
const cerebralTest = setupTest();

describe('websocket connections are cleaned up when disconnecting', () => {
  beforeAll(() => {
    jest.setTimeout(50000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk1@example.com');

  it('should clean up the connection records in dynamo when the user disconnect', async () => {
    const petitionsClerk1UserId = '4805d1ab-18d0-43ec-bafb-654e83405416';
    const connectionsBeforeSignOut = await getConnectionsByUserId(
      petitionsClerk1UserId,
    );
    expect(connectionsBeforeSignOut.length).toEqual(1);
    await cerebralTest.runSequence('signOutSequence');
    await wait(2000);
    const connectionsAfterSignOut = await getConnectionsByUserId(
      petitionsClerk1UserId,
    );
    expect(connectionsAfterSignOut).toEqual([]);
    const connection = connectionsBeforeSignOut[0];
    const connectionInDynamo = await getConnection(connection.connectionId);
    expect(connectionInDynamo).toBeUndefined();
  });
});
