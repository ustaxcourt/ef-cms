import {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../EntityConstants';
import { CaseExternalIncomplete } from './CaseExternalIncomplete';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('CaseExternalIncomplete entity', () => {
  describe('isValid', () => {
    it('assigns a new irsNoticeDate if one is not passed in', () => {
      const caseExternalIncomplete = new CaseExternalIncomplete(
        {
          caseType: CASE_TYPES_MAP.other,
          contactPrimary: {
            address1: '99 South Oak Lane',
            address2: 'Culpa numquam saepe ',
            address3: 'Eaque voluptates com',
            city: 'Dignissimos voluptat',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'petitioner1@example.com',
            name: 'Priscilla Kline',
            phone: '+1 (215) 128-6587',
            postalCode: '69580',
            state: 'AR',
          },
          contactSecondary: {},
          filingType: 'Myself',
          hasIrsNotice: false,
          irsNoticeDate: null,
          partyType: PARTY_TYPES.petitioner,
          petitionFileId: '102e29fa-bb8c-43ff-b18f-ddce9089dd80',
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
        },
        { applicationContext },
      );

      expect(caseExternalIncomplete.getFormattedValidationErrors()).toEqual(
        null,
      );
    });

    it('instantiates the contact primary from the petitioners array', () => {
      const caseExternalIncomplete = new CaseExternalIncomplete(
        {
          caseType: CASE_TYPES_MAP.other,
          contactSecondary: {},
          filingType: 'Myself',
          hasIrsNotice: false,
          irsNoticeDate: null,
          partyType: PARTY_TYPES.petitioner,
          petitionFileId: '102e29fa-bb8c-43ff-b18f-ddce9089dd80',
          petitioners: [
            {
              address1: '99 South Oak Lane',
              address2: 'Culpa numquam saepe ',
              address3: 'Eaque voluptates com',
              city: 'Dignissimos voluptat',
              contactType: CONTACT_TYPES.primary,
              countryType: COUNTRY_TYPES.DOMESTIC,
              email: 'petitioner1@example.com',
              name: 'Priscilla Kline',
              phone: '+1 (215) 128-6587',
              postalCode: '69580',
              state: 'AR',
            },
          ],
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
        },
        { applicationContext },
      );

      expect(caseExternalIncomplete.getFormattedValidationErrors()).toEqual(
        null,
      );
    });
    it('instantiates the contact secondary from the petitioners array', () => {
      const caseExternalIncomplete = new CaseExternalIncomplete(
        {
          caseType: CASE_TYPES_MAP.other,
          contactSecondary: {},
          filingType: 'Myself',
          hasIrsNotice: false,
          irsNoticeDate: null,
          partyType: PARTY_TYPES.petitioner,
          petitionFileId: '102e29fa-bb8c-43ff-b18f-ddce9089dd80',
          petitioners: [
            {
              address1: '99 South Oak Lane',
              address2: 'Culpa numquam saepe ',
              address3: 'Eaque voluptates com',
              city: 'Dignissimos voluptat',
              contactType: CONTACT_TYPES.primary,
              countryType: COUNTRY_TYPES.DOMESTIC,
              email: 'petitioner1@example.com',
              name: 'Priscilla Kline',
              phone: '+1 (215) 128-6587',
              postalCode: '69580',
              state: 'AR',
            },
            {
              address1: '99 South Oak Lane',
              address2: 'Culpa numquam saepe ',
              address3: 'Eaque voluptates com',
              city: 'Dignissimos voluptat',
              contactType: CONTACT_TYPES.secondary,
              countryType: COUNTRY_TYPES.DOMESTIC,
              email: 'petitioner1@example.com',
              name: 'Jenn Kline',
              phone: '+1 (215) 128-6587',
              postalCode: '69580',
              state: 'AR',
            },
          ],
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
        },
        { applicationContext },
      );

      expect(caseExternalIncomplete.getFormattedValidationErrors()).toEqual(
        null,
      );
    });

    it('instantiates the contact primary from the rawCase.contactPrimary property if the petitioners array is not present', () => {
      const caseExternalIncomplete = new CaseExternalIncomplete(
        {
          caseType: CASE_TYPES_MAP.other,
          contactPrimary: {
            address1: '99 South Oak Lane',
            address2: 'Culpa numquam saepe ',
            address3: 'Eaque voluptates com',
            city: 'Dignissimos voluptat',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'petitioner1@example.com',
            name: 'Priscilla Kline',
            phone: '+1 (215) 128-6587',
            postalCode: '69580',
            state: 'AR',
          },
          contactSecondary: {},
          filingType: 'Myself',
          hasIrsNotice: false,
          irsNoticeDate: null,
          partyType: PARTY_TYPES.petitioner,
          petitionFileId: '102e29fa-bb8c-43ff-b18f-ddce9089dd80',
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
        },
        { applicationContext },
      );

      expect(caseExternalIncomplete.getFormattedValidationErrors()).toEqual(
        null,
      );
    });
    it('instantiates the contact secondary from the rawCase.contactSecondary property if the petitioners array is not present', () => {
      const caseExternalIncomplete = new CaseExternalIncomplete(
        {
          caseType: CASE_TYPES_MAP.other,
          contactPrimary: {
            address1: '99 South Oak Lane',
            address2: 'Culpa numquam saepe ',
            address3: 'Eaque voluptates com',
            city: 'Dignissimos voluptat',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'petitioner1@example.com',
            name: 'Priscilla Kline',
            phone: '+1 (215) 128-6587',
            postalCode: '69580',
            state: 'AR',
          },
          contactSecondary: {
            address1: '99 South Oak Lane',
            address2: 'Culpa numquam saepe ',
            address3: 'Eaque voluptates com',
            city: 'Dignissimos voluptat',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'petitioner1@example.com',
            name: 'Jenn Kline',
            phone: '+1 (215) 128-6587',
            postalCode: '69580',
            state: 'AR',
          },
          filingType: 'Myself',
          hasIrsNotice: false,
          irsNoticeDate: null,
          partyType: PARTY_TYPES.petitioner,
          petitionFileId: '102e29fa-bb8c-43ff-b18f-ddce9089dd80',
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
        },
        { applicationContext },
      );

      expect(caseExternalIncomplete.getFormattedValidationErrors()).toEqual(
        null,
      );
    });
  });
});
