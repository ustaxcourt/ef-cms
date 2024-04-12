import { RawUser } from '@shared/business/entities/User';
import { createApplicationContext } from '@web-api/applicationContext';
import { createOrUpdateUser } from 'scripts/user/setup-test-users';
import { environment } from '@web-api/environment';
import {
  gatherRecords,
  getCsvOptions,
} from '../../../shared/src/tools/helpers';
import {
  getDestinationTableName,
  getUserPoolId,
} from 'shared/admin-tools/util';
import { parse } from 'csv-parse';
import { readCsvFile } from '../../../web-api/importHelpers';
import { result } from 'lodash';

export const CSV_HEADERS = [
  'name',
  'judgeTitle',
  'judgeFullName',
  'email',
  'role',
  'section',
  'isSeniorJudge',
];

const { DEFAULT_ACCOUNT_PASS } = process.env;

export const init = async (csvFile, outputMap) => {
  const csvOptions = getCsvOptions(CSV_HEADERS);
  let output: RawUser[] = [];

  const data = readCsvFile(csvFile);
  const stream = parse(data, csvOptions);

  const processCsv = new Promise<void>(resolve => {
    stream.on('readable', gatherRecords(CSV_HEADERS, output));
    stream.on('end', async () => {
      for (let row of output) {
        try {
          const userPoolId = await getUserPoolId();
          const destinationTable = await getDestinationTableName();
          environment.userPoolId = userPoolId;
          environment.dynamoDbTableName = destinationTable;

          const applicationContext = createApplicationContext({});

          await createOrUpdateUser(applicationContext, {
            password: DEFAULT_ACCOUNT_PASS!,
            user: row,
          });

          console.log(`SUCCESS ${row.name}`);
          const lowerCaseName = row.name.toLowerCase();
          const { userId } = result.data;
          outputMap[lowerCaseName] = userId;
        } catch (err) {
          console.log(`ERROR ${row.name}`);
          console.log(err);
        }
      }
      resolve();
    });
  });
  await processCsv;
};
