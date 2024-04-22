import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getRequestResults } from '@web-api/persistence/dynamo/polling/getRequestResults';

describe('getRequestResults', () => {
  const TEST_REQUEST_ID = 'TEST_REQUEST_ID';
  const TEST_USER_ID = 'TEST_USER_ID';
  const MOCK_GET_RESULTS = {
    Items: [
      {
        chunk: 'something',
        index: 0,
        pk: 'test_pk',
        requestId: TEST_REQUEST_ID,
        sk: 'test_sk',
        totalNumberOfChunks: 1,
      },
    ],
  };

  beforeEach(() => {
    applicationContext.getDocumentClient().query = jest
      .fn()
      .mockResolvedValue(MOCK_GET_RESULTS);
  });

  it('should return request results', async () => {
    const results = await getRequestResults({
      applicationContext,
      requestId: TEST_REQUEST_ID,
      userId: TEST_USER_ID,
    });

    const queryCalls = applicationContext.getDocumentClient().query.mock.calls;

    expect(queryCalls.length).toEqual(1);
    expect(queryCalls[0][0]).toMatchObject({
      ExpressionAttributeNames: {
        '#pk': 'pk',
      },
      ExpressionAttributeValues: {
        ':pk': `user|${TEST_USER_ID}`,
      },
      KeyConditionExpression: '#pk = :pk',
    });

    expect(results).toEqual(MOCK_GET_RESULTS.Items);
  });
});
