const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getUserCaseNoteForCases } = require('./getUserCaseNoteForCases');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getUserCaseNoteForCases', () => {
  beforeEach(() => {
    client.batchGet = jest.fn().mockReturnValue([
      {
        notes: 'something',
        pk: `user-case-note|${MOCK_CASE.docketNumber}`,
        sk: `user|${MOCK_CASE.userId}`,
        userId: MOCK_CASE.userId,
      },
    ]);
  });

  it('should get the case notes by case id and user id', async () => {
    const result = await getUserCaseNoteForCases({
      applicationContext,
      docketNumbers: [MOCK_CASE.docketNumber],
    });

    expect(result).toEqual([
      {
        notes: 'something',
        pk: `user-case-note|${MOCK_CASE.docketNumber}`,
        sk: `user|${MOCK_CASE.userId}`,
        userId: MOCK_CASE.userId,
      },
    ]);
  });
});
