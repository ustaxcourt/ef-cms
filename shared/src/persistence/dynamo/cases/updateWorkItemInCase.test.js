const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { updateWorkItemInCase } = require('./updateWorkItemInCase');

describe('updateWorkItemInCase', () => {
  let updateStub;
  beforeEach(() => {
    updateStub = jest.fn().mockReturnValue({
      promise: async () => null,
    });
  });

  it('invokes the persistence layer with pk of {workItemId}, sk of {workItemId} and other expected params', async () => {
    applicationContext.getDocumentClient.mockReturnValue({
      update: updateStub,
    });
    await updateWorkItemInCase({
      applicationContext,
      caseToUpdate: {
        docketNumber: '123-20',
        documents: [
          {
            documentId: '321',
            workItem: { workItemId: '456' },
          },
        ],
      },
      workItem: {
        assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
        workItemId: '456',
      },
    });
    expect(updateStub.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':workItem': {
          assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
          workItemId: '456',
        },
      },
      Key: {
        pk: 'case|123-20',
        sk: 'document|321',
      },
      UpdateExpression: 'SET #workItem = :workItem',
      applicationContext: { environment: { stage: 'local' } },
    });
  });
});
