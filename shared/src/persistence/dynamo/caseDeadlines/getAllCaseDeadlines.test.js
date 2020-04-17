const client = require('../../dynamodbClientService');
const { getAllCaseDeadlines } = require('./getAllCaseDeadlines');
const { MOCK_CASE } = require('../../../test/mockCase');

const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');

describe('getAllCaseDeadlines', () => {
  beforeEach(() => {
    client.query = jest.fn().mockReturnValue([
      {
        caseDeadlineId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        pk: 'case-deadline-catalog',
      },
    ]);
    client.batchGet = jest
      .fn()
      .mockReturnValueOnce([
        {
          caseDeadlineId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          caseId: MOCK_CASE.caseId,
          pk: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          sk: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      ])
      .mockReturnValueOnce([{ ...MOCK_CASE, pk: MOCK_CASE.caseId }]);
  });

  it('should get the all cases deadlines', async () => {
    const result = await getAllCaseDeadlines({
      applicationContext,
    });
    expect(result[0].docketNumber).toEqual('101-18');
  });
});
