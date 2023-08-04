import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getWorkItemsByWorkItemId } from './getWorkItemsByWorkItemId';
import { query } from '../../dynamodbClientService';

jest.mock('../../dynamodbClientService');

const queryMock = query as jest.Mock;

describe('getWorkItemsByWorkItemId', () => {
  it('should call client.query with gsi1pk of work-item|{workItemId}', async () => {
    const mockWorkItemId = '7ca81520-95c3-4446-a8dc-eca9ea7364c5';

    await getWorkItemsByWorkItemId({
      applicationContext,
      workItemId: mockWorkItemId,
    });

    expect(queryMock.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':gsi1pk': `work-item|${mockWorkItemId}`,
      },
    });
  });
});
