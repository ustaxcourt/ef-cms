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
      isAdmitted: true,
      name: 'Bob the Builder yeswecan',
      role: 'irsPractitioner',
      section: 'irsPractitioner',
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
      isAdmitted: false,
      name: 'Mike Wazowski',
      role: 'irsPractitioner',
      section: 'irsPractitioner',
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
      isAdmitted: true,
      name: 'Rachael Ray',
      role: 'privatePractitioner',
      section: 'privatePractitioner',
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
      middleName: '',
      phone: '1234567890',
      postalCode: '11111',
      state: 'CA',
      suffix: '',
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
        countryType: 'domestic',
        phone: '1234567890',
        postalCode: '11111',
        state: 'CA',
      },
      employer: 'Private',
      isAdmitted: true,
      name: 'Rachael Ray',
      role: 'privatePractitioner',
      section: 'privatePractitioner',
    });
  });
});
