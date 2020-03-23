const {
  reprocessFailedRecordsInteractor,
} = require('./reprocessFailedRecordsInteractor');

describe('reprocessFailedRecordsInteractor', () => {
  let getElasticsearchReindexRecordsSpy;
  let indexSpy;
  let getCaseByCaseIdSpy = jest.fn();
  const createElasticsearchReindexRecordSpy = jest.fn();
  const deleteElasticsearchReindexRecordSpy = jest.fn();
  let getRecordSpy;

  const applicationContext = {
    environment: { stage: 'local' },
    getPersistenceGateway: () => ({
      createElasticsearchReindexRecord: createElasticsearchReindexRecordSpy,
      deleteElasticsearchReindexRecord: deleteElasticsearchReindexRecordSpy,
      getCaseByCaseId: getCaseByCaseIdSpy,
      getElasticsearchReindexRecords: getElasticsearchReindexRecordsSpy,
      getRecord: getRecordSpy,
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
      .mockResolvedValue([{ recordPk: 'case|123', recordSk: 'abc' }]);
    getCaseByCaseIdSpy = jest.fn().mockResolvedValue({
      caseId: 'case|123',
    });
    getRecordSpy = jest
      .fn()
      .mockResolvedValue({ caseId: '123', pk: 'case|123', sk: 'abc' });
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
      body: { caseId: { S: '123' }, pk: { S: 'case|123' }, sk: { S: 'abc' } },
      id: 'case|123_abc',
    });
    expect(deleteElasticsearchReindexRecordSpy).toHaveBeenCalled();
    expect(deleteElasticsearchReindexRecordSpy.mock.calls[0][0]).toMatchObject({
      recordPk: 'case|123',
      recordSk: 'abc',
    });
  });

  it('calls index function for a record, sees that its a case item, and retrieves the aggregated case', async () => {
    getElasticsearchReindexRecordsSpy.mockResolvedValue([
      { recordPk: 'case|123', recordSk: 'case|123' },
    ]);

    await reprocessFailedRecordsInteractor({
      applicationContext,
    });

    expect(indexSpy).toHaveBeenCalled();
    expect(indexSpy.mock.calls[0][0]).toMatchObject({
      body: {
        caseId: { S: 'case|123' },
      },
      id: 'case|123_case|123',
    });
    expect(getCaseByCaseIdSpy).toHaveBeenCalled();
    expect(getCaseByCaseIdSpy.mock.calls[0][0]).toMatchObject({
      caseId: '123',
    });
    expect(deleteElasticsearchReindexRecordSpy).toHaveBeenCalled();
    expect(deleteElasticsearchReindexRecordSpy.mock.calls[0][0]).toMatchObject({
      recordPk: 'case|123',
      recordSk: 'case|123',
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
