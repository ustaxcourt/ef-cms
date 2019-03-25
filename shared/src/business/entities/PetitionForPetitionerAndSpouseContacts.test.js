const { Petition } = require('./Petition');

describe('Petition', () => {
  describe('for Petitioner And Spouse Contacts', () => {
    it('should not validate without contacts', () => {
      const petition = new Petition({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType: 'Petitioner & Spouse',
        petitionFile: {},
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
        stinFile: {},
      });
      expect(petition.isValid()).toEqual(false);
    });

    it('can validate primary contact name', () => {
      const petition = new Petition({
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
        contactSecondary: {
          address1: '1599 Pennsylvania Ave',
          city: 'Walla Walla',
          countryType: 'domestic',
          email: 'someone@example.com',
          name: 'Betty Crocker',
          phone: '1234567890',
          postalCode: '78774',
          state: 'WA',
        },
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType: 'Petitioner & Spouse',
        petitionFile: {},
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
        stinFile: {},
      });
      expect(petition.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
