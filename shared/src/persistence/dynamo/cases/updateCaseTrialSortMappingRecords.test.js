const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  updateCaseTrialSortMappingRecords,
} = require('./updateCaseTrialSortMappingRecords');

const caseId = 'abc';
const caseSortTags = {
  hybrid: 'abc',
  nonHybrid: '123',
};

describe('updateCaseTrialSortMappingRecords', () => {
  beforeEach(() => {
    client.put = jest.fn().mockReturnValue(null);
    client.delete = jest.fn().mockReturnValue(null);
  });

  it('should not update mapping records if sort tags have not changed', async () => {
    client.query = jest.fn().mockReturnValue([{ sk: 'abc' }, { sk: '123' }]);

    await updateCaseTrialSortMappingRecords({
      applicationContext,
      caseId,
      caseSortTags,
    });
    expect(client.put).not.toBeCalled();
  });

  it('should not attempt to put new records if no old mapping records were found', async () => {
    client.query = jest.fn().mockReturnValue([]);

    await updateCaseTrialSortMappingRecords({
      applicationContext,
      caseId,
      caseSortTags,
    });
    expect(client.put).not.toBeCalled();
  });

  it('should update mapping records if sort tags have changed', async () => {
    client.query = jest.fn().mockReturnValue([{ sk: 'abc' }, { sk: '123' }]);

    await updateCaseTrialSortMappingRecords({
      applicationContext,
      caseId,
      caseSortTags: { hybrid: 'efg', nonHybrid: '456' },
    });
    expect(client.put.mock.calls[0][0].Item).toMatchObject({
      caseId,
      gsi1pk: 'eligible-for-trial-case-catalog|abc',
      pk: 'eligible-for-trial-case-catalog',
      sk: '456',
    });
    expect(client.put.mock.calls[1][0].Item).toMatchObject({
      caseId,
      gsi1pk: 'eligible-for-trial-case-catalog|abc',
      pk: 'eligible-for-trial-case-catalog',
      sk: 'efg',
    });
  });
});
