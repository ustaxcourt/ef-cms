const {
  reprocessFailedRecordsInteractor,
} = require('./reprocessFailedRecordsInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('reprocessFailedRecordsInteractor', () => {
  const notifySpy = jest.fn();

  beforeEach(() => {
    applicationContext.environment.stage = 'local';

    applicationContext
      .getPersistenceGateway()
      .getElasticsearchReindexRecords.mockResolvedValue([
        { recordPk: 'abc|123', recordSk: 'abc' },
      ]);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue({
        docketNumber: 'case|123',
      });

    applicationContext.getPersistenceGateway().getRecord.mockResolvedValue({
      docketNumber: '123',
      pk: 'abc|123',
      sk: 'abc',
    });

    applicationContext
      .getPersistenceGateway()
      .indexRecord.mockReturnValue(null);

    applicationContext.notifyHoneybadger.mockImplementation(notifySpy);
  });

  it('does not call index function if there are no records to process', async () => {
    applicationContext
      .getPersistenceGateway()
      .getElasticsearchReindexRecords.mockResolvedValue([]);

    await reprocessFailedRecordsInteractor({
      applicationContext,
    });

    expect(
      applicationContext.getPersistenceGateway().indexRecord,
    ).not.toHaveBeenCalled();
  });

  it('calls index function for a non-case record, then deletes the record', async () => {
    await reprocessFailedRecordsInteractor({
      applicationContext,
    });

    expect(
      applicationContext.getPersistenceGateway().indexRecord,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().indexRecord.mock.calls[0][0]
        .fullRecord,
    ).toMatchObject({
      docketNumber: '123',
      pk: 'abc|123',
      sk: 'abc',
    });
    expect(
      applicationContext.getPersistenceGateway()
        .deleteElasticsearchReindexRecord,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .deleteElasticsearchReindexRecord.mock.calls[0][0],
    ).toMatchObject({
      recordPk: 'abc|123',
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

    expect(
      applicationContext.getPersistenceGateway().indexRecord,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().indexRecord.mock.calls[0][0]
        .fullRecord,
    ).toMatchObject({
      docketNumber: 'case|123',
    });
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0],
    ).toMatchObject({
      docketNumber: '123',
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

  it('calls index function for a record, attempts to get a case by case id, but does not index if it does not return a full case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue({
        docketEntries: [],
      });

    applicationContext
      .getPersistenceGateway()
      .getElasticsearchReindexRecords.mockResolvedValue([
        { recordPk: 'case|123', recordSk: 'case|123' },
      ]);

    await reprocessFailedRecordsInteractor({
      applicationContext,
    });

    expect(
      applicationContext.getPersistenceGateway().indexRecord,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().indexRecord.mock.calls[0][0]
        .fullRecord,
    ).toMatchObject({
      docketNumber: '123',
    });
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0],
    ).toMatchObject({
      docketNumber: '123',
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
    applicationContext
      .getPersistenceGateway()
      .indexRecord.mockImplementation(() => {
        throw new Error('oh no');
      });

    await reprocessFailedRecordsInteractor({
      applicationContext,
    });

    expect(
      applicationContext.getPersistenceGateway().indexRecord,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .deleteElasticsearchReindexRecord,
    ).not.toHaveBeenCalled();
  });
});
