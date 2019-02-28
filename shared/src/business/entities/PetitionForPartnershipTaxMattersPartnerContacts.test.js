const Petition = require('./Petition');

describe('Petition', () => {
  describe('for Partnership (as the tax matters partner) Contacts', () => {
    it('should not validate without contacts', () => {
      const petition = new Petition({
        caseType: 'other',
        procedureType: 'Small',
        filingType: 'Myself',
        preferredTrialCity: 'Chattanooga, TN',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        petitionFile: {},
        signature: true,
        partyType: 'Partnership (as the tax matters partner)',
      });
      expect(petition.isValid()).toEqual(false);
    });

    it('can validate contacts', () => {
      const petition = new Petition({
        caseType: 'other',
        procedureType: 'Small',
        filingType: 'Myself',
        preferredTrialCity: 'Chattanooga, TN',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        petitionFile: {},
        signature: true,
        partyType: 'Partnership (as the tax matters partner)',
        contactPrimary: {
          countryType: 'domestic',
          name: 'Jimmy Dean',
          address1: '876 12th Ave',
          city: 'Nashville',
          state: 'AK',
          zip: '05198',
          country: 'USA',
          phone: '1234567890',
          email: 'someone@example.com',
        },
        contactSecondary: {
          countryType: 'domestic',
          name: 'Jimmy Dean',
          inCareOf: 'USTC',
          address1: '876 12th Ave',
          city: 'Nashville',
          state: 'AK',
          zip: '05198',
          country: 'USA',
          phone: '1234567890',
          email: 'someone@example.com',
        },
      });
      expect(petition.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
