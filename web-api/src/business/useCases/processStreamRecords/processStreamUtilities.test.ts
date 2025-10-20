import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  getApproximateCreationDateTime,
  shouldProcessRecord,
} from './processStreamUtilities';
import type { DynamoDBStreamEvent } from 'aws-lambda';
import { DateTime } from 'luxon';

describe('processStreamUtilities', () => {
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
      const approxCreationDT = DateTime.fromMillis(timestampMillis).toJSDate();
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
