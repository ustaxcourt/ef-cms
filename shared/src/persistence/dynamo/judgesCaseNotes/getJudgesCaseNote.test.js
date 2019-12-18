const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const { getJudgesCaseNote } = require('./getJudgesCaseNote');

describe('getJudgesCaseNote', () => {
  beforeEach(() => {
    sinon.stub(client, 'get').resolves({
      caseId: '123',
      notes: 'something',
      pk: 'judges-case-note|123',
      sk: '456',
      userId: '456',
    });
  });

  afterEach(() => {
    client.get.restore();
  });

  it('should get the case notes by case id and user id', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
    };
    const result = await getJudgesCaseNote({
      applicationContext,
      caseId: '123',
      userId: '456',
    });
    expect(result).toEqual({
      caseId: '123',
      notes: 'something',
      userId: '456',
    });
  });
});
