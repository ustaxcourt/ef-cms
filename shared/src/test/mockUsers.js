const {
  ADC_SECTION,
  COUNTRY_TYPES,
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
} = require('../business/entities/EntityConstants');

const docketClerkUser = {
  name: 'Docketclerk',
  role: ROLES.docketClerk,
  section: DOCKET_SECTION,
  userId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
};
exports.docketClerkUser = docketClerkUser;

const petitionsClerkUser = {
  name: 'Petitionsclerk',
  role: ROLES.petitionsClerk,
  section: PETITIONS_SECTION,
  userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
};
exports.petitionsClerkUser = petitionsClerkUser;

exports.MOCK_USERS = {
  '2eee98ac-613f-46bc-afd5-2574d1b15664': {
    name: 'IRS Superuser',
    role: ROLES.irsSuperuser,
    section: 'irsSuperuser',
    userId: '2eee98ac-613f-46bc-afd5-2574d1b15664',
  },
  '330d4b65-620a-489d-8414-6623653ebc4f': {
    barNumber: 'BN1234',
    name: 'Private Practitioner',
    role: ROLES.privatePractitioner,
    section: 'privatePractitioner',
    userId: '330d4b65-620a-489d-8414-6623653ebc4f',
  },
  'a7d90c05-f6cd-442c-a168-202db587f16f': docketClerkUser,
  'b7d90c05-f6cd-442c-a168-202db587f16f': {
    ...docketClerkUser,
    name: 'Docketclerk1',
    userId: 'b7d90c05-f6cd-442c-a168-202db587f16f',
  },
  'c7d90c05-f6cd-442c-a168-202db587f16f': petitionsClerkUser,
  'd7d90c05-f6cd-442c-a168-202db587f16f': {
    name: 'Tax Payer',
    role: ROLES.petitioner,
    section: 'petitioner',
    userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
  },
  'e7d90c05-f6cd-442c-a168-202db587f16f': {
    ...petitionsClerkUser,
    name: 'Petitionsclerk1',
    userId: 'e7d90c05-f6cd-442c-a168-202db587f16f',
  },
  'f7d90c05-f6cd-442c-a168-202db587f16f': {
    barNumber: 'BN2345',
    contact: {},
    name: 'IRS Practitioner',
    role: ROLES.irsPractitioner,
    section: 'irsPractitioner',
    userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
  },
  'g7d90c05-f6cd-442c-a168-202db587f16f': {
    name: 'ADC',
    role: ROLES.adc,
    section: ADC_SECTION,
    userId: 'g7d90c05-f6cd-442c-a168-202db587f16f',
  },
};

exports.MOCK_PRACTITIONER = {
  admissionsDate: '2019-03-01',
  admissionsStatus: 'Active',
  barNumber: 'AB1111',
  birthYear: 2019,
  contact: {
    address1: '234 Main St',
    address2: 'Apartment 4',
    address3: 'Under the stairs',
    city: 'Chicago',
    countryType: COUNTRY_TYPES.DOMESTIC,
    phone: '+1 (555) 555-5555',
    postalCode: '61234',
    state: 'IL',
  },
  email: 'ab@example.com',
  employer: 'Private',
  firmName: 'GW Law Offices',
  firstName: 'Test',
  lastName: 'Attorney',
  name: 'Test Attorney',
  originalBarState: 'OK',
  practitionerType: 'Attorney',
  role: ROLES.privatePractitioner,
  userId: 'df56e4f8-b302-46ec-b9b3-a6a5e2142092',
};

exports.validUser = {
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
  name: 'Saul Goodman',
  role: ROLES.petitioner,
  userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
};

exports.clerkOfCourtUser = {
  role: ROLES.clerkOfCourt,
  userId: 'b6e4a5ac-c006-4b47-a5f0-67028372cd63',
};
exports.judgeUser = {
  role: ROLES.judge,
  userId: '43b00e5f-b78c-476c-820e-5d6ed1d58828',
};
exports.petitionerUser = {
  role: ROLES.petitioner,
  userId: '6844385f-b3de-444b-b76a-64fedfbb0229',
};
