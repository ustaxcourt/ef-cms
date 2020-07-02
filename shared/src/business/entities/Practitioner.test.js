const { COUNTRY_TYPES, ROLES } = require('./EntityConstants');
const { Practitioner } = require('./Practitioner');

describe('Practitioner', () => {
  it('Creates a valid Practitioner with all required fields', () => {
    const user = new Practitioner({
      admissionsDate: '2019-03-01T21:40:46.415Z',
      admissionsStatus: 'Active',
      barNumber: 'PT20001',
      birthYear: 2019,
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        country: 'Brazil',
        countryType: COUNTRY_TYPES.INTERNATIONAL,
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      employer: 'Private',
      firmName: 'GW Law Offices',
      firstName: 'Test',
      lastName: 'Practitioner',
      name: 'Test Practitioner',
      originalBarState: 'Illinois',
      practitionerType: 'Attorney',
      role: ROLES.Practitioner,
      userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
    });
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates an invalid Practitioner with missing required fields', () => {
    const user = new Practitioner({
      role: ROLES.Practitioner,
    });
    expect(user.isValid()).toBeFalsy();
  });

  it('Creates an invalid Practitioner with invalid employer option', () => {
    const user = new Practitioner({
      admissionsDate: '2019-03-01T21:40:46.415Z',
      admissionsStatus: 'Active',
      barNumber: 'PT20001',
      birthYear: 2019,
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        country: 'Brazil',
        countryType: COUNTRY_TYPES.INTERNATIONAL,
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      employer: 'Something else',
      firstName: 'Test',
      lastName: 'Practitioner',
      name: 'Test Practitioner',
      practitionerType: 'Attorney',
      role: ROLES.Practitioner,
      userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
    });
    expect(user.isValid()).toBeFalsy();
  });

  it('Creates an invalid Practitioner with invalid practitionerType option', () => {
    const user = new Practitioner({
      admissionsDate: '2019-03-01T21:40:46.415Z',
      admissionsStatus: 'Active',
      barNumber: 'PT20001',
      birthYear: 2019,
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        country: 'Brazil',
        countryType: COUNTRY_TYPES.INTERNATIONAL,
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      employer: 'Something else',
      firmName: 'GW Law Offices',
      firstName: 'Test',
      lastName: 'Practitioner',
      name: 'Test Practitioner',
      practitionerType: 'Purple',
      role: ROLES.Practitioner,
      userId: 'ec4fe2e7-52cf-4084-84de-d8e8d151e927',
    });
    expect(user.isValid()).toBeFalsy();
  });

  it('Creates an invalid Practitioner with invalid admissionsStatus option', () => {
    const user = new Practitioner({
      admissionsDate: '2019-03-01T21:40:46.415Z',
      admissionsStatus: 'Invalid',
      barNumber: 'PT20001',
      birthYear: 2019,
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        country: 'Brazil',
        countryType: COUNTRY_TYPES.INTERNATIONAL,
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      employer: 'Something else',
      firmName: 'GW Law Offices',
      firstName: 'Test',
      lastName: 'Practitioner',
      name: 'Test Practitioner',
      practitionerType: 'Purple',
      role: ROLES.Practitioner,
      userId: 'ec4fe2e7-52cf-4084-84de-d8e8d151e927',
    });
    expect(user.isValid()).toBeFalsy();
  });

  it('should fail validation when role is "inactivePractitioner" and admissionsStatus is Active', () => {
    const user = new Practitioner({
      admissionsStatus: 'Active',
      employer: 'IRS',
      role: ROLES.inactivePractitioner,
    });

    expect(user.isValid()).toBeFalsy();
  });

  it('should pass validation when role is "inactivePractitioner" and admissionsStatus is not Active', () => {
    const user = new Practitioner({
      admissionsDate: '2019-03-01T21:40:46.415Z',
      admissionsStatus: 'Deceased',
      barNumber: 'PT20001',
      birthYear: 2019,
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        country: 'Brazil',
        countryType: COUNTRY_TYPES.INTERNATIONAL,
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      employer: 'Private',
      firmName: 'GW Law Offices',
      firstName: 'Test',
      lastName: 'Practitioner',
      name: 'Test Practitioner',
      originalBarState: 'Illinois',
      practitionerType: 'Attorney',
      role: ROLES.inactivePractitioner,
      userId: 'ec4fe2e7-52cf-4084-84de-d8e8d151e927',
    });

    expect(user.isValid()).toBeTruthy();
  });

  it('should pass validation when role is "privatePractitioner" and admissionsStatus is Active', () => {
    const user = new Practitioner({
      admissionsDate: '2019-03-01T21:40:46.415Z',
      admissionsStatus: 'Active',
      barNumber: 'PT20001',
      birthYear: 2019,
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        country: 'Brazil',
        countryType: COUNTRY_TYPES.INTERNATIONAL,
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      employer: 'Private',
      firmName: 'GW Law Offices',
      firstName: 'Test',
      lastName: 'Practitioner',
      name: 'Test Practitioner',
      originalBarState: 'Illinois',
      practitionerType: 'Attorney',
      role: ROLES.privatePractitioner,
      userId: 'ec4fe2e7-52cf-4084-84de-d8e8d151e927',
    });

    expect(user.isValid()).toBeTruthy();
  });

  it('should set the role to "irsPractitioner" when employer is "IRS" and admissionsStatus is Active', () => {
    const user = new Practitioner({
      admissionsStatus: 'Active',
      employer: 'IRS',
    });
    expect(user.role).toEqual(ROLES.irsPractitioner);
  });

  it('should set the role to "irsPractitioner" when employer is "DOJ" and admissionsStatus is Active', () => {
    const user = new Practitioner({
      admissionsStatus: 'Active',
      employer: 'DOJ',
    });
    expect(user.role).toEqual(ROLES.irsPractitioner);
  });

  it('should set the role to "privatePractitioner" when employer is "Private" and admissionsStatus is Active', () => {
    const user = new Practitioner({
      admissionsStatus: 'Active',
      employer: 'Private',
    });
    expect(user.role).toEqual(ROLES.privatePractitioner);
  });

  it('should set the role to "inactivePractitioner" when employer is "Private" and admissionsStatus is Inactive', () => {
    const user = new Practitioner({
      admissionsStatus: 'Inactive',
      employer: 'Private',
    });
    expect(user.role).toEqual(ROLES.inactivePractitioner);
  });

  it('Combines firstName, middleName, lastName, and suffix properties to set the name property', () => {
    const user = new Practitioner({
      admissionsDate: '2019-03-01T21:40:46.415Z',
      admissionsStatus: 'Active',
      barNumber: 'PT20001',
      birthYear: 2019,
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        country: 'Brazil',
        countryType: COUNTRY_TYPES.INTERNATIONAL,
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      employer: 'Private',
      firmName: 'GW Law Offices',
      firstName: 'Test',
      lastName: 'Practitioner',
      middleName: 'Middle',
      originalBarState: 'Illinois',
      practitionerType: 'Attorney',
      role: ROLES.Practitioner,
      suffix: 'Sfx',
      userId: 'ec4fe2e7-52cf-4084-84de-d8e8d151e927',
    });
    expect(user.name).toEqual('Test Middle Practitioner Sfx');
  });

  describe('getFullName', () => {
    let userData;

    beforeEach(() => {
      userData = {
        admissionsDate: '2019-03-01T21:40:46.415Z',
        admissionsStatus: 'Active',
        barNumber: 'PT20001',
        birthYear: 2019,
        contact: {
          address1: '234 Main St',
          address2: 'Apartment 4',
          address3: 'Under the stairs',
          city: 'Chicago',
          country: 'Brazil',
          countryType: COUNTRY_TYPES.INTERNATIONAL,
          phone: '+1 (555) 555-5555',
          postalCode: '61234',
          state: 'IL',
        },
        employer: 'Private',
        firmName: 'GW Law Offices',
        firstName: 'Test',
        lastName: 'Practitioner',
        originalBarState: 'Illinois',
        practitionerType: 'Attorney',
        role: ROLES.Practitioner,
        userId: 'ec4fe2e7-52cf-4084-84de-d8e8d151e927',
      };
    });

    it('should return the first and last names if only they are provided in the practitioner data', () => {
      expect(Practitioner.getFullName(userData)).toEqual('Test Practitioner');
    });

    it('should return the first, middle, and last names if only they are provided in the practitioner data', () => {
      userData.middleName = 'Foo';

      expect(Practitioner.getFullName(userData)).toEqual(
        'Test Foo Practitioner',
      );
    });

    it('should return the first, middle, and last names with suffix if they are provided in the practitioner data', () => {
      userData.middleName = 'Foo';
      userData.suffix = 'Bar';

      expect(Practitioner.getFullName(userData)).toEqual(
        'Test Foo Practitioner Bar',
      );
    });
  });
});
