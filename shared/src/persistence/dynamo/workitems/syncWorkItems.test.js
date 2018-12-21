const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-string'));
const sinon = require('sinon');
const client = require('../../dynamodbClientService');
const persistence = require('../../awsDynamoPersistence');

const sync = require('./syncWorkItems');
const { syncWorkItems } = require('./syncWorkItems');

const applicationContext = {
  environment: {
    stage: 'local',
  },
};

describe('syncWorkItems', function() {
  beforeEach(() => {
    sinon.stub(persistence, 'createMappingRecord').resolves(null);
    sinon.stub(client, 'put').resolves(null);
    sinon.stub(sync, 'reassignWorkItem').resolves(null);
  });

  afterEach(() => {
    persistence.createMappingRecord.restore();
    client.put.restore();
    sync.reassignWorkItem.restore();
  });

  it('should create a new work item record for the work item and the mapping record for the assignee when a new work item is found in a document', async () => {
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
    expect(persistence.createMappingRecord.getCall(0).args[0].skId).to.equal(
      'abc',
    );
    expect(client.put.getCall(0).args[0].Item.sk).to.equal('abc');
  });

  it('should create a new work item record for the work item and the mapping record for the assignee when a new work item is found in a document', async () => {
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
    expect(persistence.createMappingRecord.getCall(0).args[0].skId).to.equal(
      'abc',
    );
    expect(client.put.getCall(0).args[0].Item.sk).to.equal('abc');
  });

  it('should create a new work item record for the work item and the mapping record for the assignee when a new work item is found in a document', async () => {
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
});
