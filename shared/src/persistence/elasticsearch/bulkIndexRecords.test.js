const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { bulkIndexRecords } = require('./bulkIndexRecords');

describe('bulkIndexRecords', () => {
  const newImageRecord = {
    caseId: { S: '6f3d97f8-1bdd-4779-a150-c076d08ad8fd' },
    caseStatus: { S: 'New' },
    createdAt: { S: '2020-06-10T15:10:23.553Z' },
    docketNumber: { S: '105-19' },
    docketNumberWithSuffix: { S: '105-19' },
    entityName: { S: 'CaseMessage' },
    from: { S: 'Test Docketclerk' },
    fromSection: { S: 'docket' },
    fromUserId: { S: '1805d1ab-18d0-43ec-bafb-654e83405416' },
    gsi1pk: { S: 'message|2e30ecc2-3818-4855-ad3f-4a3ce8d29767' },
    message: { S: 'D' },
    messageId: { S: '2e30ecc2-3818-4855-ad3f-4a3ce8d29767' },
    pk: { S: 'case|6f3d97f8-1bdd-4779-a150-c076d08ad8fd' },
    sk: { S: 'message|2e30ecc2-3818-4855-ad3f-4a3ce8d29767' },
    subject: { S: 'S' },
    to: { S: 'Test Docketclerk' },
    toSection: { S: 'docket' },
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
});
