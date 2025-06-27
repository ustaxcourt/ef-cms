import { marshall } from '@aws-sdk/util-dynamodb';
import { applicationContext } from '@web-api/applicationContext';
import { processStreamRecordsInteractor } from '@web-api/business/useCases/processStreamRecords/processStreamRecordsInteractor';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { DynamoDBRecord } from 'aws-lambda';
import { createReadStream } from 'fs';
import readline from 'readline';

async function processFile() {
  const rl = readline.createInterface({
    input: createReadStream('/Users/zacharyrogers/Documents/allTestDynamoRecords.txt'),
    crlfDelay: Infinity,
  });

  let scanCount = 0;
  let records: DynamoDBRecord[] = [];

  for await (const line of rl) {
    const obj: TDynamoRecord = JSON.parse(line);
    const marshalled = marshall(obj);
    const record: DynamoDBRecord = {
      dynamodb: { NewImage: marshalled as any },
      eventName: 'INSERT',
    };
    records.push(record);

    scanCount++;
    if (scanCount % 10000 === 0) {
      console.log('scan count: ', scanCount);
    }

    if (records.length >= 100) {
      await processStreamRecordsInteractor(applicationContext, {
        recordsToProcess: records,
      });
      records = [];
    }
  }

  // process any remaining records
  if (records.length > 0) {
    await processStreamRecordsInteractor(applicationContext, {
      recordsToProcess: records,
    });
  }

  console.log('Done!');
}

processFile().catch((err) => {
  console.error('Failed:', err);
});
