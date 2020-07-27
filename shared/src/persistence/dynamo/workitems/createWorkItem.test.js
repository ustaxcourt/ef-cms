const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { createWorkItem } = require('./createWorkItem');

const mockWorkItem = {
  assigneeId: '123',
  createdAt: '100',
  docketNumber: '123',
  section: 'docket',
  sentByUserId: 'a_user',
  workItemId: 'a_id',
};

describe('createWorkItem', () => {
  const CASE_ID = '6697e4bf-655f-4413-b3e8-4b498b0bc695';

  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
    applicationContext.getDocumentClient().put.mockReturnValue({
      promise: () => Promise.resolve(null),
    });
    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Item: {
            section: 'docket',
            userId: '123',
          },
        }),
    });
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Items: [
            {
              pk: `case|${CASE_ID}`,
              sk: `case|${CASE_ID}`,
            },
          ],
        }),
    });
  });

  it('attempts to persist the work item', async () => {
    await createWorkItem({
      applicationContext,
      workItem: mockWorkItem,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: 'work-item|a_id',
        sk: 'work-item|a_id',
        workItemId: 'a_id',
      },
      TableName: 'efcms-dev',
    });
  });

  it('creates a mapping record between case and work item', async () => {
    await createWorkItem({
      applicationContext,
      workItem: mockWorkItem,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[1][0],
    ).toMatchObject({
      Item: {
        pk: `case|${CASE_ID}`,
        sk: 'work-item|a_id',
      },
      TableName: 'efcms-dev',
    });
  });

  it('creates a record for the individual inbox', async () => {
    await createWorkItem({
      applicationContext,
      workItem: mockWorkItem,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[2][0],
    ).toMatchObject({
      Item: {
        pk: 'user|123',
        sk: 'work-item|a_id',
        workItemId: 'a_id',
      },
      TableName: 'efcms-dev',
    });
  });

  it('creates a record for the individual outbox', async () => {
    await createWorkItem({
      applicationContext,
      workItem: mockWorkItem,
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[3][0],
    ).toMatchObject({
      Item: {
        pk: 'user-outbox|123',
        sk: '100',
      },
      TableName: 'efcms-dev',
    });
  });

  it('creates a record for the section inbox', async () => {
    await createWorkItem({
      applicationContext,
      workItem: mockWorkItem,
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[4][0],
    ).toMatchObject({
      Item: {
        pk: 'section|docket',
        sk: 'work-item|a_id',
        workItemId: 'a_id',
      },
      TableName: 'efcms-dev',
    });
  });

  it('creates a record for the section outbox', async () => {
    await createWorkItem({
      applicationContext,
      workItem: mockWorkItem,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[5][0],
    ).toMatchObject({
      Item: {
        pk: 'section-outbox|docket',
        sk: '100',
        workItemId: 'a_id',
      },
      TableName: 'efcms-dev',
    });
  });
});
