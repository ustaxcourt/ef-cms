#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';

const scriptConfig: ScriptConfig = {
  description:
    'read-segment - Reads <totalSegments> from the source table starting from <segment>',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  parameters: {
    segmentArg: {
      position: 0,
      required: true,
      transform: 'number',
      type: 'string',
    },
    totalSegmentsArg: {
      position: 1,
      required: true,
      transform: 'number',
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { segmentArg, totalSegmentsArg } = parseArgsAndEnvVars(scriptConfig) as {
  segmentArg: number;
  totalSegmentsArg: number;
};

const dynamodb = new DynamoDBClient({ region: 'us-east-1' });
const documentClient = DynamoDBDocument.from(dynamodb, {
  marshallOptions: { removeUndefinedValues: true },
});

const scanTableSegment = async (segment: number, totalSegments: number) => {
  let hasMoreResults = true;
  let lastKey: Record<string, any> | undefined;
  let items: Record<string, any>[] = [];
  while (hasMoreResults) {
    hasMoreResults = false;

    const results = await documentClient.scan({
      ExclusiveStartKey: lastKey,
      Segment: segment,
      TableName: process.env.SOURCE_TABLE,
      TotalSegments: totalSegments,
    });
    hasMoreResults = !!results.LastEvaluatedKey;
    lastKey = results.LastEvaluatedKey;
    if (results.Items) {
      items = [...items, ...results.Items];
    }
  }

  return items;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const items = await scanTableSegment(segmentArg, totalSegmentsArg);
  console.log(items.length);
})();
