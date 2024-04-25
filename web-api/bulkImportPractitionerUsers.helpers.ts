import {
  COUNTRY_TYPES,
  DEFAULT_PRACTITIONER_BIRTH_YEAR,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import type { RawPractitioner } from '@shared/business/entities/Practitioner';

export const formatRecord = record => {
  const returnData: RawPractitioner = {
    additionalPhone: record.additionalPhone,
    admissionsDate: formatDateString(record.admissionsDate, FORMATS.YYYYMMDD),
    admissionsStatus: record.admissionsStatus,
    barNumber: record.barNumber,
    birthYear: '',
    email: record.email,
    employer: 'Private',
    entityName: '',
    firmName: record.firmName,
    firstName: record.firstName,
    lastName: record.lastName,
    middleName: record.middleName,
    name: '',
    originalBarState: record.originalBarState || 'N/A',
    practitionerType: record.practitionerType,
    role: ROLES.privatePractitioner,
    serviceIndicator: 'Electronic',
    suffix: record.suffix,
    userId: '',
  };

  Object.keys(record).forEach(key => {
    if (record[key] === '') {
      delete record[key];
    }
  });

  returnData.birthYear = record.birthYear
    ? String(record.birthYear)
    : String(DEFAULT_PRACTITIONER_BIRTH_YEAR);

  if (record.isIrsEmployee === 'Y') {
    returnData.employer = 'IRS';
    returnData.role = ROLES.irsPractitioner;
  } else if (record.isDojEmployee === 'Y') {
    returnData.employer = 'DOJ';
    returnData.role = ROLES.irsPractitioner;
  }

  returnData.contact = {
    address1: record['contact/address1'],
    address2: record['contact/address2'],
    city: record['contact/city'],
    country: '',
    countryType: record['contact/countryType'],
    phone: record['contact/phone'],
    postalCode: '',
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
