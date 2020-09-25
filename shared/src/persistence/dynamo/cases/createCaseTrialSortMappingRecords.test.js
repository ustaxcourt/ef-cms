const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  createCaseTrialSortMappingRecords,
} = require('./createCaseTrialSortMappingRecords');

describe('createCaseTrialSortMappingRecords', () => {
  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
  });

  it('attempts to persist the case trial sort mapping records', async () => {
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
      TableName: 'efcms-dev',
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
      TableName: 'efcms-dev',
    });
  });
});
