import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { update } from '../../dynamodbClientService';
import { updateDocketEntryPendingServiceStatus } from './updateDocketEntryPendingServiceStatus';

jest.mock('../../dynamodbClientService');

describe('updateDocketEntryPendingServiceStatus', () => {
  beforeAll(() => {
    applicationContext.filterCaseMetadata.mockImplementation(
      ({ cases }) => cases,
    );

    (update as jest.Mock).mockReturnValue({
      docketNumber: '123-20',
      pk: '123',
      sk: '123',
    });
  });

  it('should update the given docketEntry record with a isPendingService value', async () => {
    await updateDocketEntryPendingServiceStatus({
      applicationContext,
      docketEntryId: 'asdf',
      docketNumber: '123-20',
      status: true,
    } as any);
    expect((update as jest.Mock).mock.calls[0][0]).toMatchObject({
      ExpressionAttributeNames: {
        '#isPendingService': 'isPendingService',
      },
      ExpressionAttributeValues: {
        ':status': true,
      },
      Key: { pk: 'case|123-20', sk: 'docket-entry|asdf' },
      UpdateExpression: 'SET #isPendingService = :status',
    });
  });
});
