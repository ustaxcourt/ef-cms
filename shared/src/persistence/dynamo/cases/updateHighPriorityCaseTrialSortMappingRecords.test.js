const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const {
  updateHighPriorityCaseTrialSortMappingRecords,
} = require('./updateHighPriorityCaseTrialSortMappingRecords');

const applicationContext = {
  environment: {
    stage: 'local',
  },
};

const caseId = 'abc';
const caseSortTags = {
  hybrid: 'abc',
  nonHybrid: '123',
};

describe('updateHighPriorityCaseTrialSortMappingRecords', () => {
  beforeEach(() => {
    sinon.stub(client, 'put').resolves(null);
    sinon.stub(client, 'delete').resolves(null);
  });

  afterEach(() => {
    client.put.restore();
    client.delete.restore();
    client.query.restore();
  });

  it('should delete old mapping records even if sort tags have not changed', async () => {
    sinon.stub(client, 'query').resolves([{ sk: 'abc' }, { sk: '123' }]);

    await updateHighPriorityCaseTrialSortMappingRecords({
      applicationContext,
      caseId,
      caseSortTags,
    });
    expect(client.delete.getCall(0).args[0].key.sk).toEqual('abc');
    expect(client.delete.getCall(1).args[0].key.sk).toEqual('123');
  });

  it('should attempt to put new records even if no old mapping records were found', async () => {
    sinon.stub(client, 'query').resolves([]);

    await updateHighPriorityCaseTrialSortMappingRecords({
      applicationContext,
      caseId,
      caseSortTags,
    });
    expect(client.put.getCall(0).args[0].Item).toMatchObject({
      caseId,
      gsi1pk: 'eligible-for-trial-case-catalog-abc',
      pk: 'eligible-for-trial-case-catalog',
      sk: '123',
    });
    expect(client.put.getCall(1).args[0].Item).toMatchObject({
      caseId,
      gsi1pk: 'eligible-for-trial-case-catalog-abc',
      pk: 'eligible-for-trial-case-catalog',
      sk: 'abc',
    });
  });

  it('should update mapping records if sort tags have changed', async () => {
    sinon.stub(client, 'query').resolves([{ sk: 'abc' }, { sk: '123' }]);

    await updateHighPriorityCaseTrialSortMappingRecords({
      applicationContext,
      caseId,
      caseSortTags: { hybrid: 'efg', nonHybrid: '456' },
    });
    expect(client.put.getCall(0).args[0].Item).toMatchObject({
      caseId,
      gsi1pk: 'eligible-for-trial-case-catalog-abc',
      pk: 'eligible-for-trial-case-catalog',
      sk: '456',
    });
    expect(client.put.getCall(1).args[0].Item).toMatchObject({
      caseId,
      gsi1pk: 'eligible-for-trial-case-catalog-abc',
      pk: 'eligible-for-trial-case-catalog',
      sk: 'efg',
    });
  });
});
