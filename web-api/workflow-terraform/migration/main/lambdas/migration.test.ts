import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { getFilteredGlobalEvents, processItems } from './migration';

describe('migration', () => {
  describe('processItems', () => {
    it('call put on all records that come through', async () => {
      const mockItems = [
        {
          ...MOCK_CASE,
          pk: `case|${MOCK_CASE.docketNumber}`,
          sk: `case|${MOCK_CASE.docketNumber}`,
        },
      ];
      const mockDocumentClient = {
        put: jest.fn().mockReturnValue({
          promise: () => null,
        }),
      };
      const mockMigrateRecords = jest.fn().mockReturnValue(mockItems);
      const applicationContext = jest.fn();
      await processItems(applicationContext, {
        documentClient: mockDocumentClient,
        items: mockItems,
        migrateRecords: mockMigrateRecords,
      });

      expect(mockMigrateRecords).toHaveBeenCalledTimes(1);
      expect(mockDocumentClient.put).toHaveBeenCalledTimes(1);
    });
  });

  describe('getFilteredGlobalEvents', () => {
    it('should return everything', () => {
      const items = getFilteredGlobalEvents({
        Records: [
          {
            dynamodb: {
              NewImage: {
                'aws:rep:updatetime': {
                  N: 10,
                },
              },
              OldImage: {
                'aws:rep:updatetime': {
                  N: 20,
                },
              },
            },
          },
        ],
      });
      expect(items.length).toBe(1);
    });

    it('should not attempt to process REMOVE events', () => {
      const items = getFilteredGlobalEvents({
        Records: [
          {
            awsRegion: 'us-east-1',
            dynamodb: {
              Keys: {
                Id: {
                  N: '101',
                },
              },
              NewImage: {
                Id: {
                  N: '101',
                },
                Message: {
                  S: 'New item!',
                },
              },
              SequenceNumber: '111',
              SizeBytes: 26,
              StreamViewType: 'NEW_AND_OLD_IMAGES',
            },
            eventID: '1',
            eventName: 'INSERT',
            eventSource: 'aws:dynamodb',
            eventSourceARN: 'stream-ARN',
            eventVersion: '1.0',
          },
          {
            awsRegion: 'us-east-1',
            dynamodb: {
              Keys: {
                Id: {
                  N: '101',
                },
              },
              NewImage: {
                Id: {
                  N: '101',
                },
                Message: {
                  S: 'This item has changed',
                },
              },
              OldImage: {
                Id: {
                  N: '101',
                },
                Message: {
                  S: 'New item!',
                },
              },
              SequenceNumber: '222',
              SizeBytes: 59,
              StreamViewType: 'NEW_AND_OLD_IMAGES',
            },
            eventID: '2',
            eventName: 'MODIFY',
            eventSource: 'aws:dynamodb',
            eventSourceARN: 'stream-ARN',
            eventVersion: '1.0',
          },
          {
            awsRegion: 'us-east-1',
            dynamodb: {
              Keys: {
                Id: {
                  N: '101',
                },
              },
              OldImage: {
                Id: {
                  N: '101',
                },
                Message: {
                  S: 'This item has changed',
                },
              },
              SequenceNumber: '333',
              SizeBytes: 38,
              StreamViewType: 'NEW_AND_OLD_IMAGES',
            },
            eventID: '3',
            eventName: 'REMOVE',
            eventSource: 'aws:dynamodb',
            eventSourceARN: 'stream-ARN',
            eventVersion: '1.0',
          },
        ],
      });
      expect(items.length).toEqual(2);
    });
  });
});
