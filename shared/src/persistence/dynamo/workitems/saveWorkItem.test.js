const { saveWorkItem } = require('./saveWorkItem');
const client = require('../../dynamodbClientService');
const sinon = require('sinon');

describe('saveWorkItem', () => {
  beforeEach(() => {
    sinon.stub(client, 'get').resolves({
      assigneeId: 'bob',
      caseId: '123',
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
        pk: 'abc',
        sk: 'abc',
        workItemId: 'abc',
      },
    ]);
  });

  afterEach(() => {
    client.put.restore();
    client.get.restore();
    client.delete.restore();
  });

  it('makes a post request to the expected endpoint with the expected data', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      filterCaseMetadata: ({ cases }) => cases,
      getCurrentUser: () => ({
        userId: 'abc',
      }),
      isAuthorizedForWorkItems: () => true,
    };
    const result = await saveWorkItem({
      applicationContext,
      workItemToSave: {
        assigneeId: 'bob',
        workItemId: '123',
      },
    });
    expect(result).toEqual([{ workItemId: 'abc' }]);
  });
});
