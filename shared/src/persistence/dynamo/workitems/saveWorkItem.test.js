const { saveWorkItem } = require('./saveWorkItem');
const client = require('../../dynamodbClientService');
const sinon = require('sinon');

describe('saveWorkItem', () => {
  beforeEach(() => {
    sinon.stub(client, 'get').resolves({
      caseId: '123',
      assigneeId: 'bob',
      documents: [
        {
          documentId: 'abc',
          workItems: [
            {
              workItemId: '123',
            },
          ],
        },
      ],
    });
    sinon.stub(client, 'delete').resolves({});
    sinon.stub(client, 'put').resolves([
      {
        workItemId: 'abc',
        pk: 'abc',
        sk: 'abc',
      },
    ]);
  });

  afterEach(() => {
    client.put.restore();
  });

  it('makes a post request to the expected endpoint with the expected data', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      isAuthorizedForWorkItems: () => true,
    };
    const result = await saveWorkItem({
      workItemToSave: {
        workItemId: '123',
      },
      applicationContext,
    });
    expect(result).toEqual([{ workItemId: 'abc' }]);
  });
});
