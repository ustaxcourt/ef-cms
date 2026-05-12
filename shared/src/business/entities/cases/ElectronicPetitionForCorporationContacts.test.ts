import {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../EntityConstants';
import { ElectronicPetition } from '@web-api/business/entities/cases/ElectronicPetition';

describe('ElectronicPetition', () => {
  describe('for Corporation Contacts', () => {
    it('should not validate without contact', () => {
      const electronicPetition = new ElectronicPetition({
        caseType: CASE_TYPES_MAP.other,
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType: PARTY_TYPES.corporation,
        petitionFile: {},
        petitionFileSize: 1,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
        signature: true,
        stinFile: {},
        stinFileSize: 1,
      });
      expect(electronicPetition.isValid()).toEqual(false);
    });

    it('should not validate without inCareOf', () => {
      const electronicPetition = new ElectronicPetition({
        caseType: CASE_TYPES_MAP.other,
        contactPrimary: {
          address1: '876 12th Ave',
          city: 'Nashville',
          contactType: CONTACT_TYPES.primary,
          country: 'USA',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'someone@example.com',
          isAddressSealed: false,
          name: 'Jimmy Dean',
          phone: '1234567890',
          postalCode: '05198',
          state: 'AK',
        },
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType: PARTY_TYPES.corporation,
        petitionFile: {},
        petitionFileSize: 1,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
        signature: true,
      });
      expect(electronicPetition.isValid()).toEqual(false);
    });

    it('can validate primary contact', () => {
      const electronicPetition = new ElectronicPetition({
        caseType: CASE_TYPES_MAP.other,
        contactPrimary: {
          address1: '876 12th Ave',
          city: 'Nashville',
          contactType: CONTACT_TYPES.primary,
          country: 'USA',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'someone@example.com',
          inCareOf: 'USTC',
          isAddressSealed: false,
          name: 'Jimmy Dean',
          phone: '1234567890',
          postalCode: '05198',
          state: 'AK',
        },
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType: PARTY_TYPES.corporation,
        petitionFile: {},
        petitionFileSize: 1,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
        signature: true,
        stinFile: {},
        stinFileSize: 1,
      });
      expect(electronicPetition.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
