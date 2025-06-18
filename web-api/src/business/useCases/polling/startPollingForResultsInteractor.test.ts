import '@web-api/persistence/postgres/polling/mocks.jest';
import { UnauthorizedError } from '@web-api/errors/errors';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { startPollingForResultsInteractor } from '@web-api/business/useCases/polling/startPollingForResultsInteractor';
import { getRequestResults as getRequestResultsMock } from '@web-api/persistence/postgres/polling/getRequestResults';

const getRequestResults = getRequestResultsMock as jest.Mock;

describe('startPollingForResultsInteractor', () => {
  const TEST_REQUEST_ID = 'TEST_REQUEST_ID';
  const TEST_USER_ID = mockDocketClerkUser.userId;
  const TEST_RESPONSE_STRING = '{"message":"This is a test response"}';
  const MOCKED_RESULT = {
    stringResponse: TEST_RESPONSE_STRING,
    requestId: '18e0fb82-b908-49b5-810c-c26623fba8a8',
    userId: TEST_USER_ID,
  };

  beforeEach(() => {
    getRequestResults.mockResolvedValue(MOCKED_RESULT);
  });

  it('should load poll response', async () => {
    const result = await startPollingForResultsInteractor(
      {
        requestId: TEST_REQUEST_ID,
      },
      mockDocketClerkUser,
    );
    console.log(
      'Result from startPollingForResultsInteractor in test:',
      result,
    );

    const getRequestResultsCalls = getRequestResults.mock.calls;

    expect(getRequestResultsCalls.length).toEqual(1);
    expect(getRequestResultsCalls[0][0].requestId).toEqual(TEST_REQUEST_ID);
    expect(getRequestResultsCalls[0][0].userId).toEqual(TEST_USER_ID);

    expect(result?.response).toMatchObject({
      stringResponse: TEST_RESPONSE_STRING,
    });
  });

  it('should returned undefined if there is no record in the database', async () => {
    getRequestResults.mockResolvedValue(undefined);

    const result = await startPollingForResultsInteractor(
      {
        requestId: TEST_REQUEST_ID,
      },
      mockDocketClerkUser,
    );

    const getRequestResultsCalls = getRequestResults.mock.calls;

    expect(getRequestResultsCalls.length).toEqual(1);
    expect(getRequestResultsCalls[0][0].requestId).toEqual(TEST_REQUEST_ID);
    expect(getRequestResultsCalls[0][0].userId).toEqual(TEST_USER_ID);

    expect(result?.response).toEqual(undefined);
  });

  it('should throw an error when the user is not an auth user', async () => {
    getRequestResults.mockResolvedValue([]);

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
