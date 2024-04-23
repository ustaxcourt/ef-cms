import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { formatRecord } from './bulkImportPractitionerUsers.helpers';
import { gatherRecords, getCsvOptions } from '@shared/tools/helpers';
import { getServices } from './importHelpers';
import { getUserToken } from './storage/scripts/loadTest/loadTestHelpers';
import { parse } from 'csv-parse';
import axios from 'axios';
import fs from 'fs';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const files: string[] = [];
  process.argv.forEach((val, index) => {
    if (index > 1) {
      files.push(val);
    }
  });

  const csvColumns = [
    'admissionsDate',
    'admissionsStatus',
    'birthYear',
    'practitionerType',
    'firstName',
    'lastName',
    'middleName',
    'suffix',
    'email',
    'firmName',
    'additionalPhone',
    'originalBarState',
    'barNumber',
    'contact/address1',
    'contact/address2',
    'contact/city',
    'contact/countryType',
    'contact/phone',
    'contact/postalCode',
    'contact/state',
    'isIrsEmployee',
    'isDojEmployee',
  ];

  const csvOptions = getCsvOptions(csvColumns);

  if (files.length < 1) {
    return;
  }

  const cognito = new CognitoIdentityProvider({
    region: process.env.REGION!,
  });

  const services = getServices({});

  let token = await getUserToken({
    cognito,
    env: process.env.ENV!,
    password: process.env.USTC_ADMIN_PASS!,
    username: process.env.USTC_ADMIN_USER!,
  });

  const data = fs.readFileSync(files[0], 'utf8');

  let output = [];

  const stream = parse(data, csvOptions);

  stream.on('readable', gatherRecords(csvColumns, output));
  stream.on('end', async () => {
    for (let row of output) {
      const record = formatRecord(row);
      const apiUrl = services[`gateway_api_${process.env.DEPLOYING_COLOR}`];

      try {
        const result = await axios.post(
          `${apiUrl}/practitioners`,
          { user: record },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (result.status === 200) {
          console.log(`SUCCESS ${record.barNumber}`);
        } else {
          console.log(`ERROR ${record.barNumber}`);
          console.log(result);
        }
      } catch (err: any) {
        console.log(`ERROR ${record.barNumber}`);
        if (err && err.response) {
          console.log(record);
          console.log(err.response.data);
          console.log(err.response.status);
        } else {
          console.log(err);
        }
      }
    }
  });
})();
