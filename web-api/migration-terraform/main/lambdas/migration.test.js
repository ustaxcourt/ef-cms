const { getFilteredGlobalEvents, processItems } = require('./migration');
const { MOCK_CASE } = require('../../../../shared/src/test/mockCase');

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
      await processItems({
        documentClient: mockDocumentClient,
        items: mockItems,
        migrateRecords: mockMigrateRecords,
      });

      expect(mockMigrateRecords).toHaveBeenCalledTimes(1);
      expect(mockDocumentClient.put).toHaveBeenCalledTimes(1);
    });
  });

  describe('getFilteredGlobalEvents', () => {
    it('should return everything', async () => {
      const items = await getFilteredGlobalEvents({
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
  });
});
