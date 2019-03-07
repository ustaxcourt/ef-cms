const sinon = require('sinon');
const client = require('../../dynamodbClientService');
const mappings = require('../../dynamo/helpers/createMappingRecord');

const sync = require('./syncWorkItems');
const { syncWorkItems } = require('./syncWorkItems');

const applicationContext = {
  environment: {
    stage: 'local',
  },
};

describe('syncWorkItems', function() {
  beforeEach(() => {
    sinon.stub(mappings, 'createMappingRecord').resolves(null);
    sinon.stub(client, 'put').resolves(null);
    sinon.stub(client, 'delete').resolves(null);
    sinon.stub(sync, 'reassignWorkItem').resolves(null);
    sinon.stub(sync, 'updateWorkItem').resolves(null);
  });

  afterEach(() => {
    mappings.createMappingRecord.restore();
    client.put.restore();
    client.delete.restore();
    sync.reassignWorkItem.restore();
    sync.updateWorkItem.restore();
  });

  it('creates a new work item record for the work item and the mapping record for the assignee when a new work item is added to a case', async () => {
    await syncWorkItems({
      applicationContext,
      caseToSave: {
        documents: [
          {
            workItems: [
              {
                workItemId: 'abc',
              },
            ],
          },
        ],
      },
      currentCaseState: {},
    });
    expect(client.put.getCall(0).args[0].Item.sk).toEqual('abc');
  });

  it('should create a new work item record for the work item and the mapping record for the assignee when a new work item is added to a document', async () => {
    await syncWorkItems({
      applicationContext,
      caseToSave: {
        documents: [
          {
            workItems: [
              {
                workItemId: 'abc',
              },
            ],
          },
        ],
      },
      currentCaseState: {
        documents: [
          {
            workItems: [
              {
                workItemId: '123',
              },
            ],
          },
        ],
      },
    });
    expect(client.put.getCall(0).args[0].Item.sk).toEqual('abc');
  });

  it('updates the workitems when the case status changes', async () => {
    await syncWorkItems({
      applicationContext,
      caseToSave: {
        documents: [
          {
            workItems: [
              {
                workItemId: 'abc',
              },
            ],
          },
        ],
        status: 'General',
      },
      currentCaseState: {
        documents: [
          {
            workItems: [
              {
                caseStatus: 'new',
                workItemId: 'abc',
              },
            ],
          },
        ],
        status: 'New',
      },
    });
    expect(sync.updateWorkItem.called).toBeTruthy();
  });

  it('reassigns the work item from one user to another', async () => {
    await syncWorkItems({
      applicationContext,
      caseToSave: {
        documents: [
          {
            workItems: [
              {
                assigneeId: 'rick',
                workItemId: 'abc',
              },
            ],
          },
        ],
      },
      currentCaseState: {
        documents: [
          {
            workItems: [
              {
                assigneeId: 'bob',
                workItemId: 'abc',
              },
            ],
          },
        ],
      },
    });
    expect(sync.reassignWorkItem.called).toBeTruthy();
  });

  it('creates 2 mapping records if the case status changes to Batched for IRS', async () => {
    await syncWorkItems({
      applicationContext,
      caseToSave: {
        documents: [
          {
            workItems: [
              {
                assigneeId: 'rick',
                isInitializeCase: true,
                messages: [
                  {
                    createdAt: '123',
                    message: 'Petition batched for IRS',
                    userId: 'petitionsclerk1',
                  },
                ],
                workItemId: 'abc',
              },
            ],
          },
        ],
        status: 'Batched for IRS',
      },
      currentCaseState: {
        documents: [
          {
            workItems: [
              {
                assigneeId: 'rick',
                isInitializeCase: true,
                messages: [
                  {
                    createdAt: '123',
                    message: 'Petition batched for IRS',
                    userId: 'petitionsclerk1',
                  },
                ],
                section: 'petitions',
                workItemId: 'abc',
              },
            ],
          },
        ],
        status: 'New',
      },
    });
    expect(client.put.getCall(0).args[0].Item.pk).toEqual(
      'petitionsclerk1|sentWorkItem',
    );
    expect(client.put.getCall(0).args[0].Item.sk).toEqual('123');
    expect(client.put.getCall(1).args[0].Item.pk).toEqual(
      'petitions|sentWorkItem',
    );
    expect(client.put.getCall(1).args[0].Item.sk).toEqual('123');
  });

  it('creates a mapping record when the work item is completed', async () => {
    await syncWorkItems({
      applicationContext,
      caseToSave: {
        documents: [
          {
            workItems: [
              {
                assigneeId: 'rick',
                completedAt: '123',
                isInitializeCase: true,
                messages: [
                  {
                    createdAt: '123',
                    message: 'Petition batched for IRS',
                    userId: 'petitionsclerk1',
                  },
                ],
                section: 'petitions',
                workItemId: 'abc',
              },
            ],
          },
        ],
        status: 'New',
      },
      currentCaseState: {
        documents: [
          {
            workItems: [
              {
                assigneeId: 'rick',
                completedAt: null,
                isInitializeCase: true,
                messages: [
                  {
                    createdAt: '123',
                    message: 'Petition batched for IRS',
                    userId: 'petitionsclerk1',
                  },
                ],
                section: 'petitions',
                workItemId: 'abc',
              },
            ],
          },
        ],
        status: 'New',
      },
    });
    expect(client.put.getCall(0).args[0].Item.pk).toEqual(
      'petitions|sentWorkItem',
    );
    expect(client.put.getCall(0).args[0].Item.sk).toEqual('123');
  });

  it('deletes the mapping records for the sent box items when the status changes to Recalled', async () => {
    await syncWorkItems({
      applicationContext,
      caseToSave: {
        documents: [
          {
            workItems: [
              {
                assigneeId: 'rick',
                completedAt: '123',
                isInitializeCase: true,
                messages: [
                  {
                    createdAt: '123',
                    message: 'Petition batched for IRS',
                    userId: 'petitionsclerk1',
                  },
                ],
                section: 'petitions',
                workItemId: 'abc',
              },
            ],
          },
        ],
        status: 'Recalled',
      },
      currentCaseState: {
        documents: [
          {
            workItems: [
              {
                assigneeId: 'rick',
                completedAt: null,
                isInitializeCase: true,
                messages: [
                  {
                    createdAt: '123',
                    message: 'Petition batched for IRS',
                    userId: 'petitionsclerk1',
                  },
                ],
                section: 'irsBatchSection',
                workItemId: 'abc',
              },
            ],
          },
        ],
        status: 'New',
      },
    });
    expect(client.delete.getCall(0).args[0].key.pk).toEqual(
      'petitionsclerk1|sentWorkItem',
    );
    expect(client.delete.getCall(0).args[0].key.sk).toEqual('123');
    expect(client.delete.getCall(1).args[0].key.pk).toEqual(
      'petitions|sentWorkItem',
    );
    expect(client.delete.getCall(1).args[0].key.sk).toEqual('123');
  });
});
