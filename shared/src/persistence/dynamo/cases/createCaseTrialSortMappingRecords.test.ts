const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  createCaseTrialSortMappingRecords,
} = require('./createCaseTrialSortMappingRecords');

describe('createCaseTrialSortMappingRecords', () => {
  it('attempts to persist the case trial sort mapping records', async () => {
    applicationContext.getDocumentClient().query = jest.fn().mockReturnValue({
      promise: () => {
        return Promise.resolve({ Items: [] });
      },
    });

    await createCaseTrialSortMappingRecords({
      applicationContext,
      caseSortTags: {
        hybrid: 'hybridSortRecord',
        nonHybrid: 'nonhybridSortRecord',
      },
      docketNumber: '123-20',
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        docketNumber: '123-20',
        gsi1pk: 'eligible-for-trial-case-catalog|123-20',
        pk: 'eligible-for-trial-case-catalog',
        sk: 'nonhybridSortRecord',
      },
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[1][0],
    ).toMatchObject({
      Item: {
        docketNumber: '123-20',
        gsi1pk: 'eligible-for-trial-case-catalog|123-20',
        pk: 'eligible-for-trial-case-catalog',
        sk: 'hybridSortRecord',
      },
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls.length,
    ).toEqual(0);
  });

  it('deletes old mapping records for the given case if they exist', async () => {
    applicationContext.getDocumentClient().query = jest.fn().mockReturnValue({
      promise: () => {
        return Promise.resolve({ Items: [{ sk: 'abc' }, { sk: '123' }] });
      },
    });

    await createCaseTrialSortMappingRecords({
      applicationContext,
      caseSortTags: {
        hybrid: 'hybridSortRecord',
        nonHybrid: 'nonhybridSortRecord',
      },
      docketNumber: '123-20',
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls.length,
    ).toEqual(2);
  });
});
