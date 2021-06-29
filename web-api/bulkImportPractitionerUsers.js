const AWS = require('aws-sdk');
const axios = require('axios');
const fs = require('fs');
const parse = require('csv-parse');
const {
  COUNTRY_TYPES,
  DEFAULT_PRACTITIONER_BIRTH_YEAR,
  ROLES,
} = require('../shared/src/business/entities/EntityConstants');
const {
  formatDateString,
  FORMATS,
} = require('../shared/src/business/utilities/DateHandler');
const { gatherRecords, getCsvOptions } = require('../shared/src/tools/helpers');
const { getUserToken } = require('./storage/scripts/loadTest/loadTestHelpers');

const formatRecord = record => {
  const returnData = {};

  Object.keys(record).forEach(key => {
    if (record[key] === '') {
      delete record[key];
    }
  });

  returnData.firstName = record.firstName;
  returnData.middleName = record.middleName;
  returnData.lastName = record.lastName;
  returnData.suffix = record.suffix;

  returnData.admissionsDate = formatDateString(
    record.admissionsDate,
    FORMATS.YYYYMMDD,
  );

  returnData.birthYear =
    parseInt(record.birthYear) || DEFAULT_PRACTITIONER_BIRTH_YEAR;

  if (record.isIrsEmployee === 'Y') {
    returnData.employer = 'IRS';
    returnData.role = ROLES.irsPractitioner;
  } else if (record.isDojEmployee === 'Y') {
    returnData.employer = 'DOJ';
    returnData.role = ROLES.irsPractitioner;
  } else {
    returnData.employer = 'Private';
    returnData.role = ROLES.privatePractitioner;
  }

  returnData.additionalPhone = record.additionalPhone;
  returnData.admissionsStatus = record.admissionsStatus;
  returnData.barNumber = record.barNumber;
  returnData.email = record.email;
  returnData.firmName = record.firmName;
  returnData.originalBarState = record.originalBarState || 'N/A';
  returnData.practitionerType = record.practitionerType;

  returnData.contact = {
    address1: record['contact/address1'],
    address2: record['contact/address2'],
    city: record['contact/city'],
    countryType: record['contact/countryType'],
    phone: record['contact/phone'],
    state: record['contact/state'],
  };

  if (!returnData.contact.address1 && returnData.contact.address2) {
    returnData.contact.address1 = returnData.contact.address2;
    delete returnData.contact.address2;
  }

  if (returnData.contact.countryType === COUNTRY_TYPES.DOMESTIC) {
    returnData.contact.postalCode = record['contact/postalCode'] || '00000';
  } else if (returnData.contact.countryType === COUNTRY_TYPES.INTERNATIONAL) {
    returnData.contact.postalCode = record['contact/postalCode'] || 'N/A';
  }

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
    .filter(api =>
      api.name.includes(
        `gateway_api_${process.env.ENV}_${process.env.DEPLOYING_COLOR}`,
      ),
    )
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
    username: process.env.USTC_ADMIN_USER,
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
      } catch (err) {
        console.log(`ERROR ${record.barNumber}`);
        if (err.response) {
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

module.exports = {
  formatRecord,
};
