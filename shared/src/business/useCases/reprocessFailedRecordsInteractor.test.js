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
      .getCaseByCaseId.mockResolvedValue({
        caseId: 'case|123',
      });

    applicationContext.getPersistenceGateway().getRecord.mockResolvedValue({
      caseId: '123',
      pk: 'abc|123',
      sk: 'abc',
    });

    applicationContext
      .getPersistenceGateway()
      .indexRecord.mockReturnValue(null);

    applicationContext
      .getPersistenceGateway()
      .getIndexMappingLimit.mockReturnValue(20);

    applicationContext
      .getPersistenceGateway()
      .getIndexMappingFields.mockReturnValue({
        field1: {
          properties: {
            S: {
              type: 'text',
            },
          },
        },
        field2: {
          properties: {
            S: {
              type: 'text',
            },
          },
        },
        field3: {
          properties: {
            S: {
              type: 'text',
            },
          },
        },
        field4: {
          properties: {
            S: {
              type: 'text',
            },
          },
        },
        field5: {
          properties: {
            S: {
              type: 'text',
            },
          },
        },
      });
    applicationContext.initHoneybadger.mockReturnValue({ notify: notifySpy });
  });

  it('checks the current mapping count and notifies if it is at 50% of the limit', async () => {
    applicationContext
      .getPersistenceGateway()
      .getIndexMappingLimit.mockReturnValue(10);

    await reprocessFailedRecordsInteractor({
      applicationContext,
    });

    expect(notifySpy).toHaveBeenCalled();
    expect(notifySpy.mock.calls[0][0]).toContain('50% threshold');
  });

  it('checks the current mapping count and notifies if it is at 75% of the limit', async () => {
    applicationContext
      .getPersistenceGateway()
      .getIndexMappingLimit.mockReturnValue(6);

    await reprocessFailedRecordsInteractor({
      applicationContext,
    });

    expect(notifySpy).toHaveBeenCalled();
    expect(notifySpy.mock.calls[0][0]).toContain('75% threshold');
  });

  it('checks the current mapping count and notifies for fields over 50 matches', async () => {
    applicationContext
      .getPersistenceGateway()
      .getIndexMappingFields.mockReturnValue({
        field1: {
          properties: (() => {
            const fiftyOneProperties = {};
            for (let i = 0; i < 51; i++) {
              fiftyOneProperties[`prop_${i}`] = { type: 'text' };
            }
            return fiftyOneProperties;
          })(),
        },
      });

    await reprocessFailedRecordsInteractor({
      applicationContext,
    });

    expect(notifySpy).toHaveBeenCalled();
    expect(notifySpy.mock.calls[0][0]).toContain('greater than 50 indexes');
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
      caseId: '123',
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
      caseId: 'case|123',
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

  it('calls index function for a record, attempts to get a case by case id, but does not index if it does not return a full case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockResolvedValue({
        documents: [],
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
      caseId: '123',
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
