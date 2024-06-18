import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { processRemoveEntries } from './processRemoveEntries';

describe('processRemoveEntries', () => {
  const mockRemoveRecord = {
    dynamodb: {
      NewImage: {
        entityName: {
          S: 'Case',
        },
        pk: {
          S: 'case|123-45',
        },
        sk: {
          S: 'case|123-45',
        },
      },
    },
    eventName: 'REMOVE',
  };

  it('should do nothing when no remove records are found', async () => {
    await processRemoveEntries({
      applicationContext,
      removeRecords: [],
    });

    expect(
      applicationContext.getPersistenceGateway().bulkDeleteRecords,
    ).not.toHaveBeenCalled();
  });

  it('should make a persistence call to remove the provided remove records', async () => {
    await processRemoveEntries({
      applicationContext,
      removeRecords: [mockRemoveRecord],
    });

    expect(
      applicationContext.getPersistenceGateway().bulkDeleteRecords.mock
        .calls[0][0].records,
    ).toEqual([mockRemoveRecord]);
  });

  it('should log an error and throw an exception when bulk delete returns failed records', async () => {
    applicationContext
      .getPersistenceGateway()
      .bulkDeleteRecords.mockReturnValueOnce({
        failedRecords: [{ id: 'failed delete' }],
      });

    await expect(
      processRemoveEntries({
        applicationContext,
        removeRecords: [mockRemoveRecord],
      }),
    ).rejects.toThrow('failed to delete records');

    expect(applicationContext.logger.error).toHaveBeenCalled();
  });
});
