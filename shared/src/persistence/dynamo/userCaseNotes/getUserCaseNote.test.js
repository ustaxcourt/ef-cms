const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getUserCaseNote } = require('./getUserCaseNote');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getUserCaseNote', () => {
  const USER_ID = '220b5dc9-9d0c-4662-97ad-2cb9729c611a';

  beforeEach(() => {
    client.get = jest.fn().mockReturnValue({
      notes: 'something',
      pk: `user-case-note|${MOCK_CASE.docketNumber}`,
      sk: `user|${USER_ID}`,
      userId: USER_ID,
    });
  });

  it('should get the case notes by case id and user id', async () => {
    const result = await getUserCaseNote({
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
      userId: USER_ID,
    });

    expect(result).toEqual({
      notes: 'something',
      pk: `user-case-note|${MOCK_CASE.docketNumber}`,
      sk: `user|${USER_ID}`,
      userId: USER_ID,
    });
  });
});
