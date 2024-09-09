import { CASE_TYPES_MAP, COUNTRY_TYPES, PARTY_TYPES } from '../EntityConstants';
import { ElectronicPetition } from './ElectronicPetition';

describe('ElectronicPetition', () => {
  describe('for Partnership (as the Tax Matters Partner) Contacts', () => {
    it('should not validate without contacts', () => {
      const electronicPetition = new ElectronicPetition({
        caseType: CASE_TYPES_MAP.other,
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType: PARTY_TYPES.partnershipAsTaxMattersPartner,
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

    it('can validate contacts', () => {
      const electronicPetition = new ElectronicPetition({
        caseType: CASE_TYPES_MAP.other,
        contactPrimary: {
          address1: '876 12th Ave',
          city: 'Nashville',
          country: 'USA',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'someone@example.com',
          name: 'Jimmy Dean',
          phone: '1234567890',
          postalCode: '05198',
          secondaryName: 'Jimmy Dean',
          state: 'AK',
        },
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType: PARTY_TYPES.partnershipAsTaxMattersPartner,
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
