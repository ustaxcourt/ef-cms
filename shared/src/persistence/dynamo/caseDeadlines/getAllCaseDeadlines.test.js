const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getAllCaseDeadlines } = require('./getAllCaseDeadlines');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getAllCaseDeadlines', () => {
  const mockDeadlines = [
    {
      caseDeadlineId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      caseId: MOCK_CASE.caseId,
      pk: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      sk: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    },
  ];

  beforeEach(() => {
    client.query = jest.fn().mockReturnValue([
      {
        caseDeadlineId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        pk: 'case-deadline-catalog',
      },
    ]);
    client.batchGet = jest.fn().mockReturnValue(mockDeadlines);
  });

  it('should get all case deadlines', async () => {
    const result = await getAllCaseDeadlines({
      applicationContext,
    });
    expect(result).toEqual(mockDeadlines);
  });
});
