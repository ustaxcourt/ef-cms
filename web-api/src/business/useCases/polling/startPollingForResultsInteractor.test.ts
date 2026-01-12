import '@web-api/persistence/postgres/polling/mocks.jest';
import { UnauthorizedError } from '@web-api/errors/errors';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { startPollingForResultsInteractor } from '@web-api/business/useCases/polling/startPollingForResultsInteractor';
import { getRequestResults as getRequestResultsMock } from '@web-api/persistence/postgres/polling/getRequestResults';

const getRequestResults = getRequestResultsMock as jest.Mock;

describe('startPollingForResultsInteractor', () => {
  const TEST_REQUEST_ID = 'TEST_REQUEST_ID';
  const TEST_USER_ID = mockDocketClerkUser.userId;
  const TEST_RESPONSE_CHUNK = '{"message":"This is a test response"}';
  const MOCKED_RESULTS = {
    responseString: TEST_RESPONSE_CHUNK,
    requestId: TEST_REQUEST_ID,
    userId: TEST_USER_ID,
  };
  beforeEach(() => {
    getRequestResults.mockResolvedValue(MOCKED_RESULTS);
  });

  it('should load poll response', async () => {
    const results = await startPollingForResultsInteractor(
      {
        requestId: TEST_REQUEST_ID,
      },
      mockDocketClerkUser,
    );
    const getRequestResultsCalls = getRequestResults.mock.calls;

    expect(getRequestResultsCalls.length).toEqual(1);
    expect(getRequestResultsCalls[0][0].requestId).toEqual(TEST_REQUEST_ID);
    expect(getRequestResultsCalls[0][0].userId).toEqual(TEST_USER_ID);

    expect(results).toEqual({
      response: TEST_RESPONSE_CHUNK,
    });
  });

  it('should returned undefined if there are no records in the database', async () => {
    getRequestResults.mockResolvedValue(undefined);

    const results = await startPollingForResultsInteractor(
      {
        requestId: TEST_REQUEST_ID,
      },
      mockDocketClerkUser,
    );

    const getRequestResultsCalls = getRequestResults.mock.calls;

    expect(getRequestResultsCalls.length).toEqual(1);
    expect(getRequestResultsCalls[0][0].requestId).toEqual(TEST_REQUEST_ID);
    expect(getRequestResultsCalls[0][0].userId).toEqual(TEST_USER_ID);

    expect(results).toEqual(undefined);
  });

  it('should throw an error when the user is not an auth user', async () => {
    getRequestResults.mockResolvedValue(undefined);

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
});
