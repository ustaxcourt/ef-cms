import {
  getConnection,
  getConnectionsByUserId,
  loginAs,
  setupTest,
  wait,
} from './helpers';
const cerebralTest = setupTest();

describe('websocket connections are cleaned up when disconnecting', () => {
  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk1@example.com');

  it('should clean up the connection records when the user disconnect', async () => {
    const petitionsClerk1UserId = '4805d1ab-18d0-43ec-bafb-654e83405416';
    const connectionsBeforeSignOut = await getConnectionsByUserId(
      petitionsClerk1UserId,
    );
    expect(connectionsBeforeSignOut.length).toEqual(1);
    await cerebralTest.runSequence('signOutSequence');

    const connection = connectionsBeforeSignOut[0];

    // Poll for the websocket cleanup to complete
    const maxWaitMs = 30000;
    const refreshIntervalMs = 250;
    let waited = 0;
    let connectionsAfterSignOut = await getConnectionsByUserId(
      petitionsClerk1UserId,
    );
    let connectionInPostgres = await getConnection(connection.connectionId);
    while (
      (connectionsAfterSignOut.length !== 0 ||
        connectionInPostgres.length !== 0) &&
      waited < maxWaitMs
    ) {
      await wait(refreshIntervalMs);
      waited += refreshIntervalMs;
      connectionsAfterSignOut = await getConnectionsByUserId(
        petitionsClerk1UserId,
      );
      connectionInPostgres = await getConnection(connection.connectionId);
    }

    expect(connectionsAfterSignOut).toEqual([]);
    expect(connectionInPostgres.length).toEqual(0);
  });
});
