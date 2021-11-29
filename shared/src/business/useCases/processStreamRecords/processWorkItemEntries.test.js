const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { processEntries } = require('./processEntries');
const { processWorkItemEntries } = require('./processWorkItemEntries');
jest.mock('./processEntries');

describe('processWorkItemEntries', () => {
  const mockWorkItemRecord = {
    dynamodb: {
      NewImage: {
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

  it('should make a call to processEntries to process the provided workItem records', async () => {
    await processWorkItemEntries({
      applicationContext,
      workItemRecords: [mockWorkItemRecord],
    });

    expect(processEntries.mock.calls[0][0]).toMatchObject({
      recordType: 'workItemRecords',
      records: [mockWorkItemRecord],
    });
  });
});
