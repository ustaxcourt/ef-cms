import {
  COUNTRY_TYPES,
  DEFAULT_PRACTITIONER_BIRTH_YEAR,
} from '../shared/src/business/entities/EntityConstants';
import { formatRecord } from './bulkImportPractitionerUsers.helpers';

describe('formatRecord', () => {
  it('formats a record for a practitioner with default values for certain fields when no value is supplied', () => {
    const defaultPracticeType = 'Private';
    const defaultBarState = 'N/A';

    const initialRecord = {
      admissionsDate: '2000-11-30',
      admissionsStatus: 'Active',
      birthYear: undefined,
      'contact/address1': undefined,
      'contact/address2': 'Somewhere over the rainbow',
      'contact/countryType': COUNTRY_TYPES.INTERNATIONAL,
      'contact/postalCode': undefined,
      firstName: 'Bob',
      lastName: 'Builder',
      middleName: 'the',
      originalBarState: undefined,
      suffix: 'yeswecan',
    };

    const formattedRecord = formatRecord(initialRecord);

    expect(formattedRecord).toMatchObject({
      admissionsDate: '2000-11-30',
      admissionsStatus: 'Active',
      birthYear: DEFAULT_PRACTITIONER_BIRTH_YEAR,
      contact: {
        address1: 'Somewhere over the rainbow',
        postalCode: 'N/A',
      },
      firstName: 'Bob',
      lastName: 'Builder',
      middleName: 'the',
      originalBarState: defaultBarState,
      practiceType: defaultPracticeType,
      suffix: 'yeswecan',
    });
  });

  it('formats a record for an admitted IRS employee', () => {
    const initialRecord = {
      admissionsDate: '2000-11-30',
      admissionsStatus: 'Active',
      birthYear: '1999',
      firstName: 'Bob',
      isIrsEmployee: 'Y',
      lastName: 'Builder',
      middleName: 'the',
      suffix: 'yeswecan',
    };

    const formattedRecord = formatRecord(initialRecord);

    expect(formattedRecord).toMatchObject({
      admissionsDate: '2000-11-30',
      admissionsStatus: 'Active',
      birthYear: 1999,
      firstName: 'Bob',
      lastName: 'Builder',
      middleName: 'the',
      practiceType: 'IRS',
      suffix: 'yeswecan',
    });
  });

  it('formats a record for a non-admitted DOJ employee', () => {
    const initialRecord = {
      admissionsDate: '2000-11-30',
      admissionsStatus: 'Inactive',
      birthYear: '1999',
      firstName: 'Mike',
      isDojEmployee: 'Y',
      isIrsEmployee: 'N',
      lastName: 'Wazowski',
      middleName: '',
      suffix: '',
    };

    const formattedRecord = formatRecord(initialRecord);

    expect(formattedRecord).toMatchObject({
      admissionsDate: '2000-11-30',
      admissionsStatus: 'Inactive',
      birthYear: 1999,
      firstName: 'Mike',
      lastName: 'Wazowski',
      practiceType: 'DOJ',
    });
  });

  it('formats a record for an admitted private practitioner', () => {
    const initialRecord = {
      admissionsDate: '2000-11-30',
      admissionsStatus: 'Active',
      birthYear: 'what',
      firstName: 'Rachael',
      isDojEmployee: 'N',
      isIrsEmployee: 'N',
      lastName: 'Ray',
      middleName: '',
      suffix: '',
    };

    const formattedRecord = formatRecord(initialRecord);

    expect(formattedRecord).toMatchObject({
      admissionsDate: '2000-11-30',
      admissionsStatus: 'Active',
      birthYear: DEFAULT_PRACTITIONER_BIRTH_YEAR,
      firstName: 'Rachael',
      lastName: 'Ray',
      practiceType: 'Private',
    });
  });

  it('formats a record with a nested contact', () => {
    const initialRecord = {
      admissionsDate: '2000-11-30',
      admissionsStatus: 'Active',
      birthYear: '',
      'contact/address1': 'knows how to party',
      'contact/city': 'the city of Compton',
      'contact/countryType': COUNTRY_TYPES.DOMESTIC,
      'contact/phone': '1234567890',
      'contact/state': 'CA',
      firstName: 'Rachael',
      isDojEmployee: 'N',
      isIrsEmployee: 'N',
      lastName: 'Ray',
      middleName: 'R',
      suffix: 'Esquire',
    };

    const formattedRecord = formatRecord(initialRecord);

    expect(formattedRecord).toMatchObject({
      admissionsDate: '2000-11-30',
      admissionsStatus: 'Active',
      birthYear: DEFAULT_PRACTITIONER_BIRTH_YEAR,
      contact: {
        address1: 'knows how to party',
        city: 'the city of Compton',
        countryType: COUNTRY_TYPES.DOMESTIC,
        phone: '1234567890',
        postalCode: '00000',
        state: 'CA',
      },
      firstName: 'Rachael',
      lastName: 'Ray',
      middleName: 'R',
      practiceType: 'Private',
      suffix: 'Esquire',
    });
  });
});
