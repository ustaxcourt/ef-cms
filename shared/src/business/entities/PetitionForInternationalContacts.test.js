const Petition = require('./Petition');

describe('Petition', () => {
  describe('for (international) Contacts', () => {
    it('should not validate without country', () => {
      const petition = new Petition({
        caseType: 'other',
        procedureType: 'Small',
        filingType: 'Myself',
        preferredTrialCity: 'Chattanooga, TN',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        petitionFile: {},
        signature: true,
        partyType: 'Petitioner',
        contactPrimary: {
          countryType: 'international',
          name: 'Jimmy Dean',
          address1: '876 12th Ave',
          city: 'Nashville',
          state: 'AK',
          postalCode: '05198',
          phone: '1234567890',
          email: 'someone@example.com',
        },
      });
      expect(petition.getFormattedValidationErrors()).toEqual({
        contactPrimary: { country: 'Country is a required field.' },
      });
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
        partyType: 'Petitioner',
        contactPrimary: {
          countryType: 'international',
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
      expect(petition.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
