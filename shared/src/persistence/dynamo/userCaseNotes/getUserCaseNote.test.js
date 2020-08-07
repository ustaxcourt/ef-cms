const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getUserCaseNote } = require('./getUserCaseNote');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getUserCaseNote', () => {
  beforeEach(() => {
    client.get = jest.fn().mockReturnValue({
      notes: 'something',
      pk: `user-case-note|${MOCK_CASE.docketNumber}`,
      sk: `user|${MOCK_CASE.userId}`,
      userId: MOCK_CASE.userId,
    });
  });

  it('should get the case notes by case id and user id', async () => {
    const result = await getUserCaseNote({
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
      userId: MOCK_CASE.userId,
    });

    expect(result).toEqual({
      notes: 'something',
      pk: `user-case-note|${MOCK_CASE.docketNumber}`,
      sk: `user|${MOCK_CASE.userId}`,
      userId: MOCK_CASE.userId,
    });
  });
});
