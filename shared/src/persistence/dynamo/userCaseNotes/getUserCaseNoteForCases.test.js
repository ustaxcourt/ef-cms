const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getUserCaseNoteForCases } = require('./getUserCaseNoteForCases');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getUserCaseNoteForCases', () => {
  const USER_ID = 'b1edae5a-23e4-4dc8-9d6c-43060ab3d8c7';

  beforeEach(() => {
    client.batchGet = jest.fn().mockReturnValue([
      {
        notes: 'something',
        pk: `user-case-note|${MOCK_CASE.docketNumber}`,
        sk: `user|${USER_ID}`,
        userId: USER_ID,
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
        sk: `user|${USER_ID}`,
        userId: USER_ID,
      },
    ]);
  });
});
