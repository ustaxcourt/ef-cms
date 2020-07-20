const { CaseExternal } = require('./CaseExternal');
const { COUNTRY_TYPES, PARTY_TYPES } = require('../EntityConstants');

describe('CaseExternal', () => {
  describe('for Petitioner And Spouse Contacts', () => {
    it('should not validate without contacts', () => {
      const caseExternal = new CaseExternal({
        caseType: 'Other',
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType: PARTY_TYPES.petitionerSpouse,
        petitionFile: {},
        petitionFileSize: 1,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
        signature: true,
        stinFile: {},
        stinFileSize: 1,
      });
      expect(caseExternal.isValid()).toEqual(false);
    });

    it('can validate primary contact name', () => {
      const caseExternal = new CaseExternal({
        caseType: 'Other',
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
        contactSecondary: {
          address1: '1599 Pennsylvania Ave',
          city: 'Walla Walla',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'someone@example.com',
          name: 'Betty Crocker',
          phone: '1234567890',
          postalCode: '78774',
          state: 'WA',
        },
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType: PARTY_TYPES.petitionerSpouse,
        petitionFile: {},
        petitionFileSize: 1,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
        signature: true,
        stinFile: {},
        stinFileSize: 1,
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
