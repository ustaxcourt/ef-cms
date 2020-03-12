const AWS = require('aws-sdk');
const axios = require('axios');
const fs = require('fs');
const parse = require('csv-parse');
const {
  createISODateString,
} = require('../shared/src/business/utilities/DateHandler');
const { gatherRecords, getCsvOptions } = require('../shared/src/tools/helpers');
const { getUserToken } = require('./storage/scripts/loadTest/loadTestHelpers');

const formatRecord = record => {
  const nameArray = [
    record.firstName,
    record.middleName,
    record.lastName,
    record.suffix,
  ].filter(item => item);
  record.name = nameArray.join(' ');

  record.admissionsDate = createISODateString(
    record.unformattedAdmissionsDate,
    'MM-DD-YYYY',
  );

  record.birthYear = parseInt(record.birthYear) || undefined;

  record.isAdmitted = record.admissionsStatus === 'Active';

  if (record.isIrsEmployee === 'Y') {
    record.employer = 'IRS';
    record.role = 'irsPractitioner';
    record.section = 'irsPractitioner';
  } else if (record.isDojEmployee === 'Y') {
    record.employer = 'DOJ';
    record.role = 'irsPractitioner';
    record.section = 'irsPractitioner';
  } else {
    record.employer = 'Private';
    record.role = 'privatePractitioner';
    record.section = 'privatePractitioner';
  }

  Object.keys(record).map(key => {
    if (record[key] === '') {
      delete record[key];
    }
  });

  return record;
};

/* istanbul ignore next */
/* eslint no-console: "off"*/
(async () => {
  const files = [];
  process.argv.forEach((val, index) => {
    if (index > 1) {
      files.push(val);
    }
  });

  const csvColumns = [
    'barNumber',
    'lastName',
    'firstName',
    'middleName',
    'suffix',
    'firmName',
    'address1',
    'address2',
    'city',
    'state',
    'postalCode',
    'unformattedAdmissionsDate',
    'originalBarState',
    'birthYear',
    'practitionerType',
    'admissionsStatus',
    'email',
    'alternateEmail',
    'phone',
    'additionalPhone',
    'isIrsEmployee',
    'isDojEmployee',
  ];

  const csvOptions = getCsvOptions(csvColumns);

  if (files.length < 1) {
    return;
  }

  const cognito = new AWS.CognitoIdentityServiceProvider({
    region: process.env.REGION,
  });
  const apigateway = new AWS.APIGateway({
    region: process.env.REGION,
  });
  const { items: apis } = await apigateway
    .getRestApis({ limit: 200 })
    .promise();

  const services = apis
    .filter(api => api.name.includes(`${process.env.ENV}-ef-cms`))
    .reduce((obj, api) => {
      obj[
        api.name.replace(`${process.env.ENV}-`, '')
      ] = `https://${api.id}.execute-api.${process.env.REGION}.amazonaws.com/${process.env.ENV}`;
      return obj;
    }, {});

  let token = await getUserToken({
    cognito,
    env: process.env.ENV,
    password: process.env.USTC_ADMIN_PASS,
    username: 'ustcadmin@example.com',
  });

  const data = fs.readFileSync(files[0], 'utf8');

  let output = [];

  const stream = parse(data, csvOptions);

  stream.on('readable', gatherRecords(csvColumns, output));
  stream.on('end', () => {
    output.forEach(async row => {
      const record = formatRecord(row);

      try {
        const result = await axios.post(
          `${services['ef-cms-users-green']}/attorney`,
          { user: record },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (result.status === 200) {
          console.log(`SUCCESS ${record.name} ${record.barNumber}`);
        } else {
          console.log(`ERROR ${record.name} ${record.barNumber}`);
          console.log(result);
        }
      } catch (err) {
        console.log(`ERROR ${record.name} ${record.barNumber}`);
        console.log(err);
      }
    });
  });
})();

module.exports = {
  formatRecord,
};
