/* eslint-disable max-lines */
const {
  partitionRecords,
  processCaseEntries,
  processDocketEntries,
  processMessageEntries,
  processOtherEntries,
  processRemoveEntries,
  processWorkItemEntries,
} = require('./processStreamUtilities');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('processStreamUtilities', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .bulkDeleteRecords.mockReturnValue({ failedRecords: [] });

    applicationContext
      .getPersistenceGateway()
      .bulkIndexRecords.mockReturnValue({ failedRecords: [] });
  });

  describe('partitionRecords', () => {
    it('separates records by type', () => {
      const removeRecord = {
        dynamodb: {
          Keys: {
            pk: {
              S: 'case|123-45',
            },
            sk: {
              S: 'case|123-45',
            },
          },
          NewImage: {
            entityName: {
              S: 'Case',
            },
          },
        },
        eventName: 'REMOVE',
      };

      const caseRecord = {
        dynamodb: {
          Keys: {
            pk: {
              S: 'case|123-45',
            },
            sk: {
              S: 'case|123-45',
            },
          },
          NewImage: {
            entityName: {
              S: 'Case',
            },
          },
        },
        eventName: 'MODIFY',
      };

      const docketEntryRecord = {
        dynamodb: {
          Keys: {
            pk: {
              S: 'case|123-45',
            },
            sk: {
              S: 'docket-entry|123',
            },
          },
          NewImage: {
            entityName: {
              S: 'DocketEntry',
            },
          },
        },
        eventName: 'MODIFY',
      };

      const messageRecord = {
        dynamodb: {
          Keys: {
            pk: {
              S: 'case|123-45',
            },
            sk: {
              S: 'message|123',
            },
          },
          NewImage: {
            entityName: {
              S: 'Message',
            },
          },
        },
        eventName: 'MODIFY',
      };

      const otherRecord = {
        dynamodb: {
          Keys: {
            pk: {
              S: 'other-record|123',
            },
            sk: {
              S: 'other-record|123',
            },
          },
          NewImage: {
            entityName: {
              S: 'OtherRecord',
            },
          },
        },
        eventName: 'MODIFY',
      };

      const records = [
        { ...removeRecord },
        { ...caseRecord },
        { ...docketEntryRecord },
        { ...messageRecord },
        { ...otherRecord },
      ];

      const result = partitionRecords(records);

      expect(result).toMatchObject({
        caseEntityRecords: [caseRecord],
        docketEntryRecords: [docketEntryRecord],
        messageRecords: [messageRecord],
        otherRecords: [otherRecord],
        removeRecords: [removeRecord],
      });
    });
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

    it('logs errors and throws an exception if bulk delete fails', async () => {
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

      applicationContext
        .getPersistenceGateway()
        .bulkDeleteRecords.mockReturnValueOnce({
          failedRecords: [{ id: 'failed delete' }],
        });
      await expect(
        processRemoveEntries({
          applicationContext,
          removeRecords: [
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
        }),
      ).rejects.toThrow('failed to delete records');
      expect(applicationContext.logger.error.mock.calls[0][0]).toBe(
        'the records that failed to delete',
      );
    });
  });

  describe('processCaseEntries', () => {
    const mockGetCaseMetadataWithCounsel = jest.fn();
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
        docketNumber: '123-45',
        entityName: 'Case',
        irsPractitioners: [
          {
            name: 'bob',
          },
        ],
        pk: 'case|123-45',
        privatePractitioners: [
          {
            name: 'jane',
          },
        ],
        sk: 'case|123-45',
      };

      const caseDataMarshalled = {
        docketNumber: { S: '123-45' },
        entityName: { S: 'Case' },
        irsPractitioners: {
          L: [
            {
              M: {
                name: {
                  S: 'bob',
                },
              },
            },
          ],
        },
        pk: { S: 'case|123-45' },
        privatePractitioners: {
          L: [
            {
              M: {
                name: {
                  S: 'jane',
                },
              },
            },
          ],
        },
        sk: { S: 'case|123-45' },
      };

      mockGetCaseMetadataWithCounsel.mockReturnValue({
        ...caseData,
      });

      const utils = {
        getCaseMetadataWithCounsel: mockGetCaseMetadataWithCounsel,
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

      expect(mockGetCaseMetadataWithCounsel).toHaveBeenCalled();

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords.mock
          .calls[0][0].records,
      ).toEqual([
        {
          dynamodb: {
            Keys: { pk: { S: caseData.pk }, sk: { S: caseData.sk } },
            NewImage: {
              case_relations: { name: 'case' },
              docketNumber: { S: '123-45' },
              entityName: { S: 'CaseDocketEntryMapping' },
              irsPractitioners: {
                L: [
                  {
                    M: {
                      name: {
                        S: 'bob',
                      },
                    },
                  },
                ],
              },
              pk: { S: 'case|123-45' },
              privatePractitioners: {
                L: [
                  {
                    M: {
                      name: {
                        S: 'jane',
                      },
                    },
                  },
                ],
              },
              sk: { S: 'case|123-45' },
            },
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

    it('logs errors and throws an exception if bulk indexing fails', async () => {
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

      mockGetCaseMetadataWithCounsel.mockReturnValue({
        ...caseData,
      });

      const utils = {
        getCaseMetadataWithCounsel: mockGetCaseMetadataWithCounsel,
        getDocument: mockGetDocument,
      };
      applicationContext
        .getPersistenceGateway()
        .bulkIndexRecords.mockReturnValueOnce({
          failedRecords: [{ id: 'failed record' }],
        });
      await expect(
        processCaseEntries({
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
        }),
      ).rejects.toThrow('failed to index case entry');
      expect(applicationContext.logger.error).toHaveBeenCalled();
    });
  });

  describe('processDocketEntries', () => {
    const mockGetDocument = jest.fn();

    const docketEntryData = {
      docketEntryId: '123',
      entityName: 'DocketEntry',
      pk: 'case|123',
      sk: 'docket-entry|123',
    };

    const docketEntryDataMarshalled = {
      docketEntryId: { S: '123' },
      entityName: { S: 'DocketEntry' },
      pk: { S: 'case|123' },
      sk: { S: 'docket-entry|123' },
    };

    mockGetDocument.mockReturnValue('[{ "documentContents": "Test"}]');

    const utils = {
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
            NewImage: {
              ...docketEntryDataMarshalled,
              case_relations: {
                name: 'document',
                parent: 'case|123_case|123|mapping',
              },
            },
          },
          eventName: 'MODIFY',
        },
      ]);
    });

    it('fetches the document from persistence if the entry is an opinion and has a documentContentsId', async () => {
      docketEntryData.documentContentsId = '123';
      docketEntryDataMarshalled.documentContentsId = { S: '123' };
      docketEntryDataMarshalled.eventCode = { S: 'TCOP' };

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
            NewImage: {
              ...docketEntryDataMarshalled,
              case_relations: {
                name: 'document',
                parent: 'case|123_case|123|mapping',
              },
            },
          },
          eventName: 'MODIFY',
        },
      ]);
    });

    it('logs errors if documentContentsId cannot be found in S3 or bulk indexing fails', async () => {
      docketEntryData.documentContentsId = '678';
      docketEntryDataMarshalled.documentContentsId = { S: '123' };
      docketEntryDataMarshalled.eventCode = { S: 'TCOP' };

      applicationContext
        .getPersistenceGateway()
        .bulkIndexRecords.mockReturnValueOnce({
          failedRecords: [{ some: 'thing' }],
        });

      await expect(
        processDocketEntries({
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
          utils: {
            ...utils,
            getDocument: jest
              .fn()
              .mockRejectedValue(new Error('fake s3 error')),
          },
        }),
      ).rejects.toThrow('failed to index docket entry records');

      expect(applicationContext.logger.error).toHaveBeenCalledTimes(2);
      expect(applicationContext.logger.error.mock.calls[0][0]).toContain(
        'not found in s3',
      );
      expect(applicationContext.logger.error.mock.calls[1][0]).toContain(
        'the docket entry records that failed to index',
      );
    });

    it('fetches the document from persistence if the entry is an order and has a documentContentsId', async () => {
      docketEntryData.documentContentsId = '123';
      docketEntryDataMarshalled.documentContentsId = { S: '123' };
      docketEntryDataMarshalled.eventCode = { S: 'OAJ' };

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
            NewImage: {
              ...docketEntryDataMarshalled,
              case_relations: {
                name: 'document',
                parent: 'case|123_case|123|mapping',
              },
            },
          },
          eventName: 'MODIFY',
        },
      ]);
    });

    it('does NOT index the contents of a document if it is not an order or an opinion', async () => {
      docketEntryData.documentContentsId = '123';
      docketEntryDataMarshalled.documentContentsId = { S: '123' };
      docketEntryDataMarshalled.eventCode = { S: 'APW' };

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
            NewImage: {
              ...docketEntryDataMarshalled,
              case_relations: {
                name: 'document',
                parent: 'case|123_case|123|mapping',
              },
            },
          },
          eventName: 'MODIFY',
        },
      ]);
    });
  });

  describe('processMessageEntries', () => {
    const utils = {};
    let mockGetMessage;

    const messageData = {
      docketNumber: '123-45',
      entityName: 'Message',
      isRepliedTo: false,
      messageId: '09b15337-e9db-45e9-9c8b-2946049965d1',
      pk: 'case|123-45',
      sk: 'message|09b15337-e9db-45e9-9c8b-2946049965d1',
    };

    const messageDataMarshalled = {
      docketNumber: { S: '123-45' },
      entityName: { S: 'Message' },
      isRepliedTo: { BOOL: false },
      messageId: { S: '09b15337-e9db-45e9-9c8b-2946049965d1' },
      pk: { S: 'case|123-45' },
      sk: { S: 'message|09b15337-e9db-45e9-9c8b-2946049965d1' },
    };

    beforeEach(() => {
      mockGetMessage = jest.fn().mockReturnValue({
        ...messageData,
      });

      utils.getMessage = mockGetMessage;
    });

    it('does nothing when no message records are found', async () => {
      await processMessageEntries({
        applicationContext,
        messageRecords: [],
      });

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords,
      ).not.toHaveBeenCalled();
    });

    it('attempts to bulk index the records passed in', async () => {
      await processMessageEntries({
        applicationContext,
        messageRecords: [
          {
            dynamodb: {
              Keys: {
                pk: { S: messageData.pk },
                sk: { S: messageData.sk },
              },
              NewImage: messageDataMarshalled,
            },
            eventName: 'MODIFY',
          },
        ],
        utils,
      });

      expect(mockGetMessage).toHaveBeenCalled();

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords.mock
          .calls[0][0].records,
      ).toEqual([
        {
          dynamodb: {
            Keys: { pk: { S: messageData.pk }, sk: { S: messageData.sk } },
            NewImage: messageDataMarshalled,
          },
          eventName: 'MODIFY',
        },
      ]);
    });

    it('calls getMessage to get the latest message if the messageNewImage.isRepliedTo is false', async () => {
      await processMessageEntries({
        applicationContext,
        messageRecords: [
          {
            dynamodb: {
              Keys: {
                pk: { S: messageData.pk },
                sk: { S: messageData.sk },
              },
              NewImage: {
                ...messageDataMarshalled,
                isRepliedTo: { BOOL: false },
              },
            },
            eventName: 'MODIFY',
          },
        ],
        utils,
      });

      expect(mockGetMessage).toHaveBeenCalled();
    });

    it('attempts to bulk index the data returned from getMessage instead of the NewImage if the messageNewImage.isRepliedTo is false and the message from dynamo has isRepliedTo = false', async () => {
      mockGetMessage = jest.fn().mockReturnValue({
        ...messageData,
        isRepliedTo: false,
      });
      utils.getMessage = mockGetMessage;

      await processMessageEntries({
        applicationContext,
        messageRecords: [
          {
            dynamodb: {
              Keys: {
                pk: { S: messageData.pk },
                sk: { S: messageData.sk },
              },
              NewImage: {
                ...messageDataMarshalled,
                isRepliedTo: { BOOL: false },
              },
            },
            eventName: 'MODIFY',
          },
        ],
        utils,
      });

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords.mock
          .calls[0][0].records,
      ).toEqual([
        {
          dynamodb: {
            Keys: { pk: { S: messageData.pk }, sk: { S: messageData.sk } },
            NewImage: {
              ...messageDataMarshalled,
              isRepliedTo: { BOOL: false },
            },
          },
          eventName: 'MODIFY',
        },
      ]);
    });

    it('does not return any data to be indexed if the messageNewImage.isRepliedTo is false and the message from dynamo has isRepliedTo = true', async () => {
      mockGetMessage = jest.fn().mockReturnValue({
        ...messageData,
        isRepliedTo: true,
      });
      utils.getMessage = mockGetMessage;

      await processMessageEntries({
        applicationContext,
        messageRecords: [
          {
            dynamodb: {
              Keys: {
                pk: { S: messageData.pk },
                sk: { S: messageData.sk },
              },
              NewImage: {
                ...messageDataMarshalled,
                isRepliedTo: { BOOL: false },
              },
            },
            eventName: 'MODIFY',
          },
        ],
        utils,
      });

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords.mock
          .calls[0][0].records,
      ).toEqual([]);
    });

    it('does not call getMessage to get the latest message if the messageNewImage.isRepliedTo is true', async () => {
      await processMessageEntries({
        applicationContext,
        messageRecords: [
          {
            dynamodb: {
              Keys: {
                pk: { S: messageData.pk },
                sk: { S: messageData.sk },
              },
              NewImage: {
                ...messageDataMarshalled,
                isRepliedTo: { BOOL: true },
              },
            },
            eventName: 'MODIFY',
          },
        ],
        utils,
      });

      expect(mockGetMessage).not.toHaveBeenCalled();
    });
  });

  describe('processOtherEntries', () => {
    it('does nothing when no other records are found', async () => {
      await processOtherEntries({
        applicationContext,
        otherRecords: [],
      });

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords,
      ).not.toHaveBeenCalled();
    });

    it('attempts to bulk import the records passed in', async () => {
      const otherEntryData = {
        docketEntryId: '123',
        entityName: 'OtherEntry',
        pk: 'other-entry|123',
        sk: 'other-entry|123',
      };

      const otherEntryDataMarshalled = {
        docketEntryId: { S: '123' },
        entityName: { S: 'OtherEntry' },
        pk: { S: 'other-entry|123' },
        sk: { S: 'other-entry|123' },
      };

      await processOtherEntries({
        applicationContext,
        otherRecords: [
          {
            dynamodb: {
              Keys: {
                pk: { S: otherEntryData.pk },
                sk: { S: otherEntryData.sk },
              },
              NewImage: otherEntryDataMarshalled,
            },
            eventName: 'MODIFY',
          },
        ],
      });

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords.mock
          .calls[0][0].records,
      ).toEqual([
        {
          dynamodb: {
            Keys: {
              pk: { S: otherEntryData.pk },
              sk: { S: otherEntryData.sk },
            },
            NewImage: otherEntryDataMarshalled,
          },
          eventName: 'MODIFY',
        },
      ]);
    });

    it('logs errors and throws an exception if bulk indexing fails', async () => {
      const otherEntryData = {
        docketEntryId: '123',
        entityName: 'OtherEntry',
        pk: 'other-entry|123',
        sk: 'other-entry|123',
      };

      const otherEntryDataMarshalled = {
        docketEntryId: { S: '123' },
        entityName: { S: 'OtherEntry' },
        pk: { S: 'other-entry|123' },
        sk: { S: 'other-entry|123' },
      };

      applicationContext
        .getPersistenceGateway()
        .bulkIndexRecords.mockReturnValueOnce({
          failedRecords: [{ id: 'failed record' }],
        });
      await expect(
        processOtherEntries({
          applicationContext,
          otherRecords: [
            {
              dynamodb: {
                Keys: {
                  pk: { S: otherEntryData.pk },
                  sk: { S: otherEntryData.sk },
                },
                NewImage: otherEntryDataMarshalled,
              },
              eventName: 'MODIFY',
            },
          ],
        }),
      ).rejects.toThrow('failed to index records');
      expect(applicationContext.logger.error).toHaveBeenCalled();
    });
  });

  describe('processWorkItemEntries', () => {
    const data = {
      docketEntryId: '123',
      entityName: 'OtherEntry',
      pk: 'other-entry|123',
      sk: 'other-entry|123',
    };

    const dataMarshalled = {
      docketEntryId: { S: '123' },
      entityName: { S: 'OtherEntry' },
      pk: { S: 'other-entry|123' },
      sk: { S: 'other-entry|123' },
    };

    it('does nothing when no other records are found', async () => {
      await processWorkItemEntries({
        applicationContext,
        workItemRecords: [],
      });

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords,
      ).not.toHaveBeenCalled();
    });

    it('attempts to bulk import the records passed in', async () => {
      await processWorkItemEntries({
        applicationContext,
        workItemRecords: [
          {
            dynamodb: {
              Keys: {
                pk: { S: data.pk },
                sk: { S: data.sk },
              },
              NewImage: dataMarshalled,
            },
            eventName: 'MODIFY',
          },
        ],
      });

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords.mock
          .calls[0][0].records,
      ).toEqual([
        {
          dynamodb: {
            Keys: {
              pk: { S: data.pk },
              sk: { S: data.sk },
            },
            NewImage: dataMarshalled,
          },
          eventName: 'MODIFY',
        },
      ]);
    });

    it('logs errors and throws an exception if bulk indexing fails', async () => {
      applicationContext
        .getPersistenceGateway()
        .bulkIndexRecords.mockReturnValueOnce({
          failedRecords: [{ id: 'failed record' }],
        });
      await expect(
        processWorkItemEntries({
          applicationContext,
          workItemRecords: [
            {
              dynamodb: {
                Keys: {
                  pk: { S: data.pk },
                  sk: { S: data.sk },
                },
                NewImage: dataMarshalled,
              },
              eventName: 'MODIFY',
            },
          ],
        }),
      ).rejects.toThrow('failed to index records');
      expect(applicationContext.logger.error).toHaveBeenCalled();
    });
  });
});
