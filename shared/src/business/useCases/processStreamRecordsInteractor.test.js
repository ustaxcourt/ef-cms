const {
  bulkIndexRecords,
} = require('../../persistence/elasticsearch/bulkIndexRecords');
const {
  processStreamRecordsInteractor,
} = require('./processStreamRecordsInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { indexRecord } = require('../../persistence/elasticsearch/indexRecord');

describe('processStreamRecordsInteractor', () => {
  beforeAll(() => {
    applicationContext.getSearchClient().bulk.mockReturnValue({ body: {} });
    applicationContext.getPersistenceGateway().bulkIndexRecords = bulkIndexRecords;
    applicationContext.getPersistenceGateway().indexRecord = indexRecord;
  });

  it('does not call bulk function if recordsToProcess is an empty array', async () => {
    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [],
    });

    expect(applicationContext.getSearchClient().bulk).not.toHaveBeenCalled();
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

    expect(applicationContext.getSearchClient().bulk).not.toHaveBeenCalled();
  });

  it('calls bulk function with correct params only for records with eventName "INSERT" or "MODIFY" and filters out items that are not cases, documents, or useres', async () => {
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
              caseMetadata: { '101-19': { M: { manuallyAdded: true } } },
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
            Keys: { pk: { S: 'user|5' } },
            NewImage: {
              entityName: { S: 'User' },
              pk: { S: 'user|5' },
              sk: { S: 'user|5' },
              userId: { S: '5' },
            },
          },
          eventName: 'MODIFY',
        },
        {
          dynamodb: {
            Keys: { pk: { S: '6' } },
            NewImage: {
              documentId: { S: '6' },
              pk: { S: '6' },
              sk: { S: '6' },
              workItems: [
                {
                  blah: true,
                  documents: [{ documentId: '6' }],
                },
              ],
            },
          },
          eventName: 'MODIFY',
        },
      ],
    });

    expect(applicationContext.getSearchClient().bulk).toHaveBeenCalled();
    expect(
      applicationContext.getSearchClient().bulk.mock.calls[0][0].body.length,
    ).toEqual(4);
    expect(
      applicationContext.getSearchClient().bulk.mock.calls[0][0].body,
    ).toEqual([
      { index: { _id: '4_4', _index: 'efcms-case' } },
      {
        caseId: { S: '4' },
        entityName: { S: 'Case' },
        pk: { S: '4' },
        sk: { S: '4' },
      },
      { index: { _id: 'user|5_user|5', _index: 'efcms-user' } },
      {
        entityName: { S: 'User' },
        pk: { S: 'user|5' },
        sk: { S: 'user|5' },
        userId: { S: '5' },
      },
    ]);
  });

  it('calls index if bulk indexing fails', async () => {
    applicationContext.getSearchClient().bulk.mockImplementation(() => {
      throw new Error('bad!');
    });

    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [
        {
          dynamodb: {
            Keys: { pk: { S: '1' }, sk: { S: '2' } },
            NewImage: {
              caseId: { S: '1' },
              entityName: { S: 'Case' },
              pk: { S: '1' },
              sk: { S: '1' },
            },
          },
          eventName: 'INSERT',
        },
        {
          dynamodb: {
            Keys: { pk: { S: '3' }, sk: { S: '4' } },
            NewImage: {
              caseId: { S: '3' },
              entityName: { S: 'Case' },
              pk: { S: '3' },
              sk: { S: '3' },
            },
          },
          eventName: 'DELETE',
        },
      ],
    });

    expect(applicationContext.getSearchClient().index).toHaveBeenCalled();
    expect(
      applicationContext.getSearchClient().index.mock.calls[0][0],
    ).toMatchObject({
      body: { caseId: { S: '1' } },
    });
  });

  it('creates a reindex record if bulk and individual indexing both fail', async () => {
    applicationContext.getSearchClient().bulk.mockImplementation(() => {
      throw new Error('bad!');
    });
    applicationContext.getSearchClient().index.mockImplementation(() => {
      throw new Error('bad!');
    });

    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [
        {
          dynamodb: {
            Keys: { pk: { S: '1' }, sk: { S: '2' } },
            NewImage: {
              caseId: { S: '1' },
              entityName: { S: 'Case' },
              pk: { S: '1' },
              sk: { S: '1' },
            },
          },
          eventName: 'INSERT',
        },
      ],
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createElasticsearchReindexRecord,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .createElasticsearchReindexRecord.mock.calls[0][0],
    ).toMatchObject({
      recordPk: '1',
      recordSk: '2',
    });
  });

  it('attempts to reindex if bulk indexing returns error data', async () => {
    applicationContext.getSearchClient().bulk.mockResolvedValue({
      errors: true,
      items: [
        {
          index: {},
        },
        {
          index: {
            error: {
              reason: 'document missing',
              type: 'document_missing_exception',
            },
          },
        },
      ],
    });

    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [
        {
          dynamodb: {
            Keys: { pk: { S: '1' }, sk: { S: '2' } },
            NewImage: {
              caseId: { S: '1' },
              entityName: { S: 'Case' },
              pk: { S: '1' },
              sk: { S: '1' },
            },
          },
          eventName: 'INSERT',
        },
        {
          dynamodb: {
            Keys: { pk: { S: '2' }, sk: { S: '3' } },
            NewImage: {
              caseId: { S: '2' },
              entityName: { S: 'Case' },
              pk: { S: '2' },
              sk: { S: '2' },
            },
          },
          eventName: 'INSERT',
        },
      ],
    });

    expect(applicationContext.getSearchClient().index).toBeCalled();
    expect(
      applicationContext.getSearchClient().index.mock.calls[0][0],
    ).toMatchObject({ body: { caseId: { S: '2' } } });
  });

  it('creates a reindex record if bulk indexing returns error data and individual indexing fails', async () => {
    applicationContext.getSearchClient().bulk.mockResolvedValue({
      errors: true,
      items: [
        {
          index: { error: false },
        },
        {
          index: {
            error: {
              reason: 'document missing',
              type: 'document_missing_exception',
            },
          },
        },
      ],
    });
    applicationContext.getSearchClient().index.mockImplementation(() => {
      throw new Error('bad!');
    });

    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [
        {
          dynamodb: {
            Keys: { pk: { S: '1' }, sk: { S: '2' } },
            NewImage: {
              caseId: { S: '1' },
              entityName: { S: 'Case' },
              pk: { S: '1' },
              sk: { S: '2' },
            },
          },
          eventName: 'INSERT',
        },
        {
          dynamodb: {
            Keys: { pk: { S: '2' }, sk: { S: '3' } },
            NewImage: {
              caseId: { S: '2' },
              entityName: { S: 'Case' },
              pk: { S: '2' },
              sk: { S: '3' },
            },
          },
          eventName: 'INSERT',
        },
      ],
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createElasticsearchReindexRecord,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .createElasticsearchReindexRecord.mock.calls[0][0],
    ).toMatchObject({
      recordPk: '2',
      recordSk: '3',
    });
  });

  it('calls getCaseByCaseId to index an entire case item even if only a document record changes', async () => {
    applicationContext.getSearchClient().bulk.mockResolvedValue({
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
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockImplementation(({ caseId }) => ({
        caseId,
        documents: [{ documentId: '1' }],
        entityName: 'Case',
        pk: `case|${caseId}`,
        sk: `case|${caseId}`,
      }));

    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [
        {
          dynamodb: {
            Keys: { pk: { S: 'case|1' }, sk: { S: 'document|1' } },
            NewImage: {
              caseId: { S: '1' },
              entityName: { S: 'Document' },
              pk: { S: 'case|1' },
              sk: { S: 'document|1' },
            },
          },
          eventName: 'INSERT',
        },
        {
          dynamodb: {
            Keys: { pk: { S: 'case|4' }, sk: { S: 'case|4' } },
            NewImage: {
              caseId: { S: '4' },
              entityName: { S: 'Case' },
              pk: { S: 'case|4' },
              sk: { S: 'case|4' },
            },
          },
          eventName: 'MODIFY',
        },
      ],
    });

    expect(applicationContext.getSearchClient().bulk).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId.mock.calls,
    ).toMatchObject([[{ caseId: '1' }], [{ caseId: '4' }]]);
    expect(
      applicationContext.getSearchClient().bulk.mock.calls[0][0].body.length,
    ).toEqual(12);
    expect(
      applicationContext.getSearchClient().bulk.mock.calls[0][0].body,
    ).toEqual([
      { index: { _id: 'case|1_document|1', _index: 'efcms-document' } },
      {
        caseId: { S: '1' },
        entityName: { S: 'Document' },
        pk: { S: 'case|1' },
        sk: { S: 'document|1' },
      },
      { index: { _id: 'case|4_case|4', _index: 'efcms-case' } },
      {
        caseId: { S: '4' },
        entityName: { S: 'Case' },
        pk: { S: 'case|4' },
        sk: { S: 'case|4' },
      },
      { index: { _id: 'case|1_case|1', _index: 'efcms-case' } },
      {
        caseId: { S: '1' },
        documents: { L: [{ M: { documentId: { S: '1' } } }] },
        entityName: { S: 'Case' },
        pk: { S: 'case|1' },
        sk: { S: 'case|1' },
      },
      // calls documents again because they are indexed again after the case
      { index: { _id: 'case|1_document|1', _index: 'efcms-document' } },
      {
        caseId: { S: '1' },
        docketRecord: undefined,
        documentId: { S: '1' },
        documents: undefined,
        entityName: { S: 'Document' },
        irsPractitioners: undefined,
        pk: { S: 'case|1' },
        privatePractitioners: undefined,
        sk: { S: 'document|1' },
      },
      {
        index: { _id: 'case|4_case|4', _index: 'efcms-case' },
      },
      {
        caseId: { S: '4' },
        documents: { L: [{ M: { documentId: { S: '1' } } }] },
        entityName: { S: 'Case' },
        pk: { S: 'case|4' },
        sk: { S: 'case|4' },
      },
      { index: { _id: 'case|4_document|1', _index: 'efcms-document' } },
      {
        caseId: { S: '4' },
        docketRecord: undefined,
        documentId: { S: '1' },
        documents: undefined,
        entityName: { S: 'Document' },
        irsPractitioners: undefined,
        pk: { S: 'case|4' },
        privatePractitioners: undefined,
        sk: { S: 'document|1' },
      },
    ]);
  });

  it('calls getDocument to get documentContents if a document contains documentContentsId', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockImplementation(({ caseId }) => ({
        caseId,
        documents: [{ documentContentsId: '5', documentId: '1' }],
        entityName: 'Case',
        pk: `case|${caseId}`,
        sk: `case|${caseId}`,
      }));
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockReturnValue(
        Buffer.from(
          JSON.stringify({ documentContents: 'I am some document contents' }),
        ),
      );

    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [
        {
          dynamodb: {
            Keys: { pk: { S: 'case|1' }, sk: { S: 'document|1' } },
            NewImage: {
              caseId: { S: '1' },
              documentContentsId: { S: '5' },
              entityName: { S: 'Document' },
              pk: { S: 'case|1' },
              sk: { S: 'document|1' },
            },
          },
          eventName: 'INSERT',
        },
      ],
    });

    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getSearchClient().bulk.mock.calls[0][0].body,
    ).toEqual([
      { index: { _id: 'case|1_document|1', _index: 'efcms-document' } },
      {
        caseId: { S: '1' },
        documentContentsId: { S: '5' },
        entityName: { S: 'Document' },
        pk: { S: 'case|1' },
        sk: { S: 'document|1' },
      },
      { index: { _id: 'case|1_case|1', _index: 'efcms-case' } },
      {
        caseId: { S: '1' },
        documents: {
          L: [
            { M: { documentContentsId: { S: '5' }, documentId: { S: '1' } } },
          ],
        },
        entityName: { S: 'Case' },
        pk: { S: 'case|1' },
        sk: { S: 'case|1' },
      },
      // calls documents again because they are indexed again after the case
      { index: { _id: 'case|1_document|1', _index: 'efcms-document' } },
      {
        caseId: { S: '1' },
        docketRecord: undefined,
        documentContents: {
          S: 'I am some document contents',
        },
        documentContentsId: { S: '5' },
        documentId: { S: '1' },
        documents: undefined,
        entityName: { S: 'Document' },
        irsPractitioners: undefined,
        pk: { S: 'case|1' },
        privatePractitioners: undefined,
        sk: { S: 'document|1' },
      },
    ]);
  });

  it('does not attempt to index a case record if getCaseByCaseId does not return a case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue({ documents: [] });

    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [
        {
          dynamodb: {
            Keys: { pk: { S: 'case|1' }, sk: { S: 'document|1' } },
            NewImage: {
              caseId: { S: '1' },
              entityName: { S: 'Document' },
              pk: { S: 'case|1' },
              sk: { S: 'document|1' },
            },
          },
          eventName: 'MODIFY',
        },
      ],
    });

    expect(applicationContext.getSearchClient().bulk).toHaveBeenCalled();
    expect(
      applicationContext.getSearchClient().bulk.mock.calls[0][0].body.length,
    ).toEqual(2);
    expect(
      applicationContext.getSearchClient().bulk.mock.calls[0][0].body,
    ).toEqual([
      { index: { _id: 'case|1_document|1', _index: 'efcms-document' } },
      {
        caseId: { S: '1' },
        entityName: { S: 'Document' },
        pk: { S: 'case|1' },
        sk: { S: 'document|1' },
      },
    ]);
  });

  it('does not call getCaseByCaseId if there are no case records present in recordsToProcess', async () => {
    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [
        {
          dynamodb: {
            Keys: { pk: { S: 'user|1' }, sk: { S: 'user|1' } },
            NewImage: {
              entityName: { S: 'User' },
              pk: { S: 'user|1' },
              sk: { S: 'user|1' },
              userId: { S: '1' },
            },
          },
          eventName: 'MODIFY',
        },
      ],
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
    ).not.toBeCalled();
    expect(applicationContext.getSearchClient().bulk).toHaveBeenCalled();
    expect(
      applicationContext.getSearchClient().bulk.mock.calls[0][0].body.length,
    ).toEqual(2);
    expect(
      applicationContext.getSearchClient().bulk.mock.calls[0][0].body,
    ).toEqual([
      { index: { _id: 'user|1_user|1', _index: 'efcms-user' } },
      {
        entityName: { S: 'User' },
        pk: { S: 'user|1' },
        sk: { S: 'user|1' },
        userId: { S: '1' },
      },
    ]);
  });
});
