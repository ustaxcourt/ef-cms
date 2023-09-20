// Ingests case status changes from a CSV and then inserts entries into each case's caseStatusHistory array
//
//  Example CSV content:
//     Docket,Date,Status
//     23887-13L,3/24/2022,CAV
//     22570-18W,3/9/2020,CAV
//
// usage: npx ts-node --transpile-only shared/admin-tools/dynamodb/import-case-status-changes-from-csv.ts

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
} from '@shared/business/utilities/DateHandler';
import { createApplicationContext } from '@web-api/applicationContext';
// eslint-disable-next-line import/no-unresolved
import { SYSTEM_ROLE } from '@shared/business/entities/EntityConstants';
import { parse } from 'csv-parse/sync';
import fs from 'fs';

const dynamodbClient = new DynamoDBClient({ region: process.env.REGION });
const INPUT_FILE = `${process.env.HOME}/Downloads/case-status-changes.csv`;

const getCaseRecord = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
}): Promise<Record<string, AttributeValue> | undefined> => {
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
  const csvContent = fs.readFileSync(INPUT_FILE, 'utf8');
  return parse(csvContent, csvOptions);
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
    if (caseRecord && date) {
      const caseStatusHistoryUpdated = await putCaseStatusHistoryRecord({
        applicationContext,
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
