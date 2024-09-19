import { RawUser } from '@shared/business/entities/User';
import { chunk } from 'lodash';
import { createApplicationContext } from '@web-api/applicationContext';
import { createOrUpdateUser } from '../../../shared/admin-tools/user/admin';
import { environment } from '@web-api/environment';
import { gatherRecords, getCsvOptions } from '@shared/tools/helpers';
import {
  getDestinationTableInfo,
  getUserPoolId,
} from '../../../shared/admin-tools/util';
import { parse } from 'csv-parse';
import { readCsvFile } from '../../../web-api/importHelpers';

export const CSV_HEADERS = [
  'name',
  'judgeTitle',
  'judgeFullName',
  'email',
  'role',
  'section',
  'isSeniorJudge',
  'judgePhoneNumber',
];

const { DEFAULT_ACCOUNT_PASS } = process.env;

export const init = async () => {
  const filePath = './scripts/circleci/judge/judge_users.csv';
  const csvOptions = getCsvOptions(CSV_HEADERS);
  const userPoolId = await getUserPoolId();
  const { tableName } = await getDestinationTableInfo();
  environment.userPoolId = userPoolId;
  environment.dynamoDbTableName = tableName;
  const applicationContext = createApplicationContext({});

  const output: RawUser[] = [];
  const data = readCsvFile(filePath);
  const stream = parse(data, csvOptions);

  const processCsv = new Promise<void>(resolve => {
    stream.on('readable', gatherRecords(CSV_HEADERS, output));
    stream.on('end', async () => {
      const requestChunks = chunk(output, 20); // Chunk in batches of 20 to avoid throttling by cognito.
      for (let index = 0; index < requestChunks.length; index++) {
        const currentChunk = requestChunks[index];
        await Promise.all(
          currentChunk.map(async row => {
            try {
              const { userId } = await createOrUpdateUser(applicationContext, {
                password: DEFAULT_ACCOUNT_PASS!,
                setPasswordAsPermanent: true,
                user: row,
              });

              console.log(`SUCCESS, ${row.name}, ${row.email}, ${userId}`);
            } catch (err) {
              console.log(`ERROR ${row.name}`);
              console.log(err);
            }
          }),
        );
      }
      resolve();
    });
  });
  await processCsv;
};
