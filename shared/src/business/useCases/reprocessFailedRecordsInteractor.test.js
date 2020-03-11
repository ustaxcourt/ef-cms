const {
  reprocessFailedRecordsInteractor,
} = require('./reprocessFailedRecordsInteractor');

describe('reprocessFailedRecordsInteractor', () => {
  let getElasticsearchReindexRecordsSpy;
  let indexSpy;
  const createElasticsearchReindexRecordSpy = jest.fn();
  const deleteElasticsearchReindexRecordSpy = jest.fn();

  const applicationContext = {
    environment: { stage: 'local' },
    getPersistenceGateway: () => ({
      createElasticsearchReindexRecord: createElasticsearchReindexRecordSpy,
      deleteElasticsearchReindexRecord: deleteElasticsearchReindexRecordSpy,
      getElasticsearchReindexRecords: getElasticsearchReindexRecordsSpy,
      getRecord: () => ({ caseId: '123', pk: 'case-123', sk: 'abc' }),
    }),
    getSearchClient: () => ({
      index: indexSpy,
    }),
    logger: {
      info: () => {},
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    indexSpy = jest.fn();
    getElasticsearchReindexRecordsSpy = jest
      .fn()
      .mockResolvedValue([{ recordPk: 'case-123', recordSk: 'abc' }]);
  });

  it('does not call index function if there are no records to process', async () => {
    getElasticsearchReindexRecordsSpy = jest.fn().mockResolvedValue([]);

    await reprocessFailedRecordsInteractor({
      applicationContext,
    });

    expect(indexSpy).not.toHaveBeenCalled();
  });

  it('calls index function for a record, then deletes the record', async () => {
    await reprocessFailedRecordsInteractor({
      applicationContext,
    });

    expect(indexSpy).toHaveBeenCalled();
    expect(indexSpy.mock.calls[0][0]).toMatchObject({
      body: { caseId: { S: '123' }, pk: { S: 'case-123' }, sk: { S: 'abc' } },
      id: 'case-123_abc',
    });
    expect(deleteElasticsearchReindexRecordSpy).toHaveBeenCalled();
    expect(deleteElasticsearchReindexRecordSpy.mock.calls[0][0]).toMatchObject({
      recordPk: 'case-123',
      recordSk: 'abc',
    });
  });

  it('catches an error with indexing and does not delete the record', async () => {
    indexSpy = jest.fn().mockImplementation(() => {
      throw new Error('oh no');
    });
    await reprocessFailedRecordsInteractor({
      applicationContext,
    });

    expect(indexSpy).toHaveBeenCalled();
    expect(deleteElasticsearchReindexRecordSpy).not.toHaveBeenCalled();
  });
});
