const {
  processCaseEntries,
  processDocketEntries,
  processRemoveEntries,
} = require('./processStreamRecordsInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

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

  describe('processCaseEntries', () => {
    const mockGetCase = jest.fn();
    const mockGetDocument = jest.fn();

    it('does nothing when no other records are found', async () => {
      await processCaseEntries({
        applicationContext,
        caseEntityRecords: [],
      });

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords,
      ).not.toHaveBeenCalled();
    });

    it('attempts to bulk index the records passed in', async () => {
      const caseData = {
        docketEntries: [],
        docketNumber: '123-45',
        entityName: 'Case',
        pk: 'case|123-45',
        sk: 'case|123-45',
      };
      const caseDataMarshalled = {
        docketEntries: { L: [] },
        docketNumber: { S: '123-45' },
        entityName: { S: 'Case' },
        pk: { S: 'case|123-45' },
        sk: { S: 'case|123-45' },
      };

      mockGetCase.mockReturnValue({
        ...caseData,
      });

      const utils = {
        getCase: mockGetCase,
        getDocument: mockGetDocument,
      };

      await processCaseEntries({
        applicationContext,
        caseEntityRecords: [
          {
            dynamodb: {
              Keys: {
                pk: { S: caseData.pk },
                sk: { S: caseData.sk },
              },
              NewImage: caseDataMarshalled,
            },
            eventName: 'MODIFY',
          },
        ],
        utils,
      });

      expect(mockGetCase).toHaveBeenCalled();

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords.mock
          .calls[0][0].records,
      ).toEqual([
        {
          dynamodb: {
            Keys: { pk: { S: caseData.pk }, sk: { S: caseData.sk } },
            NewImage: caseDataMarshalled,
          },
          eventName: 'MODIFY',
        },
      ]);
    });

    it('indexes all docket entries for each case', async () => {
      const docketEntryData = {
        docketEntryId: '123',
        entityName: 'DocketEntry',
        pk: 'docket-entry|123',
        sk: 'docket-entry|123',
      };

      const docketEntryDataMarshalled = {
        docketEntryId: { S: '123' },
        entityName: { S: 'DocketEntry' },
        pk: { S: 'docket-entry|123' },
        sk: { S: 'docket-entry|123' },
      };

      const caseData = {
        docketEntries: [docketEntryData],
        docketNumber: '123-45',
        entityName: 'Case',
        pk: 'case|123-45',
        sk: 'case|123-45',
      };

      const caseDataMarshalled = {
        docketEntries: {
          L: [{ M: docketEntryDataMarshalled }],
        },
        docketNumber: { S: '123-45' },
        entityName: { S: 'Case' },
        pk: { S: 'case|123-45' },
        sk: { S: 'case|123-45' },
      };

      mockGetCase.mockReturnValue({
        ...caseData,
      });

      mockGetDocument.mockReturnValue('[{ "documentContents": "Test"}]');

      const utils = {
        getCase: mockGetCase,
        getDocument: mockGetDocument,
      };

      await processCaseEntries({
        applicationContext,
        caseEntityRecords: [
          {
            dynamodb: {
              Keys: {
                pk: { S: caseData.pk },
                sk: { S: caseData.sk },
              },
              NewImage: caseDataMarshalled,
            },
            eventName: 'MODIFY',
          },
        ],
        utils,
      });

      expect(mockGetCase).toHaveBeenCalled();

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords.mock
          .calls[0][0].records,
      ).toEqual([
        {
          dynamodb: {
            Keys: {
              pk: { S: docketEntryData.pk },
              sk: { S: docketEntryData.sk },
            },
            NewImage: { ...caseDataMarshalled, ...docketEntryDataMarshalled },
          },
          eventName: 'MODIFY',
        },
        {
          dynamodb: {
            Keys: { pk: { S: caseData.pk }, sk: { S: caseData.sk } },
            NewImage: caseDataMarshalled,
          },
          eventName: 'MODIFY',
        },
      ]);
    });
  });

  describe('processDocketEntries', () => {
    const mockGetCase = jest.fn();
    const mockGetDocument = jest.fn();

    const docketEntryData = {
      docketEntryId: '123',
      entityName: 'DocketEntry',
      pk: 'docket-entry|123',
      sk: 'docket-entry|123',
    };

    const docketEntryDataMarshalled = {
      docketEntryId: { S: '123' },
      entityName: { S: 'DocketEntry' },
      pk: { S: 'docket-entry|123' },
      sk: { S: 'docket-entry|123' },
    };

    const caseData = {
      docketEntries: [docketEntryData],
      docketNumber: '123-45',
      entityName: 'Case',
      pk: 'case|123-45',
      sk: 'case|123-45',
    };

    const caseDataMarshalled = {
      docketEntries: {
        L: [{ M: docketEntryDataMarshalled }],
      },
      docketNumber: { S: '123-45' },
      entityName: { S: 'Case' },
      pk: { S: 'case|123-45' },
      sk: { S: 'case|123-45' },
    };

    mockGetCase.mockReturnValue({
      ...caseData,
    });

    mockGetDocument.mockReturnValue('[{ "documentContents": "Test"}]');

    const utils = {
      getCase: mockGetCase,
      getDocument: mockGetDocument,
    };

    it('does nothing when no other records are found', async () => {
      await processDocketEntries({
        applicationContext,
        docketEntryRecords: [],
      });

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords,
      ).not.toHaveBeenCalled();
    });

    it('attempts to bulk index the records passed in', async () => {
      await processDocketEntries({
        applicationContext,
        docketEntryRecords: [
          {
            dynamodb: {
              Keys: {
                pk: { S: docketEntryData.pk },
                sk: { S: docketEntryData.sk },
              },
              NewImage: docketEntryDataMarshalled,
            },
            eventName: 'MODIFY',
          },
        ],
        utils,
      });

      expect(mockGetCase).toHaveBeenCalled();
      expect(mockGetDocument).not.toHaveBeenCalled();

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords.mock
          .calls[0][0].records,
      ).toEqual([
        {
          dynamodb: {
            Keys: {
              pk: { S: docketEntryData.pk },
              sk: { S: docketEntryData.sk },
            },
            NewImage: { ...caseDataMarshalled, ...docketEntryDataMarshalled },
          },
          eventName: 'MODIFY',
        },
      ]);
    });

    it('fetches the document from persistence if the entry has a documentContentsId', async () => {
      docketEntryData.documentContentsId = '123';
      docketEntryDataMarshalled.documentContentsId = { S: '123' };

      await processDocketEntries({
        applicationContext,
        docketEntryRecords: [
          {
            dynamodb: {
              Keys: {
                pk: { S: docketEntryData.pk },
                sk: { S: docketEntryData.sk },
              },
              NewImage: docketEntryDataMarshalled,
            },
            eventName: 'MODIFY',
          },
        ],
        utils,
      });

      expect(mockGetCase).toHaveBeenCalled();
      expect(mockGetDocument).toHaveBeenCalled();

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords.mock
          .calls[0][0].records,
      ).toEqual([
        {
          dynamodb: {
            Keys: {
              pk: { S: docketEntryData.pk },
              sk: { S: docketEntryData.sk },
            },
            NewImage: { ...caseDataMarshalled, ...docketEntryDataMarshalled },
          },
          eventName: 'MODIFY',
        },
      ]);
    });
  });

  describe('processOtherEntries', () => {});

  describe('processRemoveEntries', () => {
    it('does nothing when no other records are found', async () => {
      await processRemoveEntries({
        applicationContext,
        removeRecords: [],
      });

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords,
      ).not.toHaveBeenCalled();
    });

    it('attempts to bulk delete the records passed in', async () => {
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
});
