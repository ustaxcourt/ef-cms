import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { createApplicationContext } from '@web-api/applicationContext';
import { readFileSync } from 'fs';
import { unmarshall } from '@aws-sdk/util-dynamodb';

//max number of items this script will process
// const FIX_COUNT_MAX = 10;
const FIX_COUNT_MAX = 5000;
// set this to false if you actually want to write updated records to dynamo
const PERFORM_UPDATE = false;

// Function to read a JSON file and parse its contents into an object
export function readJsonFile(filePath: string): any {
  try {
    const fileContent = readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (err) {
    console.error('Error reading file:', err);
    return null;
  }
}

export const getDocumentFromDynamo = async ({
  docketEntryId,
  docketNumber,
}: {
  docketEntryId: string;
  docketNumber: string;
}): Promise<Record<string, any> | undefined> => {
  const dynamoClient = new DynamoDBClient({
    region: 'us-east-1',
  });

  // Get Docket Entry record from DB
  const command = new GetItemCommand({
    Key: {
      pk: {
        S: `case|${docketNumber}`,
      },
      sk: {
        S: `docket-entry|${docketEntryId}`,
      },
    },

    TableName: process.env.DYNAMODB_TABLE_NAME,
  });

  const res = await dynamoClient.send(command);

  if (!res || !res.Item) {
    console.log(
      `could not find record for case|${docketNumber} docket-entry|${docketEntryId}`,
    );
    return;
  }
  return unmarshall(res.Item);
};

export async function fixAndUpdateDocumentEntries(
  applicationContext: IApplicationContext,
  rawDocumentEntries: any[],
) {
  let docketEntries = rawDocumentEntries.map(rde => {
    // console.log(`fixing: docketEntry ${rde.docketEntryId.S}`);
    console.log(`fixing: docketEntry ${JSON.stringify(rde.docketEntryId)}`);

    let de = new DocketEntry(rde, { applicationContext });
    de.validate();
    de.isFileAttached = true;
    return de;
  });

  if (PERFORM_UPDATE) {
    console.warn('::ACTUALLY UPDATING DYNAMO NOW::');
    for (let de of docketEntries) {
      let { docketEntryId, docketNumber } = de;
      console.log(`writing updated docket entry to dynamo: ${docketEntryId}`);
      await applicationContext.getPersistenceGateway().updateDocketEntry({
        applicationContext,
        docketEntryId,
        docketNumber,
        document: de,
      });
    }
  }
}

export async function main() {
  // Read the file path from command line arguments
  // Must have {docketNumber, docketEntryId} in unmarshalled format
  if (process.argv.length < 3) {
    console.error(`Usage: ts-node ${process.argv[1]} <docketentry_json_path>`);
    process.exit(1);
  }
  const filePath = process.argv[2];
  const docsToFix = readJsonFile(filePath) as any[];
  const applicationContext = createApplicationContext({});

  let rawDocsToFix = [] as any[];
  for (let de of docsToFix) {
    console.log(`loading ${de.docketEntryId.S}`);
    let rawdoc = await getDocumentFromDynamo({
      docketEntryId: de.docketEntryId.S,
      docketNumber: de.docketNumber.S,
    });
    rawDocsToFix.push(rawdoc);
    if (rawDocsToFix.length > FIX_COUNT_MAX) {
      console.warn(
        `limit hit - only processing ${rawDocsToFix.length} records`,
      );
      break;
    }
  }

  //   console.log(rawDocsToFix);

  await fixAndUpdateDocumentEntries(applicationContext, rawDocsToFix);
}

void main();
