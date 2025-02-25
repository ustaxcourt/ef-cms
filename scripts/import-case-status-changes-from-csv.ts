#!/usr/bin/env -S npx ts-node --transpile-only

import {
  AttributeValue,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import {
  FORMATS,
  prepareDateFromEST,
} from '@shared/business/utilities/DateHandler';
import { SYSTEM_ROLE } from '@shared/business/entities/EntityConstants';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from './helpers/parseArgsAndEnvVars';
import { parse } from 'csv-parse/sync';
import fs from 'fs';

const scriptConfig: ScriptConfig = {
  description:
    'import-case-status-changes-from-csv - Ingests case status changes from ' +
    "a CSV and inserts entries into each case's caseStatusHistory array.",
  environment: {
    TableName: 'DYNAMODB_TABLE_NAME',
    env: 'ENV',
    home: 'HOME',
    region: 'REGION',
  },
  requireActiveAwsSession: true,
};
const { home, region, TableName } = parseArgsAndEnvVars(scriptConfig) as {
  TableName: string;
  home: string;
  region: string;
};

const dynamodbClient = new DynamoDBClient({ region });

//  Example CSV content:
//     Docket,Date,Status
//     23887-13L,3/24/2022,CAV
//     22570-18W,3/9/2020,CAV
const INPUT_FILE = `${home}/Downloads/case-status-changes.csv`;

const getCaseRecord = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<Record<string, AttributeValue> | undefined> => {
  const getCaseCommand = new GetItemCommand({
    Key: {
      pk: { S: `case|${docketNumber}` },
      sk: { S: `case|${docketNumber}` },
    },
    TableName,
  });
  const result = await dynamodbClient.send(getCaseCommand);
  return result?.Item;
};

const putCaseStatusHistoryRecord = async ({
  caseRecord,
  date,
  updatedCaseStatus,
}: {
  caseRecord: Record<string, AttributeValue>;
  date: string;
  updatedCaseStatus: string;
}): Promise<boolean> => {
  if (
    !('caseStatusHistory' in caseRecord) ||
    typeof caseRecord.caseStatusHistory.L === 'undefined'
  ) {
    caseRecord.caseStatusHistory = { L: [] };
  }
  caseRecord.caseStatusHistory.L.push({
    M: {
      changedBy: { S: SYSTEM_ROLE },
      date: { S: date },
      updatedCaseStatus: { S: updatedCaseStatus },
    },
  });

  const putCaseCommand = new PutItemCommand({
    Item: caseRecord,
    TableName,
  });
  let result = false;
  try {
    await dynamodbClient.send(putCaseCommand);
    result = true;
  } catch (error) {
    console.log(error);
  }
  return result;
};

const parseCsv = (): Array<any> => {
  const csvOptions = {
    columns: ['docketNumber', 'date', 'updatedCaseStatus'],
    delimiter: ',',
    from_line: 2,
  };
  const csvContent = fs.readFileSync(INPUT_FILE, 'utf8');
  return parse(csvContent, csvOptions);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const statusChangesToLog = parseCsv();
  for (const statusChange of statusChangesToLog) {
    const { updatedCaseStatus } = statusChange;
    const date = prepareDateFromEST(statusChange.date, FORMATS.MDYYYY);
    const docketNumber = statusChange.docketNumber.replace(/[^\d-]/g, '');
    const caseRecord = await getCaseRecord({ docketNumber });
    if (caseRecord && date) {
      const caseStatusHistoryUpdated = await putCaseStatusHistoryRecord({
        caseRecord,
        date,
        updatedCaseStatus,
      });
      if (caseStatusHistoryUpdated) {
        console.log(`Added ${updatedCaseStatus} status to ${docketNumber}`);
      }
    }
  }
})();
