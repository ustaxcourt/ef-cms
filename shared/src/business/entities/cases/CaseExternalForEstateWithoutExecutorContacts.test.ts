import { CASE_TYPES_MAP, COUNTRY_TYPES, PARTY_TYPES } from '../EntityConstants';
import { CaseExternal } from './CaseExternal';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('CaseExternal', () => {
  describe('for Estate without an Executor/Personal Representative/Fiduciary/etc. Contacts', () => {
    it('should not validate without contact', () => {
      const caseExternal = new CaseExternal(
        {
          caseType: CASE_TYPES_MAP.other,
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: '2009-10-13',
          partyType: PARTY_TYPES.estateWithoutExecutor,
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
      expect(caseExternal.isValid()).toEqual(false);
    });

    it('should validate without inCareOf', () => {
      const caseExternal = new CaseExternal(
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
          partyType: PARTY_TYPES.estateWithoutExecutor,
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
      expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
    });

    it('can validate primary contact', () => {
      const caseExternal = new CaseExternal(
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
          partyType: PARTY_TYPES.estateWithoutExecutor,
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
      expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
