import {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../EntityConstants';
import { ElectronicPetition } from './ElectronicPetition';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('ElectronicPetition', () => {
  describe('for (international) Contacts', () => {
    it('should not validate without country', () => {
      const electronicPetition = new ElectronicPetition(
        {
          caseType: CASE_TYPES_MAP.other,
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: '2009-10-13',
          partyType: PARTY_TYPES.petitioner,
          petitionFile: {},
          petitionFileSize: 1,
          petitioners: [
            {
              address1: '876 12th Ave',
              city: 'Nashville',
              contactType: CONTACT_TYPES.primary,
              countryType: COUNTRY_TYPES.INTERNATIONAL,
              email: 'someone@example.com',
              name: 'Jimmy Dean',
              phone: '1234567890',
              postalCode: '05198',
              state: 'AK',
            },
          ],
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
          signature: true,
          stinFile: {},
          stinFileSize: 1,
        },
        { applicationContext },
      );
      expect(electronicPetition.getFormattedValidationErrors()).toEqual({
        petitioners: [
          {
            country: 'Enter a country',
            index: 0,
          },
        ],
      });
    });

    it('can validate the primary contact in the petitioners array', () => {
      const electronicPetition = new ElectronicPetition(
        {
          caseType: CASE_TYPES_MAP.other,
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: '2009-10-13',
          partyType: PARTY_TYPES.petitioner,
          petitionFile: {},
          petitionFileSize: 1,
          petitioners: [
            {
              address1: '876 12th Ave',
              city: 'Nashville',
              contactType: CONTACT_TYPES.primary,
              country: 'USA',
              countryType: COUNTRY_TYPES.INTERNATIONAL,
              email: 'someone@example.com',
              name: 'Jimmy Dean',
              phone: '1234567890',
              postalCode: '05198',
              state: 'AK',
            },
          ],
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
          signature: true,
          stinFile: {},
          stinFileSize: 1,
        },
        { applicationContext },
      );
      expect(electronicPetition.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
