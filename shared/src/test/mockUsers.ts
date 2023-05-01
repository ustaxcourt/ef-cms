import {
  ADC_SECTION,
  CASE_SERVICES_SUPERVISOR_SECTION,
  COUNTRY_TYPES,
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
  TRIAL_CLERKS_SECTION,
} from '../business/entities/EntityConstants';
import { getJudgesChambers } from '../persistence/dynamo/chambers/getJudgesChambers';

export const adcUser = {
  name: 'ADC',
  role: ROLES.adc,
  section: ADC_SECTION,
  userId: 'g7d90c05-f6cd-442c-a168-202db587f16f',
};

export const chambersUser = {
  name: 'Chandler Chambers',
  role: ROLES.chambers,
  section: getJudgesChambers().COLVINS_CHAMBERS_SECTION.section,
  userId: '3d9fa032-ad00-475a-9183-8aa0229a31eb',
};

export const clerkOfCourtUser = {
  role: ROLES.clerkOfCourt,
  userId: 'b6e4a5ac-c006-4b47-a5f0-67028372cd63',
};

export const generalUser = {
  role: ROLES.general,
  userId: '2806fccc-1432-4fcc-8a8d-5943edf07284',
};

export const irsPractitionerUser = {
  barNumber: 'BN2345',
  contact: {},
  name: 'IRS Practitioner',
  role: ROLES.irsPractitioner,
  section: 'irsPractitioner',
  userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
};

export const irsSuperuserUser = {
  name: 'IRS Superuser',
  role: ROLES.irsSuperuser,
  section: 'irsSuperuser',
  userId: '2eee98ac-613f-46bc-afd5-2574d1b15664',
};

export const judgeUser = {
  judgeFullName: 'Sonia Sotomayor',
  name: 'Sotomayor',
  role: ROLES.judge,
  userId: '43b00e5f-b78c-476c-820e-5d6ed1d58828',
};

export const petitionerUser = {
  name: 'Tax Payer',
  role: ROLES.petitioner,
  section: 'petitioner',
  userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
};

export const privatePractitionerUser = {
  barNumber: 'BN1234',
  name: 'Private Practitioner',
  role: ROLES.privatePractitioner,
  section: 'privatePractitioner',
  userId: '330d4b65-620a-489d-8414-6623653ebc4f',
};

export const trialClerkUser = {
  role: ROLES.trialClerk,
  section: TRIAL_CLERKS_SECTION,
  userId: '4b1bb9ca-c997-4356-9682-2bca88fb048d',
};

export const caseServicesSupervisorUser = {
  name: 'CaseServicesSupervisor',
  role: ROLES.caseServicesSupervisor,
  section: CASE_SERVICES_SUPERVISOR_SECTION,
  userId: '4562df8a-5c98-49a0-9c53-d8e4ff3b76bb',
};

export const docketClerkUser = {
  name: 'Docketclerk',
  role: ROLES.docketClerk,
  section: DOCKET_SECTION,
  userId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
};

export const docketClerk1User = {
  name: 'Docketclerk1',
  role: ROLES.docketClerk,
  section: DOCKET_SECTION,
  userId: 'b7d90c05-f6cd-442c-a168-202db587f16f',
};

export const petitionsClerkUser = {
  name: 'Petitionsclerk1',
  role: ROLES.petitionsClerk,
  section: PETITIONS_SECTION,
  userId: 'e7d90c05-f6cd-442c-a168-202db587f16f',
};

export const MOCK_USERS = {
  [irsSuperuserUser.userId]: irsSuperuserUser,
  [privatePractitionerUser.userId]: privatePractitionerUser,
  [docketClerkUser.userId]: docketClerkUser,
  [docketClerk1User.userId]: docketClerk1User,
  [petitionsClerkUser.userId]: petitionsClerkUser,
  [petitionerUser.userId]: petitionerUser,
  [petitionsClerkUser.userId]: petitionsClerkUser,
  [irsPractitionerUser.userId]: irsPractitionerUser,
  [adcUser.userId]: adcUser,
};

export const MOCK_INTERNAL_USERS = {
  [docketClerkUser.userId]: docketClerkUser,
  [petitionsClerkUser.userId]: petitionsClerkUser,
  [adcUser.userId]: adcUser,
};

export const MOCK_EXTERNAL_USERS = {
  [privatePractitionerUser.userId]: privatePractitionerUser,
  [petitionerUser.userId]: petitionerUser,
  [irsPractitionerUser.userId]: irsPractitionerUser,
};

export const MOCK_PRACTITIONER = {
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

export const validUser = {
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
