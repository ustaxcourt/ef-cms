import '@web-api/persistence/postgres/workitems/mocks.jest';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { processWorkItemEntries } from './processWorkItemEntries';
import { upsertWorkItems } from '@web-api/persistence/postgres/workitems/upsertWorkItems';

jest.mock('./processEntries');

const mockLogger = {
  debug: jest.fn(),
  error: jest.fn(),
};
jest.mock('@web-api/utilities/logger/getLogger', () => {
  return {
    getLogger: () => mockLogger,
  };
});
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

  const mockSectionOutboxWorkItemRecord = {
    dynamodb: {
      NewImage: {
        docketNumber: {
          S: '123-45',
        },
        entityName: {
          S: 'WorkItem',
        },
        pk: {
          S: 'section-outbox|docket|2021-04-14',
        },
        sk: {
          S: '2021-04-14T13:20:24.0732',
        },
      },
    },
  };

  const mockUserOutboxWorkItemRecord = {
    dynamodb: {
      NewImage: {
        docketNumber: {
          S: '123-45',
        },
        entityName: {
          S: 'WorkItem',
        },
        pk: {
          S: 'user-outbox|50e3b92c-5dgf-1ad8-a9dc-44e3fb2f7309|2021-w15',
        },
        sk: {
          S: '2021-04-14T13:20:24.0732',
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

  it('should upsert non-outbox work item records to postgres', async () => {
    await processWorkItemEntries({
      applicationContext,
      workItemRecords: [
        mockWorkItemRecord,
        mockSectionOutboxWorkItemRecord,
        mockUserOutboxWorkItemRecord,
      ],
    });

    expect(upsertWorkItems).toHaveBeenCalledTimes(1);
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

    expect(mockLogger.error).toHaveBeenCalled();
  });
});
