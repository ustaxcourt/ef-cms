const { CaseExternal } = require('./CaseExternal');

describe('CaseExternal', () => {
  describe('for (international) Contacts', () => {
    it('should not validate without country', () => {
      const petition = new CaseExternal({
        caseType: 'other',
        contactPrimary: {
          address1: '876 12th Ave',
          city: 'Nashville',
          countryType: 'international',
          email: 'someone@example.com',
          name: 'Jimmy Dean',
          phone: '1234567890',
          postalCode: '05198',
          state: 'AK',
        },
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType: 'Petitioner',
        petitionFile: {},
        petitionFileSize: 1,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
        stinFile: {},
        stinFileSize: 1,
      });
      expect(petition.getFormattedValidationErrors()).toEqual({
        contactPrimary: { country: 'Country is a required field.' },
      });
    });

    it('can validate primary contact', () => {
      const petition = new CaseExternal({
        caseType: 'other',
        contactPrimary: {
          address1: '876 12th Ave',
          city: 'Nashville',
          country: 'USA',
          countryType: 'international',
          email: 'someone@example.com',
          name: 'Jimmy Dean',
          phone: '1234567890',
          postalCode: '05198',
          state: 'AK',
        },
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType: 'Petitioner',
        petitionFile: {},
        petitionFileSize: 1,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
        stinFile: {},
        stinFileSize: 1,
      });
      expect(petition.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
