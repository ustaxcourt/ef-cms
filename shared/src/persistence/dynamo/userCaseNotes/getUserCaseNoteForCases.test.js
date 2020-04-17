const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getUserCaseNoteForCases } = require('./getUserCaseNoteForCases');

describe('getUserCaseNoteForCases', () => {
  beforeEach(() => {
    client.batchGet = jest.fn().mockReturnValue([
      {
        caseId: '123',
        notes: 'something',
        pk: 'user-case-note|123',
        sk: '456',
        userId: '456',
      },
    ]);
  });

  it('should get the case notes by case id and user id', async () => {
    const result = await getUserCaseNoteForCases({
      applicationContext,
      caseIds: ['123'],
    });
    expect(result).toEqual([
      {
        caseId: '123',
        notes: 'something',
        pk: 'user-case-note|123',
        sk: '456',
        userId: '456',
      },
    ]);
  });
});
