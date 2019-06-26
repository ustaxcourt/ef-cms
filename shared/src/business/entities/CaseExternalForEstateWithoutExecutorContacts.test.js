const { CaseExternal } = require('./CaseExternal');

describe('CaseExternal', () => {
  describe('for Estate without an Executor/Personal Representative/Fiduciary/etc. Contacts', () => {
    it('should not validate without contact', () => {
      const petition = new CaseExternal({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType:
          'Estate without an Executor/Personal Representative/Fiduciary/etc.',
        petitionFile: {},
        petitionFileSize: 1,
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
        stinFile: {},
        stinFileSize: 1,
      });
      expect(petition.isValid()).toEqual(false);
    });

    it('should validate without inCareOf', () => {
      const petition = new CaseExternal({
        caseType: 'other',
        contactPrimary: {
          address1: '876 12th Ave',
          city: 'Nashville',
          country: 'USA',
          countryType: 'domestic',
          email: 'someone@example.com',
          name: 'Jimmy Dean',
          phone: '1234567890',
          postalCode: '05198',
          state: 'AK',
        },
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType:
          'Estate without an Executor/Personal Representative/Fiduciary/etc.',
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

    it('can validate primary contact', () => {
      const petition = new CaseExternal({
        caseType: 'other',
        contactPrimary: {
          address1: '876 12th Ave',
          city: 'Nashville',
          country: 'USA',
          countryType: 'domestic',
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
        partyType:
          'Estate without an Executor/Personal Representative/Fiduciary/etc.',
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
