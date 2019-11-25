const sinon = require('sinon');
const { updateWorkItemInCase } = require('./updateWorkItemInCase');

describe('updateWorkItemInCase', () => {
  let updateStub;
  beforeEach(() => {
    updateStub = sinon.stub().returns({
      promise: async () => null,
    });
  });

  it('invokes the persistence layer with pk of {workItemId}, sk of {workItemId} and other expected params', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        update: updateStub,
      }),
    };
    await updateWorkItemInCase({
      applicationContext,
      caseToUpdate: {
        caseId: '123',
        documents: [
          {
            documentId: '321',
            workItems: [{ workItemId: '456' }, { workItemId: '654' }],
          },
        ],
      },
      workItem: {
        assigneeId: 'bob',
        workItemId: '456',
      },
    });
    expect(updateStub.getCall(0).args[0]).toMatchObject({
      ExpressionAttributeValues: {
        ':workItem': { assigneeId: 'bob', workItemId: '456' },
      },
      Key: {
        pk: '123',
        sk: '123',
      },
      UpdateExpression: 'SET #documents[0].#workItems[0] = :workItem',
      applicationContext: { environment: { stage: 'dev' } },
    });
  });
});
