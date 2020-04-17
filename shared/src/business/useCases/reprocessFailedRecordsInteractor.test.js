const {
  reprocessFailedRecordsInteractor,
} = require('./reprocessFailedRecordsInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('reprocessFailedRecordsInteractor', () => {
  beforeEach(() => {
    applicationContext.environment.stage = 'local';

    applicationContext
      .getPersistenceGateway()
      .getElasticsearchReindexRecords.mockResolvedValue([
        { recordPk: 'case|123', recordSk: 'abc' },
      ]);

    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockResolvedValue({
        caseId: 'case|123',
      });

    applicationContext.getPersistenceGateway().getRecord.mockResolvedValue({
      caseId: '123',
      pk: 'case|123',
      sk: 'abc',
    });
  });

  it('does not call index function if there are no records to process', async () => {
    applicationContext
      .getPersistenceGateway()
      .getElasticsearchReindexRecords.mockResolvedValue([]);

    await reprocessFailedRecordsInteractor({
      applicationContext,
    });

    expect(applicationContext.getSearchClient().index).not.toHaveBeenCalled();
  });

  it('calls index function for a record, then deletes the record', async () => {
    await reprocessFailedRecordsInteractor({
      applicationContext,
    });

    expect(applicationContext.getSearchClient().index).toHaveBeenCalled();
    expect(
      applicationContext.getSearchClient().index.mock.calls[0][0],
    ).toMatchObject({
      body: { caseId: { S: '123' }, pk: { S: 'case|123' }, sk: { S: 'abc' } },
      id: 'case|123_abc',
    });
    expect(
      applicationContext.getPersistenceGateway()
        .deleteElasticsearchReindexRecord,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .deleteElasticsearchReindexRecord.mock.calls[0][0],
    ).toMatchObject({
      recordPk: 'case|123',
      recordSk: 'abc',
    });
  });

  it('calls index function for a record, sees that its a case item, and retrieves the aggregated case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getElasticsearchReindexRecords.mockResolvedValue([
        { recordPk: 'case|123', recordSk: 'case|123' },
      ]);

    await reprocessFailedRecordsInteractor({
      applicationContext,
    });

    expect(applicationContext.getSearchClient().index).toHaveBeenCalled();
    expect(
      applicationContext.getSearchClient().index.mock.calls[0][0],
    ).toMatchObject({
      body: {
        caseId: { S: 'case|123' },
      },
      id: 'case|123_case|123',
    });
    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId.mock
        .calls[0][0],
    ).toMatchObject({
      caseId: '123',
    });
    expect(
      applicationContext.getPersistenceGateway()
        .deleteElasticsearchReindexRecord,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .deleteElasticsearchReindexRecord.mock.calls[0][0],
    ).toMatchObject({
      recordPk: 'case|123',
      recordSk: 'case|123',
    });
  });

  it('catches an error with indexing and does not delete the record', async () => {
    applicationContext.getSearchClient().index.mockImplementation(() => {
      throw new Error('oh no');
    });

    await reprocessFailedRecordsInteractor({
      applicationContext,
    });

    expect(applicationContext.getSearchClient().index).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .deleteElasticsearchReindexRecord,
    ).not.toHaveBeenCalled();
  });
});
