import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { processEntries } from './processEntries';

describe('processStreamUtilities', () => {
  const mockCaseRecord = {
    dynamodb: {
      NewImage: {
        docketNumber: {
          S: '123-45',
        },
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
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .bulkIndexRecords.mockReturnValue({ failedRecords: [] });
  });

  describe('processEntries', () => {
    it('should do nothing when no records are provided', async () => {
      await processEntries({
        applicationContext,
        recordType: 'Anything',
        records: [],
      });

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords,
      ).not.toHaveBeenCalled();
    });

    it('should make a call to bulk index the provided records', async () => {
      await processEntries({
        applicationContext,
        recordType: 'Case',
        records: [mockCaseRecord],
      });

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords.mock
          .calls[0][0].records,
      ).toEqual([mockCaseRecord]);
    });

    it('should log an error and throw an exception when bulk index returns failed records', async () => {
      applicationContext
        .getPersistenceGateway()
        .bulkIndexRecords.mockReturnValueOnce({
          failedRecords: [{ id: 'failed record' }],
        });

      await expect(
        processEntries({
          applicationContext,
          recordType: 'Case',
          records: [mockCaseRecord],
        }),
      ).rejects.toThrow('failed to index records');

      expect(applicationContext.logger.error).toHaveBeenCalled();
    });
  });
});
