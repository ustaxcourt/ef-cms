import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { startPollingForResultsInteractor } from '@web-api/business/useCases/polling/startPollingForResultsInteractor';

describe('startPollingForResultsInteractor', () => {
  const TEST_REQUEST_ID = 'TEST_REQUEST_ID';
  const TEST_RESPONSE = 'TEST_RESPONSE';
  const MOCKED_RESULTS = [
    {
      chunk: TEST_RESPONSE,
      index: 0,
      pk: 'test_pk',
      sk: 'test_sk',
      totalNumberOfChunks: 1,
    },
  ];
  const TEST_USER_ID = mockDocketClerkUser.userId;

  beforeEach(() => {
    applicationContext.getPersistenceGateway().getRequestResults = jest
      .fn()
      .mockResolvedValue(MOCKED_RESULTS);
  });

  it('should load poll response', async () => {
    const results = await startPollingForResultsInteractor(
      applicationContext,
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

    expect(results).toEqual({
      response: TEST_RESPONSE,
    });
  });

  it('should returned undefined if there are no records in the database', async () => {
    applicationContext.getPersistenceGateway().getRequestResults = jest
      .fn()
      .mockResolvedValue([]);

    const results = await startPollingForResultsInteractor(
      applicationContext,
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
        applicationContext,
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
          pk: 'test_pk',
          sk: 'test_sk',
          totalNumberOfChunks: 3,
        },
      ]);

    const results = await startPollingForResultsInteractor(
      applicationContext,
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
