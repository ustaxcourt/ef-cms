const sinon = require('sinon');
const client = require('ef-cms-shared/src/persistence/dynamodbClientService');

const { syncDocuments } = require('./syncDocuments');

const applicationContext = {
  environment: {
    stage: 'local',
  },
  filterCaseMetadata: ({ cases }) => cases,
  isAuthorizedForWorkItems: () => true,
};

const currentCase = {
  documents: [],
};

const caseToSave = {
  caseId: 'caseId',
  documents: [
    {
      documentId: 'docId',
    },
  ],
};
describe('syncDocuments', () => {
  beforeEach(() => {
    sinon.stub(client, 'put').resolves(null);
  });

  afterEach(() => {
    client.put.restore();
  });

  it('should get the internal users', async () => {
    await syncDocuments({
      applicationContext,
      currentCaseState: currentCase,
      caseToSave,
    });

    expect(client.put.getCall(0).args[0].Item).toEqual({
      pk: 'docId|case',
      sk: 'caseId',
    });
  });
});
