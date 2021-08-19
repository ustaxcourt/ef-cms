const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  updateDocketEntryPendingServiceStatus,
} = require('./updateDocketEntryPendingServiceStatus');

describe('updateDocketEntryPendingServiceStatus', () => {
  beforeAll(() => {
    applicationContext.filterCaseMetadata.mockImplementation(
      ({ cases }) => cases,
    );

    client.update = jest.fn().mockReturnValue({
      docketNumber: '123-20',
      pk: '123',
      sk: '123',
    });
  });

  it('should update the given docketEntry record with a isPendingService value', async () => {
    await updateDocketEntryPendingServiceStatus({
      applicationContext,
      docketEntryId: 3,
      docketNumber: '123-20',
      status: true,
    });
    expect(client.update.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeNames: {
        '#isPendingService': 'isPendingService',
      },
      ExpressionAttributeValues: {
        ':status': true,
      },
      Key: { pk: 'case|123-20', sk: 'docket-entry|3' },
      UpdateExpression: 'SET #isPendingService = :status',
    });
  });
});
