const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  createSectionOutboxRecords,
  TIME_TO_EXIST,
} = require('./createSectionOutboxRecords');

describe('createSectionOutboxRecords', () => {
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

  it('creates a section outbox record with the completed datetime', async () => {
    await createSectionOutboxRecords({
      applicationContext,
      section: 'flavortown',
      workItem: mockWorkItem,
    });

    const now = Math.floor(Date.now() / 1000);
    const ttl = now - (now % 86400) + TIME_TO_EXIST;

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        gsi1pk: 'work-item|work-item-id-123',
        pk: 'section-outbox|flavortown',
        sk: mockWorkItem.completedAt,
        ttl,
      },
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[1][0],
    ).toMatchObject({
      Item: {
        gsi1pk: 'work-item|work-item-id-123',
        pk: 'section-outbox|flavortown|2019-04',
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

    await createSectionOutboxRecords({
      applicationContext,
      section: 'flavortown',
      workItem: mockWorkItem,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        gsi1pk: 'work-item|work-item-id-123',
        pk: 'section-outbox|flavortown',
        sk: mockWorkItem.updatedAt,
      },
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        gsi1pk: 'work-item|work-item-id-123',
        pk: 'section-outbox|flavortown',
        sk: mockWorkItem.updatedAt,
      },
    });
  });
});
