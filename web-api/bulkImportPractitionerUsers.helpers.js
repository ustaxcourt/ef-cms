const {
  COUNTRY_TYPES,
  DEFAULT_PRACTITIONER_BIRTH_YEAR,
  ROLES,
} = require('../shared/src/business/entities/EntityConstants');
const {
  formatDateString,
  FORMATS,
} = require('../shared/src/business/utilities/DateHandler');

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

module.exports = {
  formatRecord,
};
