/* eslint-disable max-lines */
const {
  isPractitionerMappingInsertModifyRecord,
  isPractitionerMappingRemoveRecord,
  partitionRecords,
  processOtherEntries,
  processPractitionerMappingEntries,
  processRemoveEntries,
  processWorkItemEntries,
} = require('./processStreamUtilities');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('processStreamUtilities', () => {
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

  const mockUnsearchableDocketEntryRecord = {
    dynamodb: {
      NewImage: {
        entityName: {
          S: 'DocketEntry',
        },
        pk: {
          S: 'case|123-45',
        },
        sk: {
          S: 'docket-entry|5b928df4-2b58-463a-bfaa-eefece6af2a0',
        },
      },
    },
  };

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

  const mockRepliedToMessageRecord = {
    dynamodb: {
      NewImage: {
        docketNumber: {
          S: '123-45',
        },
        entityName: {
          S: 'Message',
        },
        isRepliedTo: {
          BOOL: true,
        },
        messageId: {
          S: 'a73c3ff5-2daf-4bbd-91d1-e8e7543346e0',
        },
        pk: {
          S: 'case|123-45',
        },
        sk: {
          S: 'message|229f79aa-22d1-426e-98e2-5d9f2af472b6',
        },
      },
    },
  };

  const mockModifyPrivatePractitionerMappingRecord = {
    dynamodb: {
      NewImage: {
        entityName: {
          S: 'PrivatePractitioner',
        },
        pk: {
          S: 'case|123-45',
        },
        sk: {
          S: 'privatePractitioner|PT1234',
        },
      },
    },
    eventName: 'MODIFY',
  };

  const mockRemovePrivatePractitionerMappingRecordObject = {
    dynamodb: {
      OldImage: {
        entityName: {
          S: 'PrivatePractitioner',
        },
        pk: {
          S: 'case|123-45',
        },
        sk: {
          S: 'privatePractitioner|PT1234',
        },
      },
    },
    eventName: 'REMOVE',
  };

  const mockModifyIrsPractitionerMappingRecord = {
    dynamodb: {
      NewImage: {
        entityName: {
          S: 'IrsPractitioner',
        },
        pk: {
          S: 'case|123-45',
        },
        sk: {
          S: 'irsPractitioner|PT1234',
        },
      },
    },
    eventName: 'MODIFY',
  };

  const mockRemoveIrsPractitionerMappingRecord = {
    dynamodb: {
      OldImage: {
        entityName: {
          S: 'IrsPractitioner',
        },
        pk: {
          S: 'case|123-45',
        },
        sk: {
          S: 'irsPractitioner|PT1234',
        },
      },
    },
    eventName: 'REMOVE',
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .bulkDeleteRecords.mockReturnValue({ failedRecords: [] });

    applicationContext
      .getPersistenceGateway()
      .bulkIndexRecords.mockReturnValue({ failedRecords: [] });
  });

  describe('partitionRecords', () => {
    const mockModifyRecord = {
      dynamodb: {
        NewImage: {
          pk: {
            S: '',
          },
          sk: {
            S: '',
          },
        },
      },
      eventName: 'MODIFY',
    };

    const mockPrivatePractitionerRecord = {
      dynamodb: {
        NewImage: {
          entityName: {
            S: 'PrivatePractitioner',
          },
          pk: {
            S: 'case|123-45',
          },
          sk: {
            S: 'privatePractitioner|77590152-a13d-4973-bb38-37221146c30e',
          },
        },
      },
    };

    const mockIrsPractitionerRecord = {
      dynamodb: {
        NewImage: {
          entityName: {
            S: 'IrsPractitioner',
          },
          pk: {
            S: 'case|123-45',
          },
          sk: {
            S: 'irsPractitioner|77590152-a13d-4973-bb38-37221146c30e',
          },
        },
      },
    };

    const mockOtherRecord = {
      dynamodb: {
        NewImage: {
          entityName: {
            S: 'notARealEntity',
          },
          pk: {
            S: 'turkey|14e9ac5e-e47d-4ab8-af09-de812fc51daa',
          },
          sk: {
            S: 'gravy|fef4d06e-9e60-4bb6-916f-cca6969abe2e',
          },
        },
      },
    };

    it('should add a record to removeRecords when the record event is "REMOVE"', () => {
      const result = partitionRecords([mockRemoveRecord, mockModifyRecord]);

      expect(result.removeRecords).toEqual([mockRemoveRecord]);
    });

    it('should add a record to docketEntryRecords when the record entityName is "DocketEntry"', () => {
      const result = partitionRecords([
        mockWorkItemRecord,
        mockUnsearchableDocketEntryRecord,
      ]);

      expect(result.docketEntryRecords).toEqual([
        mockUnsearchableDocketEntryRecord,
      ]);
    });

    it('should add a record to caseEntityRecords when the record entityName is "Case"', () => {
      const result = partitionRecords([mockWorkItemRecord, mockCaseRecord]);

      expect(result.caseEntityRecords).toEqual([mockCaseRecord]);
    });

    it('should add a record to workItemRecords when the record entityName is "WorkItem"', () => {
      const result = partitionRecords([mockWorkItemRecord, mockCaseRecord]);

      expect(result.workItemRecords).toEqual([mockWorkItemRecord]);
    });

    it('should add a record to privatePractitionerMappingRecords when the record entityName is "PrivatePractitioner", the pk begins with "case|" and the sk begins with "privatePractitioner|"', () => {
      const result = partitionRecords([
        mockWorkItemRecord,
        mockPrivatePractitionerRecord,
      ]);

      expect(result.practitionerMappingRecords).toEqual([
        mockPrivatePractitionerRecord,
      ]);
    });

    it('should add a record to irsPractitionerMappingRecords when the record entityName is "IrsPractitioner", the pk begins with "case|" and the sk begins with "irsPractitioner|"', () => {
      const result = partitionRecords([
        mockIrsPractitionerRecord,
        mockWorkItemRecord,
      ]);

      expect(result.practitionerMappingRecords).toEqual([
        mockIrsPractitionerRecord,
      ]);
    });

    it('should add a record to workItemRecords when the record entityName is "Message"', () => {
      const result = partitionRecords([
        mockWorkItemRecord,
        mockRepliedToMessageRecord,
      ]);

      expect(result.messageRecords).toEqual([mockRepliedToMessageRecord]);
    });

    it('should return all records that did not match any of the previous filter expressions as "otherRecords"', () => {
      const result = partitionRecords([
        mockRepliedToMessageRecord,
        mockOtherRecord,
      ]);

      expect(result.otherRecords).toEqual([mockOtherRecord]);
    });
  });

  describe('processRemoveEntries', () => {
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

  describe('processWorkItemEntries', () => {
    it('should do nothing when no work item records are found', async () => {
      await processWorkItemEntries({
        applicationContext,
        workItemRecords: [],
      });

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords,
      ).not.toHaveBeenCalled();
    });

    it('should index the provided work item record', async () => {
      await processWorkItemEntries({
        applicationContext,
        workItemRecords: [mockWorkItemRecord],
      });

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords.mock
          .calls[0][0].records,
      ).toEqual([mockWorkItemRecord]);
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
      ).rejects.toThrow('failed to index records');

      expect(applicationContext.logger.error).toHaveBeenCalled();
    });
  });

  describe('processPractitionerMappingEntries', () => {
    const mockPractitionerMappingEntries = [
      mockModifyIrsPractitionerMappingRecord,
      mockModifyPrivatePractitionerMappingRecord,
    ];

    it('should do nothing when no practitioner mapping records are found', async () => {
      await processPractitionerMappingEntries({
        applicationContext,
        practitionerMappingRecords: [],
      });

      expect(
        applicationContext.getPersistenceGateway().getCaseMetadataWithCounsel,
      ).not.toHaveBeenCalled();
    });

    it('should retrieve and index each case for each provided practitioner mapping record', async () => {
      const docketNumberInPractitionerMapping =
        mockModifyIrsPractitionerMappingRecord.dynamodb.NewImage.pk.S.split(
          '|',
        )[1];

      applicationContext
        .getPersistenceGateway()
        .getCaseMetadataWithCounsel.mockReturnValue(mockCaseRecord);

      await processPractitionerMappingEntries({
        applicationContext,
        practitionerMappingRecords: mockPractitionerMappingEntries,
      });

      expect(
        applicationContext.getPersistenceGateway().getCaseMetadataWithCounsel,
      ).toHaveBeenCalledTimes(mockPractitionerMappingEntries.length);
      expect(
        applicationContext.getPersistenceGateway().getCaseMetadataWithCounsel
          .mock.calls[0][0].docketNumber,
      ).toEqual(docketNumberInPractitionerMapping);
      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords,
      ).toHaveBeenCalled();
    });

    it('should log an error and throw an exception when bulk index returns failed records', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCaseMetadataWithCounsel.mockReturnValue(mockCaseRecord);

      applicationContext
        .getPersistenceGateway()
        .bulkIndexRecords.mockReturnValueOnce({
          failedRecords: [{ id: 'failed record' }],
        });

      await expect(
        processPractitionerMappingEntries({
          applicationContext,
          practitionerMappingRecords: mockPractitionerMappingEntries,
        }),
      ).rejects.toThrow('failed to index practitioner mapping records');

      expect(applicationContext.logger.error).toHaveBeenCalled();
    });
  });

  describe('processOtherEntries', () => {
    const mockOtherRecord = {
      docketEntryId: { S: '123' },
      entityName: { S: 'OtherEntry' },
      pk: { S: 'other-entry|123' },
      sk: { S: 'other-entry|123' },
    };

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
      await processOtherEntries({
        applicationContext,
        otherRecords: [mockOtherRecord],
      });

      expect(
        applicationContext.getPersistenceGateway().bulkIndexRecords.mock
          .calls[0][0].records,
      ).toEqual([mockOtherRecord]);
    });

    it('should log an error and throw an exception when bulk index returns failed records', async () => {
      applicationContext
        .getPersistenceGateway()
        .bulkIndexRecords.mockReturnValueOnce({
          failedRecords: [{ id: 'failed record' }],
        });

      await expect(
        processOtherEntries({
          applicationContext,
          otherRecords: [mockOtherRecord],
        }),
      ).rejects.toThrow('failed to index records');
      expect(applicationContext.logger.error).toHaveBeenCalled();
    });
  });

  describe('isPractitionerMappingRemoveRecord', () => {
    it('should return true when the record is a private practitioner mapping record being removed', () => {
      const result = isPractitionerMappingRemoveRecord(
        mockRemovePrivatePractitionerMappingRecordObject,
      );

      expect(result).toBe(true);
    });

    it('should return false when the record is a private practitioner mapping record being modified', () => {
      const result = isPractitionerMappingRemoveRecord(
        mockModifyPrivatePractitionerMappingRecord,
      );

      expect(result).toBe(false);
    });

    it('should return true when the record is an IRS practitioner mapping record being removed', () => {
      const result = isPractitionerMappingRemoveRecord(
        mockRemoveIrsPractitionerMappingRecord,
      );

      expect(result).toBe(true);
    });

    it('should return false when the record is an IRS practitioner mapping record being modified', () => {
      const result = isPractitionerMappingRemoveRecord(
        mockModifyIrsPractitionerMappingRecord,
      );

      expect(result).toBe(false);
    });
  });

  describe('isPractitionerMappingInsertModifyRecord', () => {
    it('should return true when the record is a private practitioner mapping record being modified', () => {
      const result = isPractitionerMappingInsertModifyRecord(
        mockModifyPrivatePractitionerMappingRecord,
      );

      expect(result).toBe(true);
    });

    it('should return false when the record is a private practitioner mapping record being removed', () => {
      const result = isPractitionerMappingInsertModifyRecord(
        mockRemovePrivatePractitionerMappingRecordObject,
      );

      expect(result).toBe(false);
    });

    it('should return true when the record is an IRS practitioner mapping record being modified', () => {
      const result = isPractitionerMappingInsertModifyRecord(
        mockModifyIrsPractitionerMappingRecord,
      );

      expect(result).toBe(true);
    });

    it('should return false when the record is an IRS practitioner mapping record being removed', () => {
      const result = isPractitionerMappingInsertModifyRecord(
        mockRemoveIrsPractitionerMappingRecord,
      );

      expect(result).toBe(false);
    });
  });
});
