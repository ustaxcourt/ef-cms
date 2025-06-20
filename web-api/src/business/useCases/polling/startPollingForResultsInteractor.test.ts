import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { startPollingForResultsInteractor } from '@web-api/business/useCases/polling/startPollingForResultsInteractor';
describe('startPollingForResultsInteractor', () => {
  const TEST_REQUEST_ID = 'TEST_REQUEST_ID';
  const TEST_RESPONSE = 'TEST_RESPONSE';
  const TEST_USER_ID = mockDocketClerkUser.userId;
  const TEST_RESPONSE_CHUNK = '{"message":"This is a test response"}';
  const MOCKED_RESULTS = [
    {
      stringResponse: TEST_RESPONSE_CHUNK,
      requestId: '18e0fb82-b908-49b5-810c-c26623fba8a8',
      userId: TEST_USER_ID,
    },
  ];

  beforeEach(() => {
    applicationContext.getPersistenceGateway().getRequestResults = jest
      .fn()
      .mockResolvedValue(MOCKED_RESULTS);
  });

  it('should load poll response', async () => {
    const results = await startPollingForResultsInteractor(
      {
        requestId: TEST_REQUEST_ID,
      },
      mockDocketClerkUser,
    );
    console.log('Results from startPollingForResultsInteractor in test:', results);

    const getRequestResultsCalls =
      applicationContext.getPersistenceGateway().getRequestResults.mock.calls;

    expect(getRequestResultsCalls.length).toEqual(1);
    expect(getRequestResultsCalls[0][0].requestId).toEqual(TEST_REQUEST_ID);
    expect(getRequestResultsCalls[0][0].userId).toEqual(TEST_USER_ID);

    expect(results).toEqual({
      response: TEST_RESPONSE_CHUNK,
    });
  });

  it('should returned undefined if there are no records in the database', async () => {
    applicationContext.getPersistenceGateway().getRequestResults = jest
      .fn()
      .mockResolvedValue([]);

    const results = await startPollingForResultsInteractor(
      {
        requestId: TEST_REQUEST_ID,
      },
      mockDocketClerkUser,
    );

    const getRequestResultsCalls =
      applicationContext.getPersistenceGateway().getRequestResults.mock.calls;

    expect(getRequestResultsCalls.length).toEqual(1);
    expect(getRequestResultsCalls[0][0].requestId).toEqual(TEST_REQUEST_ID);
    expect(getRequestResultsCalls[0][0].userId).toEqual(TEST_USER_ID);

    expect(results).toEqual(undefined);
  });

  it('should throw an error when the user is not an auth user', async () => {
    applicationContext.getPersistenceGateway().getRequestResults = jest
      .fn()
      .mockResolvedValue([]);

    await expect(
      startPollingForResultsInteractor(
        {
          requestId: TEST_REQUEST_ID,
        },
        undefined,
      ),
    ).rejects.toThrow(
      new UnauthorizedError(
        'User attempting to poll for results is not an auth user',
      ),
    );
  });

  it('should returned undefined if all the records are not yet saved in the database', async () => {
    applicationContext.getPersistenceGateway().getRequestResults = jest
      .fn()
      .mockResolvedValue([
        {
          chunk: TEST_RESPONSE,
          index: 0,
          requestId: TEST_REQUEST_ID,
          totalNumberOfChunks: 3,
        },
      ]);

    const results = await startPollingForResultsInteractor(
      {
        requestId: TEST_REQUEST_ID,
      },
      mockDocketClerkUser,
    );

    const getRequestResultsCalls =
      applicationContext.getPersistenceGateway().getRequestResults.mock.calls;

    expect(getRequestResultsCalls.length).toEqual(1);
    expect(getRequestResultsCalls[0][0].requestId).toEqual(TEST_REQUEST_ID);
    expect(getRequestResultsCalls[0][0].userId).toEqual(TEST_USER_ID);

    expect(results).toEqual(undefined);
  });
});
