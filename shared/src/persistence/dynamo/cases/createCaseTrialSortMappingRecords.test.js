const sinon = require('sinon');
const {
  createCaseTrialSortMappingRecords,
} = require('./createCaseTrialSortMappingRecords');

describe('createCaseTrialSortMappingRecords', () => {
  let applicationContext;
  let putStub;

  beforeEach(() => {
    putStub = sinon.stub().returns({
      promise: async () => null,
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        put: putStub,
      }),
    };
  });

  it('attempts to persist the case trial sort mapping records', async () => {
    await createCaseTrialSortMappingRecords({
      applicationContext,
      caseId: '123',
      caseSortTags: {
        hybrid: 'hybridSortRecord',
        nonHybrid: 'nonhybridSortRecord',
      },
    });
    expect(putStub.getCall(0).args[0]).toMatchObject({
      Item: {
        caseId: '123',
        gsi1pk: 'eligible-for-trial-case-catalog-123',
        pk: 'eligible-for-trial-case-catalog',
        sk: 'nonhybridSortRecord',
      },
      TableName: 'efcms-dev',
    });
    expect(putStub.getCall(1).args[0]).toMatchObject({
      Item: {
        caseId: '123',
        gsi1pk: 'eligible-for-trial-case-catalog-123',
        pk: 'eligible-for-trial-case-catalog',
        sk: 'hybridSortRecord',
      },
      TableName: 'efcms-dev',
    });
  });
});
