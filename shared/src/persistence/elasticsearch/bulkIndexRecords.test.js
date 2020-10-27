const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  DOCKET_SECTION,
} = require('../../business/entities/EntityConstants');
const { bulkIndexRecords } = require('./bulkIndexRecords');

describe('bulkIndexRecords', () => {
  const newImageRecord = {
    caseStatus: { S: CASE_STATUS_TYPES.new },
    createdAt: { S: '2020-06-10T15:10:23.553Z' },
    docketNumber: { S: '105-19' },
    docketNumberWithSuffix: { S: '105-19' },
    entityName: { S: 'Message' },
    from: { S: 'Test Docketclerk' },
    fromSection: { S: DOCKET_SECTION },
    fromUserId: { S: '1805d1ab-18d0-43ec-bafb-654e83405416' },
    gsi1pk: { S: 'message|2e30ecc2-3818-4855-ad3f-4a3ce8d29767' },
    message: { S: 'D' },
    messageId: { S: '2e30ecc2-3818-4855-ad3f-4a3ce8d29767' },
    pk: { S: 'case|6f3d97f8-1bdd-4779-a150-c076d08ad8fd' },
    sk: { S: 'message|2e30ecc2-3818-4855-ad3f-4a3ce8d29767' },
    subject: { S: 'S' },
    to: { S: 'Test Docketclerk' },
    toSection: { S: DOCKET_SECTION },
    toUserId: { S: '1805d1ab-18d0-43ec-bafb-654e83405416' },
  };

  const records = [
    {
      dynamodb: {
        NewImage: newImageRecord,
      },
    },
  ];

  it('returns no failed records if the bulk call is successful', async () => {
    applicationContext.getSearchClient().bulk.mockReturnValue({
      errors: false,
      items: [{}],
      took: 100,
    });

    const result = await bulkIndexRecords({
      applicationContext,
      records: records,
    });
    expect(result.failedRecords).toEqual([]);
  });

  it('returns failed records if the bulk call is unsuccessful', async () => {
    applicationContext.getSearchClient().bulk.mockReturnValue({
      errors: true,
      items: [
        {
          index: {
            _index: 'efcms-message',
            error: {
              index: 'efcms-message',
              index_uuid: 'aAsFqTI0Tc2W0LCWgPNrOA',
              reason: 'document missing',
              shard: '0',
              type: 'document_missing_exception',
            },
            status: 404,
          },
        },
      ],
      took: 100,
    });

    const result = await bulkIndexRecords({
      applicationContext,
      records: records,
    });

    expect(result.failedRecords).toEqual([newImageRecord]);
  });

  it('uses the routing parameter when the item is a DocketEntry', async () => {
    applicationContext.getSearchClient.mockReturnValue({
      bulk: jest.fn().mockReturnValue({
        errors: false,
        items: [{}],
        took: 100,
      }),
    });

    await bulkIndexRecords({
      applicationContext,
      records: [
        {
          dynamodb: {
            NewImage: {
              entityName: { S: 'DocketEntry' },
              pk: { S: 'case|123-45' },
              sk: { S: 'docket-entry|8675309' },
            },
          },
        },
      ],
    });

    expect(applicationContext.getSearchClient().bulk).toHaveBeenCalledWith({
      body: [
        {
          index: {
            _id: 'case|123-45_docket-entry|8675309',
            _index: 'efcms-docket-entry',
            routing: 'case|123-45_case|123-45|mapping',
          },
        },
        {
          entityName: {
            S: 'DocketEntry',
          },
          pk: {
            S: 'case|123-45',
          },
          sk: {
            S: 'docket-entry|8675309',
          },
        },
      ],
      refresh: false,
    });
  });

  it('sets an altered _id if the item is a CaseDocketEntryMapping', async () => {
    applicationContext.getSearchClient.mockReturnValue({
      bulk: jest.fn().mockReturnValue({
        errors: false,
        items: [{}],
        took: 100,
      }),
    });

    await bulkIndexRecords({
      applicationContext,
      records: [
        {
          dynamodb: {
            NewImage: {
              entityName: { S: 'CaseDocketEntryMapping' },
              pk: { S: 'case|123-45' },
              sk: { S: 'case|123-45' },
            },
          },
        },
      ],
    });

    expect(applicationContext.getSearchClient().bulk).toHaveBeenCalledWith({
      body: [
        {
          index: {
            _id: 'case|123-45_case|123-45|mapping',
            _index: 'efcms-docket-entry',
            routing: null,
          },
        },
        {
          entityName: {
            S: 'CaseDocketEntryMapping',
          },
          pk: {
            S: 'case|123-45',
          },
          sk: {
            S: 'case|123-45',
          },
        },
      ],
      refresh: false,
    });
  });
});
