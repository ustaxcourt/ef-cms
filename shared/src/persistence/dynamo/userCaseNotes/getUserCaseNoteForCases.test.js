const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const { getUserCaseNoteForCases } = require('./getUserCaseNoteForCases');

describe('getUserCaseNoteForCases', () => {
  beforeEach(() => {
    sinon.stub(client, 'batchGet').resolves([
      {
        caseId: '123',
        notes: 'something',
        pk: 'user-case-note|123',
        sk: '456',
        userId: '456',
      },
    ]);
  });

  afterEach(() => {
    client.batchGet.restore();
  });

  it('should get the case notes by case id and user id', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
    };
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
