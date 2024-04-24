import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { saveRequestResponse } from '@web-api/persistence/dynamo/polling/saveRequestResponse';

describe('saveRequestResponse', () => {
  const TEST_REQUEST_ID = 'TEST_REQUEST_ID';
  const TEST_RESPONSE = { testProp: 'testProp' };
  const TEST_USER_ID = 'TEST_USER_ID';

  beforeEach(() => {
    applicationContext.getDocumentClient().put = jest
      .fn()
      .mockResolvedValue({});
  });

  it('should save the request', async () => {
    const results = await saveRequestResponse({
      applicationContext,
      chunk: JSON.stringify(TEST_RESPONSE),
      index: 0,
      requestId: TEST_REQUEST_ID,
      totalNumberOfChunks: 1,
      userId: TEST_USER_ID,
    });

    const putCalls = applicationContext.getDocumentClient().put.mock.calls;
    expect(putCalls.length).toEqual(1);
    expect(putCalls[0][0].Item).toEqual({
      chunk: JSON.stringify(TEST_RESPONSE),
      index: 0,
      pk: `user|${TEST_USER_ID}`,
      requestId: TEST_REQUEST_ID,
      sk: `request|${TEST_REQUEST_ID}-0`,
      totalNumberOfChunks: 1,
      ttl: expect.anything(),
    });
    expect(putCalls[0][0].TableName).toEqual('efcms-local');

    expect(results).toEqual({
      chunk: JSON.stringify(TEST_RESPONSE),
      index: 0,
      pk: `user|${TEST_USER_ID}`,
      requestId: TEST_REQUEST_ID,
      sk: `request|${TEST_REQUEST_ID}-0`,
      totalNumberOfChunks: 1,
      ttl: expect.anything(),
    });
  });
});
