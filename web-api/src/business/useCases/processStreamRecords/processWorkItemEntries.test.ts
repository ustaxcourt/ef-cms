import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { processWorkItemEntries } from './processWorkItemEntries';
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

  it('should index the provided work item record with a mapping to the case it belongs to', async () => {
    await processWorkItemEntries({
      applicationContext,
      workItemRecords: [mockWorkItemRecord],
    });

    expect(
      applicationContext.getPersistenceGateway().bulkIndexRecords.mock
        .calls[0][0].records,
    ).toEqual([
      {
        dynamodb: {
          ...mockWorkItemRecord.dynamodb,
          Keys: {
            pk: {
              S: 'case|123-45',
            },
            sk: {
              S: 'work-item|40e3b91c-5ddf-42d8-a9dc-44e3fb2f7309',
            },
          },
          NewImage: {
            ...mockWorkItemRecord.dynamodb.NewImage,
            case_relations: {
              name: 'workItem',
              parent: 'case|123-45_case|123-45|mapping',
            },
          },
        },
        eventName: 'MODIFY',
      },
    ]);
  });

  it('should log an error and throw an exception when bulk index returns failed records', async () => {
    applicationContext
      .getPersistenceGateway()
      .bulkIndexRecords.mockReturnValueOnce({
        failedRecords: [{ id: 'failed record' }],
      });

    await expect(
      processWorkItemEntries({
        applicationContext,
        workItemRecords: [mockWorkItemRecord],
      }),
    ).rejects.toThrow('failed to index work item records');

    expect(applicationContext.logger.error).toHaveBeenCalled();
  });
});
