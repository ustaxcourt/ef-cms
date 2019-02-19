const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-string'));
const sinon = require('sinon');
const client = require('../../dynamodbClientService');
const persistence = require('../../awsDynamoPersistence');
const mappings = require('../../dynamo/helpers/createMappingRecord');

const sync = require('./syncWorkItems');
const { syncWorkItems } = require('./syncWorkItems');

const applicationContext = {
  environment: {
    stage: 'local',
  },
  getDynamoClient: () => client,
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
    expect(client.put.getCall(0).args[0].Item.sk).to.equal('abc');
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
    expect(client.put.getCall(0).args[0].Item.sk).to.equal('abc');
  });

  it('updates the workitems when the case status changes', async () => {
    await syncWorkItems({
      applicationContext,
      caseToSave: {
        status: 'General',
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
        status: 'New',
        documents: [
          {
            workItems: [
              {
                workItemId: 'abc',
                caseStatus: 'new',
              },
            ],
          },
        ],
      },
    });
    expect(sync.updateWorkItem.called).to.be.true;
  });

  it('reassigns the work item from one user to another', async () => {
    await syncWorkItems({
      applicationContext,
      caseToSave: {
        documents: [
          {
            workItems: [
              {
                workItemId: 'abc',
                assigneeId: 'rick',
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
                workItemId: 'abc',
                assigneeId: 'bob',
              },
            ],
          },
        ],
      },
    });
    expect(sync.reassignWorkItem.called).to.be.true;
  });

  it('creates 2 mapping records if the case status changes to Batched for IRS', async () => {
    await syncWorkItems({
      applicationContext,
      caseToSave: {
        status: 'Batched for IRS',
        documents: [
          {
            workItems: [
              {
                workItemId: 'abc',
                assigneeId: 'rick',
                isInitializeCase: true,
                messages: [
                  {
                    message: 'Petition batched for IRS',
                    userId: 'petitionsclerk1',
                    createdAt: '123',
                  },
                ],
              },
            ],
          },
        ],
      },
      currentCaseState: {
        status: 'New',
        documents: [
          {
            workItems: [
              {
                workItemId: 'abc',
                assigneeId: 'rick',
                section: 'petitions',
                isInitializeCase: true,
                messages: [
                  {
                    message: 'Petition batched for IRS',
                    userId: 'petitionsclerk1',
                    createdAt: '123',
                  },
                ],
              },
            ],
          },
        ],
      },
    });
    expect(client.put.getCall(0).args[0].Item.pk).to.equal(
      'petitionsclerk1|sentWorkItem',
    );
    expect(client.put.getCall(0).args[0].Item.sk).to.equal('123');
    expect(client.put.getCall(1).args[0].Item.pk).to.equal(
      'petitions|sentWorkItem',
    );
    expect(client.put.getCall(1).args[0].Item.sk).to.equal('123');
  });

  it('creates a mapping record when the work item is completed', async () => {
    await syncWorkItems({
      applicationContext,
      caseToSave: {
        status: 'New',
        documents: [
          {
            workItems: [
              {
                completedAt: '123',
                workItemId: 'abc',
                assigneeId: 'rick',
                section: 'petitions',
                isInitializeCase: true,
                messages: [
                  {
                    message: 'Petition batched for IRS',
                    userId: 'petitionsclerk1',
                    createdAt: '123',
                  },
                ],
              },
            ],
          },
        ],
      },
      currentCaseState: {
        status: 'New',
        documents: [
          {
            workItems: [
              {
                completedAt: null,
                workItemId: 'abc',
                assigneeId: 'rick',
                section: 'petitions',
                isInitializeCase: true,
                messages: [
                  {
                    message: 'Petition batched for IRS',
                    userId: 'petitionsclerk1',
                    createdAt: '123',
                  },
                ],
              },
            ],
          },
        ],
      },
    });
    expect(client.put.getCall(0).args[0].Item.pk).to.equal(
      'petitions|sentWorkItem',
    );
    expect(client.put.getCall(0).args[0].Item.sk).to.equal('123');
  });

  it('deletes the mapping records for the sent box items when the status changes to Recalled', async () => {
    await syncWorkItems({
      applicationContext,
      caseToSave: {
        status: 'Recalled',
        documents: [
          {
            workItems: [
              {
                completedAt: '123',
                workItemId: 'abc',
                assigneeId: 'rick',
                section: 'petitions',
                isInitializeCase: true,
                messages: [
                  {
                    message: 'Petition batched for IRS',
                    userId: 'petitionsclerk1',
                    createdAt: '123',
                  },
                ],
              },
            ],
          },
        ],
      },
      currentCaseState: {
        status: 'New',
        documents: [
          {
            workItems: [
              {
                completedAt: null,
                workItemId: 'abc',
                assigneeId: 'rick',
                section: 'irsBatchSection',
                isInitializeCase: true,
                messages: [
                  {
                    message: 'Petition batched for IRS',
                    userId: 'petitionsclerk1',
                    createdAt: '123',
                  },
                ],
              },
            ],
          },
        ],
      },
    });
    expect(client.delete.getCall(0).args[0].key.pk).to.equal(
      'petitionsclerk1|sentWorkItem',
    );
    expect(client.delete.getCall(0).args[0].key.sk).to.equal('123');
    expect(client.delete.getCall(1).args[0].key.pk).to.equal(
      'petitions|sentWorkItem',
    );
    expect(client.delete.getCall(1).args[0].key.sk).to.equal('123');
  });
});
