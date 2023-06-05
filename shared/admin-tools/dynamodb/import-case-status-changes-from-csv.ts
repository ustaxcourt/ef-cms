/**
 * Ingests case status changes from a CSV and then inserts entries into each case's caseStatusHistory array
 *
 *  Example CSV:
 *     Docket,Date,Status
 *     23887-13L,3/24/2022,CAV
 *     22570-18W,3/9/2020,CAV
 *
 * usage: npx ts-node --transpile-only shared/admin-tools/dynamodb/import-case-status-changes-from-csv.ts
 */
import { requireEnvVars } from '../util';
requireEnvVars(['ENV', 'HOME', 'REGION']);

import {
  AttributeValue,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import {
  FORMATS,
  prepareDateFromEST,
} from '../../src/business/utilities/DateHandler';
import { createApplicationContext } from '../../../web-api/src/applicationContext';
// eslint-disable-next-line import/no-unresolved
import { parse } from 'csv-parse/sync';
// @ts-ignore
import fs from 'fs';

const dynamodbClient = new DynamoDBClient({ region: process.env.REGION });
const INPUT_FILE = `${process.env.HOME}/Downloads/case-status-changes.csv`;

const getCaseRecord = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
}): Promise<Record<string, AttributeValue>> => {
  const getCaseCommand = new GetItemCommand({
    Key: {
      pk: { S: `case|${docketNumber}` },
      sk: { S: `case|${docketNumber}` },
    },
    TableName: applicationContext.environment.dynamoDbTableName,
  });
  const result = await dynamodbClient.send(getCaseCommand);
  return result?.Item;
};

const putCaseStatusHistoryRecord = async ({
  applicationContext,
  caseRecord,
  date,
  updatedCaseStatus,
}: {
  applicationContext: IApplicationContext;
  caseRecord: Record<string, any>;
  date: string;
  updatedCaseStatus: string;
}): Promise<boolean> => {
  if (
    !('caseStatusHistory' in caseRecord) ||
    !('L' in caseRecord.caseStatusHistory)
  ) {
    caseRecord.caseStatusHistory = { L: [] };
  }
  caseRecord.caseStatusHistory.L.push({
    M: {
      changedBy: { S: 'System' },
      date: { S: date },
      updatedCaseStatus: { S: updatedCaseStatus },
    },
  });
  const putCaseCommand = new PutItemCommand({
    Item: caseRecord,
    TableName: applicationContext.environment.dynamoDbTableName,
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
  const data = fs.readFileSync(INPUT_FILE, 'utf8');
  return parse(data, csvOptions);
};

(async () => {
  const applicationContext = createApplicationContext({});
  const statusChangesToLog = parseCsv();
  for (const statusChange of statusChangesToLog) {
    const { updatedCaseStatus } = statusChange;
    const date = prepareDateFromEST(statusChange.date, FORMATS.MDYYYY);
    const docketNumber = statusChange.docketNumber.replace(/[^\d-]/g, '');
    const caseRecord = await getCaseRecord({
      applicationContext,
      docketNumber,
    });
    await putCaseStatusHistoryRecord({
      applicationContext,
      caseRecord,
      date,
      updatedCaseStatus,
    });
    console.log(`Added ${updatedCaseStatus} status to ${docketNumber}`);
  }
})();
