import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getRequestResults } from '@web-api/persistence/dynamo/polling/getRequestResults';

describe('getRequestResults', () => {
  const TEST_REQUEST_ID = 'TEST_REQUEST_ID';
  const TEST_USER_ID = 'TEST_USER_ID';
  const MOCK_GET_RESULTS = {
    Item: {
      testProp1: 'testProp1',
    },
  };

  beforeEach(() => {
    applicationContext.getDocumentClient().get = jest
      .fn()
      .mockResolvedValue(MOCK_GET_RESULTS);
  });

  it('should return request results', async () => {
    const results = await getRequestResults({
      applicationContext,
      requestId: TEST_REQUEST_ID,
      userId: TEST_USER_ID,
    });

    const getCalls = applicationContext.getDocumentClient().get.mock.calls;
    expect(getCalls.length).toEqual(1);
    expect(getCalls[0][0].Key).toEqual({
      pk: `user|${TEST_USER_ID}`,
      sk: `request|${TEST_REQUEST_ID}`,
    });

    expect(results).toEqual({
      testProp1: 'testProp1',
    });
  });
});
