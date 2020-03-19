const {
  createCaseTrialSortMappingRecords,
} = require('./createCaseTrialSortMappingRecords');

describe('createCaseTrialSortMappingRecords', () => {
  let applicationContext;
  const putStub = jest.fn().mockReturnValue({
    promise: async () => null,
  });

  beforeEach(() => {
    jest.clearAllMocks();

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
    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        caseId: '123',
        gsi1pk: 'eligible-for-trial-case-catalog|123',
        pk: 'eligible-for-trial-case-catalog',
        sk: 'nonhybridSortRecord',
      },
      TableName: 'efcms-dev',
    });
    expect(putStub.mock.calls[1][0]).toMatchObject({
      Item: {
        caseId: '123',
        gsi1pk: 'eligible-for-trial-case-catalog|123',
        pk: 'eligible-for-trial-case-catalog',
        sk: 'hybridSortRecord',
      },
      TableName: 'efcms-dev',
    });
  });
});
