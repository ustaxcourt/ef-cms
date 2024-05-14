import * as fs from 'fs';
import { type Client } from '@opensearch-project/opensearch';
import { createApplicationContext } from '@web-api/applicationContext';
import { efcmsDocketEntryIndex } from '../web-api/elasticsearch/efcms-docket-entry-mappings';

const INPUT_LINES_MAX = 5000;

// Function to read a text file and return an array of lines (credit chatgpt)
function readFileLines(filePath: string): string[] {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return fileContent.split('\n');
  } catch (err) {
    console.error('Error reading file:', err);
    return [];
  }
}

// Function to write an object to a JSON file (credit chatgpt)
function writeObjectToFile(obj: any, filePath: string): void {
  try {
    const json = JSON.stringify(obj, null, 2);
    fs.writeFileSync(filePath, json, 'utf-8');
  } catch (err) {
    console.error('Error writing file:', err);
  }
}

async function lookupDocketNumber(
  client: Client,
  docketEntryId: string,
): Promise<any> {
  let query = {
    bool: {
      must: [
        {
          term: {
            'entityName.S': 'DocketEntry',
          },
        },
        {
          term: {
            'docketEntryId.S': docketEntryId,
          },
        },
      ],
      must_not: [
        {
          exists: {
            field: 'isFileAttached.BOOL',
          },
        },
      ],
    },
  };
  let results = await client.search({
    _source: ['docketEntryId.S', 'docketNumber.S'],
    body: {
      query,
    },
    // index: 'efcms-docket-entry',
    index: efcmsDocketEntryIndex,
  });
  let hit = results.body.hits.hits[0]?._source;
  // console.log(JSON.stringify(hit, null, 4));
  if (hit) {
    console.log(`${hit.docketNumber.S}, ${hit.docketEntryId.S}`);
  }
  return hit;
}

async function lookupDocketNumbers(
  client: Client,
  docketEntryIds: string[],
): Promise<any[]> {
  let queryCount = 0;

  console.log('docketNumber, docketEntryId');
  let results: any[] = [];
  for (let docketEntryId of docketEntryIds) {
    queryCount++;
    if (queryCount > INPUT_LINES_MAX) {
      console.warn('limit hit -  terminating');
      // process.exit(0);
      break;
    }
    // console.log(`lookup docket number for docketEntry: ${docketEntryId}`);
    let result = await lookupDocketNumber(client, docketEntryId);
    if (result) {
      results.push(result);
    }
  }
  return results;
}

async function main() {
  const applicationContext = createApplicationContext({});
  const searchClient: Client = applicationContext.getSearchClient();

  // Read the file path from command line arguments
  if (process.argv.length < 3) {
    console.error(
      `Usage: ts-node ${process.argv[1]} <docketentry_file_path> [outputjson_path]`,
    );
    process.exit(1);
  }

  const filePath = process.argv[2];
  const lines = readFileLines(filePath);
  //console.log(lines);
  let results = await lookupDocketNumbers(searchClient, lines);
  // 4th arg specifies output file
  if (process.argv.length == 4) {
    let outpath = process.argv[3];
    console.warn(`writing json to ${outpath}`);
    writeObjectToFile(results, outpath);
  }
}

void main();
