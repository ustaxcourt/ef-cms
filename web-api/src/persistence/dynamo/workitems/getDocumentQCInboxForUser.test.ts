import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getDocumentQCInboxForUser } from './getDocumentQCForUser';
import { queryFull } from '../../dynamodbClientService';

jest.mock('../../dynamodbClientService');

describe('getDocumentQCInboxForUser', () => {
  const queryFullMock = queryFull as jest.Mock;

  const userId = '90fc92f5-dd38-4e5f-83f4-56eb06b424b7';

  const inboxWorkItem = {
    completedAt: undefined,
    gsi1pk: 'work-item|abc',
    pk: 'case|abc',
    sk: 'work-item|abc',
    workItemId: 'abc',
  };

  beforeEach(() => {
    queryFullMock.mockResolvedValue([inboxWorkItem]);
  });

  it('should query for work items assigned to the provided user', async () => {
    await getDocumentQCInboxForUser({
      applicationContext,
      userId,
    });

    expect(queryFullMock.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':gsi2pk': `assigneeId|${userId}`,
        ':prefix': 'work-item',
      },
      IndexName: 'gsi2',
      KeyConditionExpression: '#gsi2pk = :gsi2pk and begins_with(#sk, :prefix)',
    });
  });

  it('should return work items sorted by priority, descending', async () => {
    queryFullMock.mockResolvedValue([
      inboxWorkItem,
      {
        ...inboxWorkItem,
        highPriority: true,
      },
    ]);

    const results = await getDocumentQCInboxForUser({
      applicationContext,
      userId,
    });

    expect(results).toEqual([
      {
        ...inboxWorkItem,
        highPriority: true,
      },
      inboxWorkItem,
    ]);
  });
});
