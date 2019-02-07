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
    client.get.restore();
    client.delete.restore();
  });

  it('makes a post request to the expected endpoint with the expected data', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      filterCaseMetadata: ({ cases }) => cases,
      isAuthorizedForWorkItems: () => true,
    };
    const result = await saveWorkItem({
      workItemToSave: {
        workItemId: '123',
        assigneeId: 'bob',
      },
      applicationContext,
    });
    expect(result).toEqual([{ workItemId: 'abc' }]);
  });

  it('makes a post request to the expected endpoint with unexpected data', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      filterCaseMetadata: ({ cases }) => cases,
      isAuthorizedForWorkItems: () => true,
    };
    const result = await saveWorkItem({
      workItemToSave: {
        workItemId: '456',
        assigneeId: 'jose',
      },
      applicationContext,
    });
    expect(result).toEqual([{ workItemId: 'abc' }]);
  });
});
