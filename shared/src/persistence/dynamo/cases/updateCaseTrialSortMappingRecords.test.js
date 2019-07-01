const client = require('ef-cms-shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
const {
  updateCaseTrialSortMappingRecords,
} = require('./updateCaseTrialSortMappingRecords');

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

describe('updateCaseTrialSortMappingRecords', () => {
  beforeEach(() => {
    sinon.stub(client, 'put').resolves(null);
    sinon.stub(client, 'delete').resolves(null);
  });

  afterEach(() => {
    client.put.restore();
    client.delete.restore();
    client.query.restore();
  });

  it('should not update mapping records if sort tags have not changed', async () => {
    sinon.stub(client, 'query').resolves([{ sk: 'abc' }, { sk: '123' }]);

    await updateCaseTrialSortMappingRecords({
      applicationContext,
      caseId,
      caseSortTags,
    });
    expect(client.put.getCall(0)).toEqual(null);
  });

  it('should not attempt to put new records if no old mapping records were found', async () => {
    sinon.stub(client, 'query').resolves([]);

    await updateCaseTrialSortMappingRecords({
      applicationContext,
      caseId,
      caseSortTags,
    });
    expect(client.put.getCall(0)).toEqual(null);
  });

  it('should update mapping records if sort tags have changed', async () => {
    sinon.stub(client, 'query').resolves([{ sk: 'abc' }, { sk: '123' }]);

    await updateCaseTrialSortMappingRecords({
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
