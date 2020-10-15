const { applicationContext } = require('../test/createTestApplicationContext');
const { processRemoveEntries } = require('./processStreamRecordsInteractor');

describe('processStreamRecordsInteractor', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .bulkDeleteRecords.mockReturnValue({ failedRecords: [] });

    applicationContext
      .getPersistenceGateway()
      .bulkIndexRecords.mockReturnValue({ failedRecords: [] });
  });

  describe('processRemoveEntries', () => {
    it('do nothing when no remove records are found', async () => {
      await processRemoveEntries({
        applicationContext,
        removeRecords: [],
      });

      expect(
        applicationContext.getPersistenceGateway().bulkDeleteRecords,
      ).not.toHaveBeenCalled();
    });

    it('attempt to bulk delete the records passed in', async () => {
      await processRemoveEntries({
        applicationContext,
        removeRecords: [
          {
            dynamodb: {
              Keys: {
                pk: {
                  S: 'case|abc',
                },
                sk: {
                  S: 'docket-entry|123',
                },
              },
              NewImage: null,
            },
            eventName: 'MODIFY',
          },
        ],
      });

      expect(
        applicationContext.getPersistenceGateway().bulkDeleteRecords.mock
          .calls[0][0].records,
      ).toEqual([
        {
          dynamodb: {
            Keys: { pk: { S: 'case|abc' }, sk: { S: 'docket-entry|123' } },
            NewImage: null,
          },
          eventName: 'MODIFY',
        },
      ]);
    });
  });

  describe('processOtherEntries', () => {
    it('do nothing when no other records are found', async () => {
      await processRemoveEntries({
        applicationContext,
        otherRecords: [],
      });

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords,
      ).not.toHaveBeenCalled();
    });

    it('attempt to bulk delete the records passed in', async () => {
      await processRemoveEntries({
        applicationContext,
        removeRecords: [
          {
            dynamodb: {
              Keys: {
                pk: {
                  S: 'case|abc',
                },
                sk: {
                  S: 'docket-entry|123',
                },
              },
              NewImage: null,
            },
            eventName: 'MODIFY',
          },
        ],
      });

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords.mock
          .calls[0][0].records,
      ).toEqual('a');
    });
  });
});
