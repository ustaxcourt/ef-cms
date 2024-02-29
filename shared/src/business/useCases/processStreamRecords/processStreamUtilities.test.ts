import { applicationContext } from '../../test/createTestApplicationContext';
import {
  getApproximateCreationDateTime,
  isPractitionerMappingInsertModifyRecord,
  isPractitionerMappingRemoveRecord,
  partitionRecords,
  shouldProcessRecord,
} from './processStreamUtilities';
import type { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda';

describe('processStreamUtilities', () => {
  const mockRemoveRecord: DynamoDBRecord = {
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

  const mockCaseRecord: DynamoDBRecord = {
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

  const mockUnsearchableDocketEntryRecord: DynamoDBRecord = {
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

  const mockWorkItemRecord: DynamoDBRecord = {
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

  const mockRepliedToMessageRecord: DynamoDBRecord = {
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

  const mockModifyPrivatePractitionerMappingRecord: DynamoDBRecord = {
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

  const mockRemovePrivatePractitionerMappingRecordObject: DynamoDBRecord = {
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

  const mockModifyIrsPractitionerMappingRecord: DynamoDBRecord = {
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

  const mockRemoveIrsPractitionerMappingRecord: DynamoDBRecord = {
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

  const deploymentTimestamp = 1577854800;
  const streamEvent: DynamoDBStreamEvent = {
    Records: [
      {
        dynamodb: {
          ApproximateCreationDateTime: deploymentTimestamp + 300,
        },
      },
    ],
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
    const mockModifyRecord: DynamoDBRecord = {
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

  describe('getApproximateCreationDateTime', () => {
    it("logs an error when a stream event's ApproximateCreationDateTime value is neither a number nor a Date", () => {
      // @ts-ignore
      streamEvent.Records[0].dynamodb.ApproximateCreationDateTime =
        'not a date';

      getApproximateCreationDateTime({
        applicationContext,
        record: streamEvent.Records[0],
      });
      expect(applicationContext.logger.error).toHaveBeenCalledTimes(1);
    });

    it("converts a stream event's ApproximateCreationDateTime from Date to unix timestamp", () => {
      const timestamp = deploymentTimestamp + 300;
      const timestampMillis = timestamp * 1000;
      // eslint-disable-next-line @miovision/disallow-date/no-new-date
      const approxCreationDT = new Date(timestampMillis);
      // @ts-ignore
      streamEvent.Records[0].dynamodb.ApproximateCreationDateTime =
        approxCreationDT;

      const result = getApproximateCreationDateTime({
        applicationContext,
        record: streamEvent.Records[0],
      });
      expect(result).toEqual(timestamp);
    });

    it('returns a unix timestamp', () => {
      const timestamp = deploymentTimestamp + 300;
      // @ts-ignore
      streamEvent.Records[0].dynamodb.ApproximateCreationDateTime = timestamp;

      const result = getApproximateCreationDateTime({
        applicationContext,
        record: streamEvent.Records[0],
      });
      expect(result).toEqual(timestamp);
    });
  });

  describe('shouldProcessRecord', () => {
    beforeEach(() => {
      process.env.DEPLOYMENT_TIMESTAMP = String(deploymentTimestamp);
    });

    it('will not process records from stream events that occurred before the streams lambda was deployed', () => {
      // @ts-ignore
      streamEvent.Records[0].dynamodb.ApproximateCreationDateTime =
        deploymentTimestamp - 1;

      const result = shouldProcessRecord({
        applicationContext,
        deploymentTimestamp,
        record: streamEvent.Records[0],
      });
      expect(result).toBeFalsy();
    });

    it('will process records from stream events that occurred after the streams lambda was deployed', () => {
      // @ts-ignore
      streamEvent.Records[0].dynamodb.ApproximateCreationDateTime =
        deploymentTimestamp + 1;

      const result = shouldProcessRecord({
        applicationContext,
        deploymentTimestamp,
        record: streamEvent.Records[0],
      });
      expect(result).toBeTruthy();
    });

    it('will process records from stream events that do not have an ApproximateCreationDateTime', () => {
      // @ts-ignore
      streamEvent.Records[0].dynamodb.ApproximateCreationDateTime = undefined;

      const result = shouldProcessRecord({
        applicationContext,
        deploymentTimestamp,
        record: streamEvent.Records[0],
      });
      expect(result).toBeTruthy();
    });

    it('will process records from stream events that do not have a valid ApproximateCreationDateTime', () => {
      // @ts-ignore
      streamEvent.Records[0].dynamodb.ApproximateCreationDateTime =
        'not a date';

      const result = shouldProcessRecord({
        applicationContext,
        deploymentTimestamp,
        record: streamEvent.Records[0],
      });
      expect(result).toBeTruthy();
    });
  });
});
