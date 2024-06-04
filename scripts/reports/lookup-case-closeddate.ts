/**
 * Given a csv containing case numbers, process each row of the csv and generate a new
 * csv with the output of each processed record.  CSV must have case number in first
 * column - all other columns ignored.
 */
import { gatherRecords } from '@shared/tools/helpers';
import { parse } from 'csv-parse';
import { readCsvFile } from '../../web-api/importHelpers';
// import { createApplicationContext } from '@web-api/applicationContext';
// import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { unmarshall } from '@aws-sdk/util-dynamodb';

//step one, open csv file
// step two, loop through it and log case number for each row
// step three, look up case in dynamo for each reacord, log closedDate

export const getCaseFromDynamo = async ({
  caseNumber,
  dynamoClient,
}: {
  caseNumber: string;
  dynamoClient: DynamoDBClient;
}): Promise<Record<string, any> | undefined> => {
  // Get Docket Entry record from DB
  const command = new GetItemCommand({
    Key: {
      pk: {
        S: `case|${caseNumber}`,
      },
      sk: {
        S: `case|${caseNumber}`,
      },
    },

    TableName: process.env.DYNAMODB_TABLE_NAME,
  });

  const res = await dynamoClient.send(command);

  if (!res || !res.Item) {
    console.log(`could not find record for case|${caseNumber}`);
    return;
  }
  return unmarshall(res.Item);
};

function main() {
  // const applicationContext = createApplicationContext({});
  const dynamoClient = new DynamoDBClient({
    region: 'us-east-1',
  });

  const csvFile = process.argv[2] || './input.csv';
  // const MAX_ROWS = 50_000;
  const MAX_ROWS = 50;
  const data = readCsvFile(csvFile);
  const csvColumns = [
    'Docket No.',
    'Date Created',
    'Case Title',
    'Case Status',
    'Case Type',
    'Judge',
    'Requested Place of Trial',
    'Calendaring High Priority',
  ];

  const csvOptions = {
    columns: csvColumns,
    from_line: 2,
    relax_column_count: true,
  };
  const stream = parse(data, csvOptions);
  let output = [];

  // console.warn(`csv file: ${csvFile}`);
  // console.warn(`stream: ${stream}`);
  stream.on('readable', gatherRecords(csvColumns, output));
  let curRow = 0;
  stream.on('end', async () => {
    for (let row of output) {
      curRow++;
      if (curRow > MAX_ROWS) {
        console.warn('max rows hit -  stopping');
        break;
      }
      let caseNumber = row['Docket No.'];

      try {
        let caseInfo = await getCaseFromDynamo({ caseNumber, dynamoClient });
        let closedDate = formatDateString(
          caseInfo?.closedDate,
          FORMATS.MMDDYYYY,
        );
        console.log(`${caseInfo?.docketNumber},${closedDate}`);
      } catch (ex) {
        console.error('Error: ', ex);
      }
    }
  });
}

main();
