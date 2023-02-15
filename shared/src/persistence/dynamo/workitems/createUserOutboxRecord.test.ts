import {
  TIME_TO_EXIST,
  createUserOutboxRecord,
} from './createUserOutboxRecord';
import { applicationContext } from '../../../business/test/createTestApplicationContext';

describe('createUserOutboxRecord', () => {
  let mockWorkItem;

  beforeEach(() => {
    mockWorkItem = {
      caseStatus: 'New',
      completedAt: '2019-04-19T18:24:09.515Z',
      completedMessage: 'completed',
      updatedAt: '2019-04-15T18:24:09.515Z',
      workItemId: 'work-item-id-123',
    };
  });

  it('creates a user outbox record with the completed datetime', async () => {
    await createUserOutboxRecord({
      applicationContext,
      userId: 'i-am-guy-fieri',
      workItem: mockWorkItem,
    });

    const now = Math.floor(Date.now() / 1000);
    const ttl = now - (now % 86400) + TIME_TO_EXIST;

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        gsi1pk: 'work-item|work-item-id-123',
        pk: 'user-outbox|i-am-guy-fieri',
        sk: mockWorkItem.completedAt,
        ttl,
      },
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[1][0],
    ).toMatchObject({
      Item: {
        gsi1pk: 'work-item|work-item-id-123',
        pk: 'user-outbox|i-am-guy-fieri|2019-04-19',
        sk: mockWorkItem.completedAt,
      },
    });
  });

  it('creates a section outbox record with the updated datetime', async () => {
    mockWorkItem = {
      ...mockWorkItem,
      completedAt: undefined,
      completedMessage: undefined,
    };

    await createUserOutboxRecord({
      applicationContext,
      userId: 'i-am-guy-fieri',
      workItem: mockWorkItem,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        gsi1pk: 'work-item|work-item-id-123',
        pk: 'user-outbox|i-am-guy-fieri',
        sk: mockWorkItem.updatedAt,
      },
    });
  });
});
