const {
  processStreamRecordsInteractor,
} = require('./processStreamRecordsInteractor');

describe('processStreamRecordsInteractor', () => {
  let bulkSpy = jest.fn().mockReturnValue({ body: {} });
  let indexSpy = jest.fn();
  const createElasticsearchReindexRecordSpy = jest.fn();

  const applicationContext = {
    environment: { stage: 'local' },
    getPersistenceGateway: () => ({
      createElasticsearchReindexRecord: createElasticsearchReindexRecordSpy,
    }),
    getSearchClient: () => ({
      bulk: bulkSpy,
      index: indexSpy,
    }),
    logger: {
      info: () => {},
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not call bulk function if recordsToProcess is an empty array', async () => {
    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [],
    });

    expect(bulkSpy).not.toHaveBeenCalled();
  });

  it('does not call bulk function if recordsToProcess only contains workitems', async () => {
    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [
        {
          dynamodb: {
            Keys: { pk: { S: 'workitem-123' } },
            NewImage: { caseId: { S: '4' } },
          },
          eventName: 'MODIFY',
        },
      ],
    });

    expect(bulkSpy).not.toHaveBeenCalled();
  });

  it('calls bulk function with correct params only for records with eventName "INSERT" or "MODIFY" and filters out workitem and user records', async () => {
    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [
        {
          dynamodb: {
            Keys: { pk: { S: '1' } },
            NewImage: { caseId: { S: '1' }, pk: { S: '1' } },
          },
          eventName: 'INSERT',
        },
        {
          dynamodb: {
            Keys: { pk: { S: '2' } },
            NewImage: { caseId: { S: '2' }, pk: { S: '2' } },
          },
          eventName: 'NOTINSERT',
        },
        {
          dynamodb: {
            Keys: { pk: { S: '3' } },
            NewImage: { caseId: { S: '3' }, pk: { S: '3' } },
          },
          eventName: 'INSERT',
        },
        {
          dynamodb: {
            Keys: { pk: { S: '4' } },
            NewImage: { caseId: { S: '4' }, pk: { S: '4' } },
          },
          eventName: 'MODIFY',
        },
        {
          dynamodb: {
            Keys: { pk: { S: 'workitem-123' } },
            NewImage: { caseId: { S: '4' }, pk: { S: 'workitem-123' } },
          },
          eventName: 'MODIFY',
        },
        {
          dynamodb: {
            Keys: { pk: { S: '123|user' } },
            NewImage: { caseId: { S: '4' }, pk: { S: '123|user' } },
          },
          eventName: 'MODIFY',
        },
      ],
    });

    expect(bulkSpy).toHaveBeenCalled();
    expect(bulkSpy.mock.calls[0][0].body.length).toEqual(6);
    expect(bulkSpy.mock.calls[0][0].body).toEqual([
      { index: { _id: '1', _index: 'efcms' } },
      { caseId: { S: '1' }, pk: { S: '1' } },
      { index: { _id: '3', _index: 'efcms' } },
      { caseId: { S: '3' }, pk: { S: '3' } },
      { index: { _id: '4', _index: 'efcms' } },
      { caseId: { S: '4' }, pk: { S: '4' } },
    ]);
  });

  it('calls index if bulk indexing fails', async () => {
    bulkSpy = jest.fn().mockImplementation(() => {
      throw new Error('bad!');
    });

    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [
        {
          dynamodb: {
            Keys: { pk: { S: '1' }, sk: { S: '2' } },
            NewImage: { caseId: { S: '1' }, pk: { S: '1' } },
          },
          eventName: 'INSERT',
        },
      ],
    });

    expect(indexSpy).toHaveBeenCalled();
    expect(indexSpy.mock.calls[0][0]).toMatchObject({
      body: { caseId: { S: '1' } },
    });
  });

  it('creates a reindex record if bulk and individual indexing both fail', async () => {
    bulkSpy = jest.fn().mockImplementation(() => {
      throw new Error('bad!');
    });
    indexSpy = jest.fn().mockImplementation(() => {
      throw new Error('bad!');
    });

    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [
        {
          dynamodb: {
            Keys: { pk: { S: '1' }, sk: { S: '2' } },
            NewImage: { caseId: { S: '1' }, pk: { S: '1' } },
          },
          eventName: 'INSERT',
        },
      ],
    });

    expect(createElasticsearchReindexRecordSpy).toHaveBeenCalled();
    expect(createElasticsearchReindexRecordSpy.mock.calls[0][0]).toMatchObject({
      recordPk: '1',
      recordSk: '2',
    });
  });
});
