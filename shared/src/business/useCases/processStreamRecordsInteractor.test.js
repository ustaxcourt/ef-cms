const {
  processStreamRecordsInteractor,
} = require('./processStreamRecordsInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('processStreamRecordsInteractor', () => {
  beforeAll(() => {
    applicationContext.getSearchClient().bulk.mockReturnValue({ body: {} });
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
            NewImage: { docketNumber: { S: '4' } },
          },
          eventName: 'MODIFY',
        },
      ],
    });

    expect(applicationContext.getSearchClient().bulk).not.toHaveBeenCalled();
  });

  it('calls bulk function with correct params only for records with eventName "INSERT" or "MODIFY" and filters out items that are not cases, docketEntries, or users', async () => {
    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [
        {
          dynamodb: {
            Keys: { pk: { S: '1' } },
            NewImage: {
              docketNumber: { S: '1' },
              pk: { S: '1' },
              sk: { S: '1' },
            },
          },
          eventName: 'INSERT',
        },
        {
          dynamodb: {
            Keys: { pk: { S: '2' } },
            NewImage: {
              docketNumber: { S: '2' },
              pk: { S: '2' },
              sk: { S: '2' },
            },
          },
          eventName: 'NOTINSERT',
        },
        {
          dynamodb: {
            Keys: { pk: { S: '3' } },
            NewImage: {
              docketNumber: { S: '3' },
              pk: { S: '3' },
              sk: { S: '3' },
            },
          },
          eventName: 'INSERT',
        },
        {
          dynamodb: {
            Keys: { pk: { S: '4' } },
            NewImage: {
              docketNumber: { S: '4' },
              entityName: { S: 'Case' },
              pk: { S: '4' },
              sk: { S: '4' },
            },
          },
          eventName: 'MODIFY',
        },
        {
          dynamodb: {
            Keys: { pk: { S: 'work-item|123' } },
            NewImage: {
              docketNumber: { S: '4' },
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
              docketEntryId: { S: '6' },
              pk: { S: '6' },
              sk: { S: '6' },
              workItem: {
                blah: true,
                docketEntries: [{ docketEntryId: '6' }],
              },
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
        docketNumber: { S: '4' },
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
              docketNumber: { S: '1' },
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
              docketNumber: { S: '3' },
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
      body: { docketNumber: { S: '1' } },
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
              docketNumber: { S: '1' },
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
              docketNumber: { S: '1' },
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
              docketNumber: { S: '2' },
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
    ).toMatchObject({ body: { docketNumber: { S: '2' } } });
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
              docketNumber: { S: '1' },
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
              docketNumber: { S: '2' },
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

  it('calls getCaseByDocketNumber to index an entire case item even if only a document record changes', async () => {
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
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => ({
        docketEntries: [{ docketEntryId: '1' }],
        docketNumber,
        entityName: 'Case',
        pk: `case|${docketNumber}`,
        sk: `case|${docketNumber}`,
      }));

    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [
        {
          dynamodb: {
            Keys: { pk: { S: 'case|1' }, sk: { S: 'docket-entry|1' } },
            NewImage: {
              docketNumber: { S: '1' },
              entityName: { S: 'DocketEntry' },
              pk: { S: 'case|1' },
              sk: { S: 'docket-entry|1' },
            },
          },
          eventName: 'INSERT',
        },
        {
          dynamodb: {
            Keys: { pk: { S: 'case|4' }, sk: { S: 'case|4' } },
            NewImage: {
              docketNumber: { S: '4' },
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
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls,
    ).toMatchObject([[{ docketNumber: '1' }], [{ docketNumber: '4' }]]);
    expect(
      applicationContext.getSearchClient().bulk.mock.calls[0][0].body.length,
    ).toEqual(12);
    expect(
      applicationContext.getSearchClient().bulk.mock.calls[0][0].body,
    ).toEqual([
      { index: { _id: 'case|1_docket-entry|1', _index: 'efcms-docket-entry' } },
      {
        docketNumber: { S: '1' },
        entityName: { S: 'DocketEntry' },
        pk: { S: 'case|1' },
        sk: { S: 'docket-entry|1' },
      },
      { index: { _id: 'case|4_case|4', _index: 'efcms-case' } },
      {
        docketNumber: { S: '4' },
        entityName: { S: 'Case' },
        pk: { S: 'case|4' },
        sk: { S: 'case|4' },
      },
      { index: { _id: 'case|1_case|1', _index: 'efcms-case' } },
      {
        docketEntries: { L: [{ M: { docketEntryId: { S: '1' } } }] },
        docketNumber: { S: '1' },
        entityName: { S: 'Case' },
        pk: { S: 'case|1' },
        sk: { S: 'case|1' },
      },
      // calls documents again because they are indexed again after the case
      { index: { _id: 'case|1_docket-entry|1', _index: 'efcms-docket-entry' } },
      {
        docketEntries: undefined,
        docketEntryId: { S: '1' },
        docketNumber: { S: '1' },
        entityName: { S: 'DocketEntry' },
        irsPractitioners: undefined,
        pk: { S: 'case|1' },
        privatePractitioners: undefined,
        sk: { S: 'docket-entry|1' },
      },
      {
        index: { _id: 'case|4_case|4', _index: 'efcms-case' },
      },
      {
        docketEntries: { L: [{ M: { docketEntryId: { S: '1' } } }] },
        docketNumber: { S: '4' },
        entityName: { S: 'Case' },
        pk: { S: 'case|4' },
        sk: { S: 'case|4' },
      },
      { index: { _id: 'case|4_docket-entry|1', _index: 'efcms-docket-entry' } },
      {
        docketEntries: undefined,
        docketEntryId: { S: '1' },
        docketNumber: { S: '4' },
        entityName: { S: 'DocketEntry' },
        irsPractitioners: undefined,
        pk: { S: 'case|4' },
        privatePractitioners: undefined,
        sk: { S: 'docket-entry|1' },
      },
    ]);
  });

  it('calls getDocument to get documentContents if a document contains documentContentsId', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => ({
        docketEntries: [{ docketEntryId: '1', documentContentsId: '5' }],
        docketNumber,
        entityName: 'Case',
        pk: `case|${docketNumber}`,
        sk: `case|${docketNumber}`,
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
            Keys: { pk: { S: 'case|1' }, sk: { S: 'docket-entry|1' } },
            NewImage: {
              docketNumber: { S: '1' },
              documentContentsId: { S: '5' },
              entityName: { S: 'DocketEntry' },
              pk: { S: 'case|1' },
              sk: { S: 'docket-entry|1' },
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
      { index: { _id: 'case|1_docket-entry|1', _index: 'efcms-docket-entry' } },
      {
        docketNumber: { S: '1' },
        documentContentsId: { S: '5' },
        entityName: { S: 'DocketEntry' },
        pk: { S: 'case|1' },
        sk: { S: 'docket-entry|1' },
      },
      { index: { _id: 'case|1_case|1', _index: 'efcms-case' } },
      {
        docketEntries: {
          L: [
            {
              M: { docketEntryId: { S: '1' }, documentContentsId: { S: '5' } },
            },
          ],
        },
        docketNumber: { S: '1' },
        entityName: { S: 'Case' },
        pk: { S: 'case|1' },
        sk: { S: 'case|1' },
      },
      // calls documents again because they are indexed again after the case
      { index: { _id: 'case|1_docket-entry|1', _index: 'efcms-docket-entry' } },
      {
        docketEntries: undefined,
        docketEntryId: { S: '1' },
        docketNumber: { S: '1' },
        documentContents: {
          S: 'I am some document contents',
        },
        documentContentsId: { S: '5' },
        entityName: { S: 'DocketEntry' },
        irsPractitioners: undefined,
        pk: { S: 'case|1' },
        privatePractitioners: undefined,
        sk: { S: 'docket-entry|1' },
      },
    ]);
  });

  it('does not attempt to index a case record if getCaseByDocketNumber does not return a case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({ docketEntries: [] });

    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [
        {
          dynamodb: {
            Keys: { pk: { S: 'case|1' }, sk: { S: 'docket-entry|1' } },
            NewImage: {
              docketNumber: { S: '1' },
              entityName: { S: 'DocketEntry' },
              pk: { S: 'case|1' },
              sk: { S: 'docket-entry|1' },
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
      { index: { _id: 'case|1_docket-entry|1', _index: 'efcms-docket-entry' } },
      {
        docketNumber: { S: '1' },
        entityName: { S: 'DocketEntry' },
        pk: { S: 'case|1' },
        sk: { S: 'docket-entry|1' },
      },
    ]);
  });

  it('does not call getCaseByDocketNumber if there are no case records present in recordsToProcess', async () => {
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
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
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

  it('calls bulk delete function with correct params only for records with eventName "REMOVE"', async () => {
    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [
        {
          dynamodb: {
            Keys: { pk: { S: '1' } },
            OldImage: {
              docketNumber: { S: '1' },
              entityName: { S: 'Case' },
              pk: { S: '1' },
              sk: { S: '1' },
            },
          },
          eventName: 'REMOVE',
        },
      ],
    });

    expect(applicationContext.getSearchClient().bulk).toHaveBeenCalled();
    expect(
      applicationContext.getSearchClient().bulk.mock.calls[0][0].body.length,
    ).toEqual(1);
    expect(
      applicationContext.getSearchClient().bulk.mock.calls[0][0].body,
    ).toEqual([{ delete: { _id: '1_1', _index: 'efcms-case' } }]);
  });

  it('calls delete function for failed records from bulkDelete', async () => {
    applicationContext.getSearchClient().bulk.mockResolvedValue({
      errors: [{ badError: true }],
      items: [
        {
          delete: { error: false },
        },
        {
          delete: { error: true },
        },
      ],
    });

    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [
        {
          dynamodb: {
            Keys: { pk: { S: '1' } },
            OldImage: {
              docketNumber: { S: '1' },
              entityName: { S: 'Case' },
              pk: { S: '1' },
              sk: { S: '1' },
            },
          },
          eventName: 'REMOVE',
        },
        {
          dynamodb: {
            Keys: { pk: { S: '2' } },
            OldImage: {
              docketNumber: { S: '2' },
              entityName: { S: 'Case' },
              pk: { S: '2' },
              sk: { S: '2' },
            },
          },
          eventName: 'REMOVE',
        },
      ],
    });

    expect(applicationContext.getSearchClient().delete).toBeCalledTimes(1);
    expect(
      applicationContext.getSearchClient().delete.mock.calls[0][0],
    ).toMatchObject({ id: '2_2', index: 'efcms-case' });
  });

  it('logs error if bulk delete throws an error', async () => {
    const error = new Error('bad!');
    applicationContext.getSearchClient().bulk.mockImplementation(() => {
      throw error;
    });

    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [
        {
          dynamodb: {
            Keys: { pk: { S: '1' } },
            OldImage: {
              docketNumber: { S: '1' },
              entityName: { S: 'Case' },
              pk: { S: '1' },
              sk: { S: '1' },
            },
          },
          eventName: 'REMOVE',
        },
      ],
    });

    expect(applicationContext.notifyHoneybadger).toBeCalledTimes(1);
    expect(applicationContext.notifyHoneybadger.mock.calls[0][0]).toEqual(
      error,
    );
  });

  it('logs error if deleteRecord throws an error', async () => {
    applicationContext.getSearchClient().bulk.mockResolvedValue({
      errors: [{ badError: true }],
      items: [
        {
          delete: { error: false },
        },
        {
          delete: { error: true },
        },
      ],
    });
    const error = new Error('bad!');
    applicationContext.getSearchClient().delete.mockImplementation(() => {
      throw error;
    });

    await processStreamRecordsInteractor({
      applicationContext,
      recordsToProcess: [
        {
          dynamodb: {
            Keys: { pk: { S: '1' } },
            OldImage: {
              docketNumber: { S: '1' },
              entityName: { S: 'Case' },
              pk: { S: '1' },
              sk: { S: '1' },
            },
          },
          eventName: 'REMOVE',
        },
        {
          dynamodb: {
            Keys: { pk: { S: '2' } },
            OldImage: {
              docketNumber: { S: '2' },
              entityName: { S: 'Case' },
              pk: { S: '2' },
              sk: { S: '2' },
            },
          },
          eventName: 'REMOVE',
        },
      ],
    });

    expect(applicationContext.notifyHoneybadger).toBeCalledTimes(1);
    expect(applicationContext.notifyHoneybadger.mock.calls[0][0]).toEqual(
      error,
    );
  });
});
