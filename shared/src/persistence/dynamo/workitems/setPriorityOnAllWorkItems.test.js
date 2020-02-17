const sinon = require('sinon');
const { setPriorityOnAllWorkItems } = require('./setPriorityOnAllWorkItems');

describe('setPriorityOnAllWorkItems', () => {
  let updateStub;
  let queryStub;

  beforeEach(() => {
    queryStub = sinon.stub().returns({
      promise: async () => ({
        Items: [
          {
            pk: '80f89505-f137-45f0-8e82-9f9870322efc|workItem',
            sk: '62685fab-04f3-43d2-b34d-cf1b1b38f300',
          },
          {
            pk: '80f89505-f137-45f0-8e82-9f9870322efc|workItem',
            sk: 'a5b0c565-cf78-4047-8bbc-c16cfee3062b',
          },
        ],
      }),
    });
    updateStub = sinon.stub().returns({
      promise: async () => true,
    });
  });

  it('invokes the persistence layer to update each work item', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        query: queryStub,
        update: updateStub,
      }),
    };
    await setPriorityOnAllWorkItems({
      applicationContext,
      caseId: '80f89505-f137-45f0-8e82-9f9870322efc',
      highPriority: true,
      trialDate: '2019-03-01T21:40:46.415Z',
    });
    expect(updateStub.getCall(0).args[0]).toMatchObject({
      ExpressionAttributeValues: {
        ':highPriority': true,
        ':trialDate': '2019-03-01T21:40:46.415Z',
      },
      Key: {
        pk: '80f89505-f137-45f0-8e82-9f9870322efc|workItem',
        sk: '62685fab-04f3-43d2-b34d-cf1b1b38f300',
      },
    });
    expect(updateStub.getCall(1).args[0]).toMatchObject({
      ExpressionAttributeValues: {
        ':highPriority': true,
        ':trialDate': '2019-03-01T21:40:46.415Z',
      },
      Key: {
        pk: '80f89505-f137-45f0-8e82-9f9870322efc|workItem',
        sk: 'a5b0c565-cf78-4047-8bbc-c16cfee3062b',
      },
    });
  });

  it('invokes the persistence layer to update each work item with an undefined trialDate', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        query: queryStub,
        update: updateStub,
      }),
    };
    await setPriorityOnAllWorkItems({
      applicationContext,
      caseId: '80f89505-f137-45f0-8e82-9f9870322efc',
      highPriority: false,
    });
    expect(updateStub.getCall(0).args[0]).toMatchObject({
      ExpressionAttributeValues: {
        ':highPriority': false,
        ':trialDate': null,
      },
      Key: {
        pk: '80f89505-f137-45f0-8e82-9f9870322efc|workItem',
        sk: '62685fab-04f3-43d2-b34d-cf1b1b38f300',
      },
    });
    expect(updateStub.getCall(1).args[0]).toMatchObject({
      ExpressionAttributeValues: {
        ':highPriority': false,
        ':trialDate': null,
      },
      Key: {
        pk: '80f89505-f137-45f0-8e82-9f9870322efc|workItem',
        sk: 'a5b0c565-cf78-4047-8bbc-c16cfee3062b',
      },
    });
  });
});
