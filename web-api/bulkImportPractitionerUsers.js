const AWS = require('aws-sdk');
const axios = require('axios');
const fs = require('fs');
const parse = require('csv-parse');
const {
  COUNTRY_TYPES,
} = require('../shared/src/business/entities/EntityConstants');
const {
  createISODateString,
} = require('../shared/src/business/utilities/DateHandler');
const { gatherRecords, getCsvOptions } = require('../shared/src/tools/helpers');
const { getUserToken } = require('./storage/scripts/loadTest/loadTestHelpers');

const formatRecord = record => {
  const returnData = {};

  Object.keys(record).map(key => {
    if (record[key] === '') {
      delete record[key];
    }
  });

  returnData.firstName = record.firstName;
  returnData.middleName = record.middleName;
  returnData.lastName = record.lastName;
  returnData.suffix = record.suffix;

  returnData.admissionsDate = createISODateString(
    record.unformattedAdmissionsDate,
    'MM-DD-YYYY',
  );

  returnData.birthYear = parseInt(record.birthYear) || undefined;

  if (record.isIrsEmployee === 'Y') {
    returnData.employer = 'IRS';
  } else if (record.isDojEmployee === 'Y') {
    returnData.employer = 'DOJ';
  } else {
    returnData.employer = 'Private';
  }

  returnData.additionalPhone = record.additionalPhone;
  returnData.admissionsStatus = record.admissionsStatus;
  returnData.alternateEmail = record.alternateEmail;
  returnData.barNumber = record.barNumber;
  returnData.email = record.email;
  returnData.firmName = record.firmName;
  returnData.originalBarState = record.originalBarState;
  returnData.practitionerType = record.practitionerType;

  returnData.contact = {
    address1: record['contact/address1'],
    address2: record['contact/address2'],
    city: record['contact/city'],
    countryType: COUNTRY_TYPES.DOMESTIC,
    phone: record['contact/phone'],
    postalCode: record['contact/postalCode'],
    state: record['contact/state'],
  };

  return returnData;
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
    'role',
    'admissionsDate',
    'admissionsStatus',
    'birthYear',
    'employer',
    'practitionerType',
    'name',
    'firstName',
    'lastName',
    'suffix',
    'section',
    'userId',
    'entityName',
    'email',
    'firmName',
    'alternateEmail',
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
    .filter(api => api.name.includes(`gateway_api_${process.env.ENV}`))
    .reduce((obj, api) => {
      obj[
        api.name.replace(`_${process.env.ENV}`, '')
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
  stream.on('end', async () => {
    for (let row of output) {
      const record = formatRecord(row);

      try {
        const result = await axios.post(
          `${services['gateway_api']}/practitioners`,
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
      } catch (err) {
        console.log(`ERROR ${record.barNumber}`);
        console.log(err);
      }
    }
  });
})();

module.exports = {
  formatRecord,
};
