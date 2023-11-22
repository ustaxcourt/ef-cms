import {
  ADC_SECTION,
  ADMISSIONS_SECTION,
  CASE_SERVICES_SUPERVISOR_SECTION,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
  SERVICE_INDICATOR_TYPES,
  TRIAL_CLERKS_SECTION,
} from '../business/entities/EntityConstants';
import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawUser } from '@shared/business/entities/User';
import { getJudgesChambers } from '../../../web-client/src/business/chambers/getJudgesChambers';

export const adcUser = {
  name: 'ADC',
  role: ROLES.adc,
  section: ADC_SECTION,
  userId: 'g7d90c05-f6cd-442c-a168-202db587f16f',
};

export const colvinsChambersUser = {
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

export const irsPractitionerUser: RawIrsPractitioner = {
  barNumber: 'BN2345',
  contact: {
    address1: '234 Main St',
    address2: 'Apartment 4',
    address3: 'Under the stairs',
    city: 'Chicago',
    country: COUNTRY_TYPES.DOMESTIC,
    countryType: COUNTRY_TYPES.DOMESTIC,
    phone: '+1 (555) 555-5555',
    postalCode: '61234',
    state: 'IL',
  },
  email: 'irsPractitioner@example.com',
  entityName: 'IrsPractitioner',
  name: 'IRS Practitioner',
  role: ROLES.irsPractitioner,
  section: 'irsPractitioner',
  serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
  userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
};

export const irsSuperuserUser = {
  name: 'IRS Superuser',
  role: ROLES.irsSuperuser,
  section: 'irsSuperuser',
  userId: '2eee98ac-613f-46bc-afd5-2574d1b15664',
};

export const judgeUser: RawUser = {
  email: 'judgeSotomayor@example.com',
  entityName: 'User',
  isSeniorJudge: false,
  judgeFullName: 'Sonia Sotomayor',
  judgeTitle: 'Judge',
  name: 'Sotomayor',
  role: ROLES.judge,
  userId: '43b00e5f-b78c-476c-820e-5d6ed1d58828',
};

export const judgeColvin: RawUser = {
  email: 'judgeColvin@example.com',
  entityName: 'User',
  isSeniorJudge: true,
  judgeFullName: 'John O. Colvin',
  name: 'Colvin',
  role: ROLES.judge,
  section: getJudgesChambers().COLVINS_CHAMBERS_SECTION.section,
  userId: 'd17b07dc-6455-447e-bea3-f91d12ac5a6a',
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

export const trialClerkUser: RawUser = {
  email: 'kason.marzena@example.com',
  entityName: 'User',
  name: 'Kason Marzena',
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

export const docketClerk1User: RawUser = {
  email: 'docketclerk1@example.com',
  entityName: 'User',
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

export const admissionsClerkUser = {
  name: 'AdmissionsClerk',
  role: ROLES.admissionsClerk,
  section: ADMISSIONS_SECTION,
  userId: '07d90c05-f6cd-442c-a168-202db587f16f',
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

export const MOCK_PRACTITIONER: TPractitioner = {
  admissionsDate: '2019-03-01',
  admissionsStatus: 'Active',
  barNumber: 'AB1111',
  birthYear: '2019',
  contact: {
    address1: '234 Main St',
    address2: 'Apartment 4',
    address3: 'Under the stairs',
    city: 'Chicago',
    country: 'USA',
    countryType: COUNTRY_TYPES.DOMESTIC,
    phone: '+1 (555) 555-5555',
    postalCode: '61234',
    state: 'IL',
  },
  email: 'ab@example.com',
  employer: 'Private',
  entityName: 'Practitioner',
  firmName: 'GW Law Offices',
  firstName: 'Test',
  lastName: 'Attorney',
  name: 'Test Attorney',
  originalBarState: 'OK',
  practitionerType: 'Attorney',
  role: ROLES.privatePractitioner,
  section: 'privatePractitioner',
  serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
  userId: 'df56e4f8-b302-46ec-b9b3-a6a5e2142092',
};

export const validUser: RawUser = {
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
  email: 'user@example.com',
  entityName: 'User',
  name: 'Saul Goodman',
  role: ROLES.petitioner,
  userId: '3ab77c88-1dd0-4adb-a03c-c466ad72d417',
};

export const casePetitioner: TPetitioner = {
  address1: '234 Main St',
  address2: 'Apartment 4',
  address3: 'Under the stairs',
  city: 'Chicago',
  contactId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
  contactType: CONTACT_TYPES.primary,
  countryType: COUNTRY_TYPES.DOMESTIC,
  entityName: 'Petitioner',
  isAddressSealed: false,
  name: 'Jingo Bjango',
  phone: '+1 (555) 555-5555',
  postalCode: '61234',
  sealedAndUnavailable: false,
  serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
  state: 'IL',
};
