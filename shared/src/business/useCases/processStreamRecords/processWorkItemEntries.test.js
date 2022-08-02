const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { processWorkItemEntries } = require('./processWorkItemEntries');
jest.mock('./processEntries');

describe('processWorkItemEntries', () => {
  const mockWorkItemRecord = {
    dynamodb: {
      NewImage: {
        docketNumber: {
          S: '123-45',
        },
        entityName: {
          S: 'WorkItem',
        },
        pk: {
          S: 'case|123-45',
        },
        sk: {
          S: 'work-item|40e3b91c-5ddf-42d8-a9dc-44e3fb2f7309',
        },
      },
    },
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .bulkIndexRecords.mockReturnValue({ failedRecords: [] });
  });

  it('should do nothing when no workItemRecords are provided', async () => {
    await processWorkItemEntries({
      applicationContext,
      workItemRecords: [],
    });

    expect(
      applicationContext.getPersistenceGateway().bulkIndexRecords,
    ).not.toHaveBeenCalled();
  });

  it('should make a call to bulk index the provided records', async () => {
    await processWorkItemEntries({
      applicationContext,
      workItemRecords: [mockWorkItemRecord],
    });

    expect(
      applicationContext.getPersistenceGateway().bulkIndexRecords.mock
        .calls[0][0].records,
    ).toEqual([mockWorkItemRecord]);
  });
});
