const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getUserCaseNoteForCases } = require('./getUserCaseNoteForCases');
jest.mock('../cases/getCaseIdFromDocketNumber');
const {
  getCaseIdFromDocketNumber,
} = require('../cases/getCaseIdFromDocketNumber');

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

  it('should retrieve the caseId for each case from the docketNumbers provided', async () => {
    await getUserCaseNoteForCases({
      applicationContext,
      docketNumbers: ['123-45'],
    });

    expect(getCaseIdFromDocketNumber).toHaveBeenCalled();
  });

  it('should get the case notes by case id and user id', async () => {
    const result = await getUserCaseNoteForCases({
      applicationContext,
      docketNumbers: ['123-45'],
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
