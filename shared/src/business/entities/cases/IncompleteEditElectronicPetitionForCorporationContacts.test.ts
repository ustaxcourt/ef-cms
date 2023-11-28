import { CASE_TYPES_MAP, COUNTRY_TYPES, PARTY_TYPES } from '../EntityConstants';
import { IncompleteEditElectronicPetition } from './IncompleteEditElectronicPetition';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('IncompleteEditElectronicPetition', () => {
  describe('for Corporation Contacts', () => {
    it('should not validate without contact', () => {
      const incompleteEditElectronicPetition =
        new IncompleteEditElectronicPetition(
          {
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
          },
          { applicationContext },
        );
      expect(incompleteEditElectronicPetition.isValid()).toEqual(false);
    });

    it('should not validate without inCareOf', () => {
      const incompleteEditElectronicPetition =
        new IncompleteEditElectronicPetition(
          {
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
          },
          { applicationContext },
        );
      expect(incompleteEditElectronicPetition.isValid()).toEqual(false);
    });

    it('can validate primary contact', () => {
      const incompleteEditElectronicPetition =
        new IncompleteEditElectronicPetition(
          {
            caseType: CASE_TYPES_MAP.other,
            contactPrimary: {
              address1: '876 12th Ave',
              city: 'Nashville',
              country: 'USA',
              countryType: COUNTRY_TYPES.DOMESTIC,
              email: 'someone@example.com',
              inCareOf: 'USTC',
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
          },
          { applicationContext },
        );
      expect(
        incompleteEditElectronicPetition.getFormattedValidationErrors(),
      ).toEqual(null);
    });
  });
});
