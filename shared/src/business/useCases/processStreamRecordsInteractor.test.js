const {
  processStreamRecordsInteractor,
} = require('./processStreamRecordsInteractor');

describe('processStreamRecordsInteractor', () => {
  let bulkSpy;
  let indexSpy;
  const createElasticsearchReindexRecordSpy = jest.fn();

  let applicationContext;

  beforeEach(() => {
    jest.clearAllMocks();

    bulkSpy = jest.fn().mockReturnValue({ body: {} });
    indexSpy = jest.fn();

    applicationContext = {
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
            Keys: { pk: { S: 'work-item|123' } },
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
            NewImage: { caseId: { S: '1' }, pk: { S: '1' }, sk: { S: '1' } },
          },
          eventName: 'INSERT',
        },
        {
          dynamodb: {
            Keys: { pk: { S: '2' } },
            NewImage: { caseId: { S: '2' }, pk: { S: '2' }, sk: { S: '2' } },
          },
          eventName: 'NOTINSERT',
        },
        {
          dynamodb: {
            Keys: { pk: { S: '3' } },
            NewImage: { caseId: { S: '3' }, pk: { S: '3' }, sk: { S: '3' } },
          },
          eventName: 'INSERT',
        },
        {
          dynamodb: {
            Keys: { pk: { S: '4' } },
            NewImage: {
              caseId: { S: '4' },
              entityName: { S: 'Case' },
              pk: { S: '4' },
              qcCompleteForTrial: { '123': true, '234': true },
              sk: { S: '4' },
            },
          },
          eventName: 'MODIFY',
        },
        {
          dynamodb: {
            Keys: { pk: { S: 'work-item|123' } },
            NewImage: {
              caseId: { S: '4' },
              pk: { S: 'work-item|123' },
              sk: { S: 'work-item|123' },
            },
          },
          eventName: 'MODIFY',
        },
        {
          dynamodb: {
            Keys: { pk: { S: 'user|123' } },
            NewImage: {
              caseId: { S: '4' },
              pk: { S: 'user|123' },
              sk: { S: 'user|123' },
            },
          },
          eventName: 'MODIFY',
        },
        {
          dynamodb: {
            Keys: { pk: { S: '5' } },
            NewImage: {
              documentId: { S: '5' },
              pk: { S: '5' },
              sk: { S: '5' },
              workItems: [
                {
                  blah: true,
                  documents: [{ documentId: '5' }],
                },
              ],
            },
          },
          eventName: 'MODIFY',
        },
      ],
    });

    expect(bulkSpy).toHaveBeenCalled();
    expect(bulkSpy.mock.calls[0][0].body.length).toEqual(8);
    expect(bulkSpy.mock.calls[0][0].body).toEqual([
      { index: { _id: '1_1', _index: 'efcms' } },
      { caseId: { S: '1' }, pk: { S: '1' }, sk: { S: '1' } },
      { index: { _id: '3_3', _index: 'efcms' } },
      { caseId: { S: '3' }, pk: { S: '3' }, sk: { S: '3' } },
      { index: { _id: '4_4', _index: 'efcms' } },
      {
        caseId: { S: '4' },
        entityName: { S: 'Case' },
        pk: { S: '4' },
        sk: { S: '4' },
      },
      { index: { _id: '5_5', _index: 'efcms' } },
      { documentId: { S: '5' }, pk: { S: '5' }, sk: { S: '5' } },
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
            NewImage: { caseId: { S: '1' }, pk: { S: '1' }, sk: { S: '1' } },
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
            NewImage: { caseId: { S: '1' }, pk: { S: '1' }, sk: { S: '1' } },
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

  it('attempts to reindex if bulk indexing returns error data', async () => {
    bulkSpy = jest.fn().mockResolvedValue({
      body: {
        errors: [{ badError: true }],
        items: [
          {
            index: { error: false },
          },
          {
            index: { error: true },
          },
        ],
      },
    });

    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [
        {
          dynamodb: {
            Keys: { pk: { S: '1' }, sk: { S: '2' } },
            NewImage: { caseId: { S: '1' }, pk: { S: '1' }, sk: { S: '1' } },
          },
          eventName: 'INSERT',
        },
        {
          dynamodb: {
            Keys: { pk: { S: '2' }, sk: { S: '3' } },
            NewImage: { caseId: { S: '2' }, pk: { S: '2' }, sk: { S: '2' } },
          },
          eventName: 'INSERT',
        },
      ],
    });

    expect(indexSpy).toBeCalled();
    expect(indexSpy.mock.calls[0][0]).toMatchObject({
      body: { caseId: { S: '2' } },
    });
  });

  it('creates a reindex record if bulk indexing returns error data and individual indexing fails', async () => {
    bulkSpy = jest.fn().mockResolvedValue({
      body: {
        errors: [{ badError: true }],
        items: [
          {
            index: { error: false },
          },
          {
            index: { error: true },
          },
        ],
      },
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
            NewImage: { caseId: { S: '1' }, pk: { S: '1' }, sk: { S: '2' } },
          },
          eventName: 'INSERT',
        },
        {
          dynamodb: {
            Keys: { pk: { S: '2' }, sk: { S: '3' } },
            NewImage: { caseId: { S: '2' }, pk: { S: '2' }, sk: { S: '3' } },
          },
          eventName: 'INSERT',
        },
      ],
    });

    expect(createElasticsearchReindexRecordSpy).toHaveBeenCalled();
    expect(createElasticsearchReindexRecordSpy.mock.calls[0][0]).toMatchObject({
      recordPk: '2',
      recordSk: '3',
    });
  });
});
