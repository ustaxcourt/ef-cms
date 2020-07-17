const {
  COUNTRY_TYPES,
} = require('../shared/src/business/entities/EntityConstants');
const { formatRecord } = require('./bulkImportPractitionerUsers');

describe('formatRecord', () => {
  it('formats a record for an admitted IRS employee', () => {
    const initialRecord = {
      admissionsStatus: 'Active',
      birthYear: '1999',
      firstName: 'Bob',
      isIrsEmployee: 'Y',
      lastName: 'Builder',
      middleName: 'the',
      suffix: 'yeswecan',
      unformattedAdmissionsDate: '11-30-2000',
    };

    const formattedRecord = formatRecord(initialRecord);

    expect(formattedRecord).toMatchObject({
      admissionsDate: '2000-11-30T05:00:00.000Z',
      admissionsStatus: 'Active',
      birthYear: 1999,
      employer: 'IRS',
      firstName: 'Bob',
      lastName: 'Builder',
      middleName: 'the',
      suffix: 'yeswecan',
    });
  });

  it('formats a record for a non-admitted DOJ employee', () => {
    const initialRecord = {
      admissionsStatus: 'Inactive',
      birthYear: '1999',
      firstName: 'Mike',
      isDojEmployee: 'Y',
      isIrsEmployee: 'N',
      lastName: 'Wazowski',
      middleName: '',
      suffix: '',
      unformattedAdmissionsDate: '11-30-2000',
    };

    const formattedRecord = formatRecord(initialRecord);

    expect(formattedRecord).toMatchObject({
      admissionsDate: '2000-11-30T05:00:00.000Z',
      admissionsStatus: 'Inactive',
      birthYear: 1999,
      employer: 'DOJ',
      firstName: 'Mike',
      lastName: 'Wazowski',
    });
  });

  it('formats a record for an admitted private practitioner', () => {
    const initialRecord = {
      admissionsStatus: 'Active',
      birthYear: 'what',
      firstName: 'Rachael',
      isDojEmployee: 'N',
      isIrsEmployee: 'N',
      lastName: 'Ray',
      middleName: '',
      suffix: '',
      unformattedAdmissionsDate: '11-30-2000',
    };

    const formattedRecord = formatRecord(initialRecord);

    expect(formattedRecord).toMatchObject({
      admissionsDate: '2000-11-30T05:00:00.000Z',
      admissionsStatus: 'Active',
      birthYear: undefined,
      employer: 'Private',
      firstName: 'Rachael',
      lastName: 'Ray',
    });
  });

  it('formats a record with a nested contact', () => {
    const initialRecord = {
      address1: 'knows how to party',
      admissionsStatus: 'Active',
      birthYear: '',
      city: 'the city of Compton',
      firstName: 'Rachael',
      isDojEmployee: 'N',
      isIrsEmployee: 'N',
      lastName: 'Ray',
      middleName: 'R',
      phone: '1234567890',
      postalCode: '11111',
      state: 'CA',
      suffix: 'Esquire',
      unformattedAdmissionsDate: '11-30-2000',
    };

    const formattedRecord = formatRecord(initialRecord);

    expect(formattedRecord).toMatchObject({
      admissionsDate: '2000-11-30T05:00:00.000Z',
      admissionsStatus: 'Active',
      birthYear: undefined,
      contact: {
        address1: 'knows how to party',
        city: 'the city of Compton',
        countryType: COUNTRY_TYPES.DOMESTIC,
        phone: '1234567890',
        postalCode: '11111',
        state: 'CA',
      },
      employer: 'Private',
      firstName: 'Rachael',
      lastName: 'Ray',
      middleName: 'R',
      suffix: 'Esquire',
    });
  });
});
