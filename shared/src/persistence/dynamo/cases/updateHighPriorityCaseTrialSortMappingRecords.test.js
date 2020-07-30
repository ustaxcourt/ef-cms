const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  updateHighPriorityCaseTrialSortMappingRecords,
} = require('./updateHighPriorityCaseTrialSortMappingRecords');

const docketNumber = '123-20';
const caseSortTags = {
  hybrid: 'abc',
  nonHybrid: '123',
};

describe('updateHighPriorityCaseTrialSortMappingRecords', () => {
  beforeEach(() => {
    client.put = jest.fn().mockReturnValue(null);
    client.delete = jest.fn().mockReturnValue(null);
  });

  it('should delete old mapping records even if sort tags have not changed', async () => {
    client.query = jest.fn().mockReturnValue([{ sk: 'abc' }, { sk: '123' }]);

    await updateHighPriorityCaseTrialSortMappingRecords({
      applicationContext,
      caseSortTags,
      docketNumber,
    });
    expect(client.delete.mock.calls[0][0].key.sk).toEqual('abc');
    expect(client.delete.mock.calls[1][0].key.sk).toEqual('123');
  });

  it('should attempt to put new records even if no old mapping records were found', async () => {
    client.query = jest.fn().mockReturnValue([]);

    await updateHighPriorityCaseTrialSortMappingRecords({
      applicationContext,
      caseSortTags,
      docketNumber,
    });
    expect(client.put.mock.calls[0][0].Item).toMatchObject({
      docketNumber,
      gsi1pk: 'eligible-for-trial-case-catalog|123-20',
      pk: 'eligible-for-trial-case-catalog',
      sk: '123',
    });
    expect(client.put.mock.calls[1][0].Item).toMatchObject({
      docketNumber,
      gsi1pk: 'eligible-for-trial-case-catalog|123-20',
      pk: 'eligible-for-trial-case-catalog',
      sk: 'abc',
    });
  });

  it('should update mapping records if sort tags have changed', async () => {
    client.query = jest.fn().mockReturnValue([{ sk: 'abc' }, { sk: '123' }]);

    await updateHighPriorityCaseTrialSortMappingRecords({
      applicationContext,
      caseSortTags: { hybrid: 'efg', nonHybrid: '456' },
      docketNumber,
    });
    expect(client.put.mock.calls[0][0].Item).toMatchObject({
      docketNumber,
      gsi1pk: 'eligible-for-trial-case-catalog|123-20',
      pk: 'eligible-for-trial-case-catalog',
      sk: '456',
    });
    expect(client.put.mock.calls[1][0].Item).toMatchObject({
      docketNumber,
      gsi1pk: 'eligible-for-trial-case-catalog|123-20',
      pk: 'eligible-for-trial-case-catalog',
      sk: 'efg',
    });
  });
});
