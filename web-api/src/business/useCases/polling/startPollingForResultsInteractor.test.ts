import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { startPollingForResultsInteractor } from '@web-api/business/useCases/polling/startPollingForResultsInteractor';

describe('startPollingForResultsInteractor', () => {
  const TEST_REQUEST_ID = 'TEST_REQUEST_ID';
  const TEST_RESPONSE = 'TEST_RESPONSE';
  const MOCKED_RESULTS = {
    pk: 'test_pk',
    response: TEST_RESPONSE,
    sk: 'test_sk',
  };
  const TEST_USER_ID = 'TEST_USER_ID';
  const TEST_USER = {
    userId: TEST_USER_ID,
  };

  beforeEach(() => {
    applicationContext.getCurrentUser = jest.fn().mockReturnValue(TEST_USER);
    applicationContext.getPersistenceGateway().getRequestResults = jest
      .fn()
      .mockResolvedValue(MOCKED_RESULTS);
  });

  it('should load poll response', async () => {
    const results = await startPollingForResultsInteractor(applicationContext, {
      requestId: TEST_REQUEST_ID,
    });

    const getRequestResultsCalls =
      applicationContext.getPersistenceGateway().getRequestResults.mock.calls;

    expect(getRequestResultsCalls.length).toEqual(1);
    expect(getRequestResultsCalls[0][0].requestId).toEqual(TEST_REQUEST_ID);
    expect(getRequestResultsCalls[0][0].userId).toEqual(TEST_USER_ID);

    expect(results).toEqual({
      response: TEST_RESPONSE,
    });
  });

  it('should returned undefined if there are no results', async () => {
    applicationContext.getPersistenceGateway().getRequestResults = jest
      .fn()
      .mockResolvedValue(undefined);

    const results = await startPollingForResultsInteractor(applicationContext, {
      requestId: TEST_REQUEST_ID,
    });

    const getRequestResultsCalls =
      applicationContext.getPersistenceGateway().getRequestResults.mock.calls;

    expect(getRequestResultsCalls.length).toEqual(1);
    expect(getRequestResultsCalls[0][0].requestId).toEqual(TEST_REQUEST_ID);
    expect(getRequestResultsCalls[0][0].userId).toEqual(TEST_USER_ID);

    expect(results).toEqual(undefined);
  });
});
