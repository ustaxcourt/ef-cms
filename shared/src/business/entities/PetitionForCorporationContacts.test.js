const Petition = require('./Petition');

describe('Petition', () => {
  describe('for Corporation Contacts', () => {
    it('should not validate without contact', () => {
      const petition = new Petition({
        caseType: 'other',
        procedureType: 'Small',
        filingType: 'Myself',
        preferredTrialCity: 'Chattanooga, TN',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        petitionFile: {},
        signature: true,
        partyType: 'Corporation',
      });
      expect(petition.isValid()).toEqual(false);
    });

    it('should not validate without inCareOf', () => {
      const petition = new Petition({
        caseType: 'other',
        procedureType: 'Small',
        filingType: 'Myself',
        preferredTrialCity: 'Chattanooga, TN',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        petitionFile: {},
        signature: true,
        partyType: 'Corporation',
        contactPrimary: {
          countryType: 'domestic',
          name: 'Jimmy Dean',
          address1: '876 12th Ave',
          city: 'Nashville',
          state: 'AK',
          postalCode: '05198',
          country: 'USA',
          phone: '1234567890',
          email: 'someone@example.com',
        },
      });
      expect(petition.isValid()).toEqual(false);
    });

    it('can validate primary contact', () => {
      const petition = new Petition({
        caseType: 'other',
        procedureType: 'Small',
        filingType: 'Myself',
        preferredTrialCity: 'Chattanooga, TN',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        petitionFile: {},
        signature: true,
        partyType: 'Corporation',
        contactPrimary: {
          countryType: 'domestic',
          name: 'Jimmy Dean',
          inCareOf: 'USTC',
          address1: '876 12th Ave',
          city: 'Nashville',
          state: 'AK',
          postalCode: '05198',
          country: 'USA',
          phone: '1234567890',
          email: 'someone@example.com',
        },
      });
      expect(petition.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
