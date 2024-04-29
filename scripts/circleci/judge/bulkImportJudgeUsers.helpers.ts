import { gatherRecords, getCsvOptions } from '@shared/tools/helpers';
import {
  getServices,
  getToken,
  readCsvFile,
} from '../../../web-api/importHelpers';
import { parse } from 'csv-parse';
import axios from 'axios';

export const CSV_HEADERS = [
  'name',
  'judgeTitle',
  'judgeFullName',
  'email',
  'role',
  'section',
  'isSeniorJudge',
];

type judgeUser = {
  email: string;
  isSeniorJudge: string;
  judgeFullName: string;
  judgeTitle: string;
  name: string;
  role: string;
  section: string;
};

export const init = async (csvFile: string, outputMap: {}) => {
  const csvOptions = getCsvOptions(CSV_HEADERS);
  let output: judgeUser[] = [];

  const token = await getToken();
  const data = readCsvFile(csvFile);
  const stream = parse(data, csvOptions);

  const processCsv = new Promise<void>(resolve => {
    stream.on('readable', gatherRecords(CSV_HEADERS, output));
    stream.on('end', async () => {
      for (let row of output) {
        try {
          let endpoint: string;

          if (process.env.ENV === 'local') {
            endpoint = 'http://localhost:4000/users';
          } else {
            const services = await getServices({});
            endpoint = `${
              services[`gateway_api_${process.env.DEPLOYING_COLOR}`]
            }/users`;
          }

          const result = await axios.post(
            endpoint,
            { ...row, password: process.env.DEFAULT_ACCOUNT_PASS },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
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
