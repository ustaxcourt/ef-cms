import { ROLES } from '../business/entities/EntityConstants';

exports.MOCK_USERS = {
  '330d4b65-620a-489d-8414-6623653ebc4f': {
    name: 'Private Practitioner',
    role: ROLES.privatePractitioner,
    section: 'privatePractitioner',
    userId: '330d4b65-620a-489d-8414-6623653ebc4f',
  },
  'a7d90c05-f6cd-442c-a168-202db587f16f': {
    name: 'Docketclerk',
    role: ROLES.docketClerk,
    section: 'docket',
    userId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
  },
  'b7d90c05-f6cd-442c-a168-202db587f16f': {
    name: 'Docketclerk1',
    role: ROLES.docketClerk,
    section: 'docket',
    userId: 'b7d90c05-f6cd-442c-a168-202db587f16f',
  },
  'c7d90c05-f6cd-442c-a168-202db587f16f': {
    name: 'Petitionsclerk',
    role: ROLES.petitionsClerk,
    section: 'petitions',
    userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
  },
  'd7d90c05-f6cd-442c-a168-202db587f16f': {
    name: 'Tax Payer',
    role: ROLES.petitioner,
    section: 'petitioner',
    userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
  },
  'e7d90c05-f6cd-442c-a168-202db587f16f': {
    name: 'Petitionsclerk1',
    role: ROLES.petitionsClerk,
    section: 'petitions',
    userId: 'e7d90c05-f6cd-442c-a168-202db587f16f',
  },
  'f7d90c05-f6cd-442c-a168-202db587f16f': {
    contact: {},
    name: 'IRS Practitioner',
    role: ROLES.irsPractitioner,
    section: 'irsPractitioner',
    userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
  },
  'g7d90c05-f6cd-442c-a168-202db587f16f': {
    name: 'ADC',
    role: ROLES.adc,
    section: 'adc',
    userId: 'g7d90c05-f6cd-442c-a168-202db587f16f',
  },
};
