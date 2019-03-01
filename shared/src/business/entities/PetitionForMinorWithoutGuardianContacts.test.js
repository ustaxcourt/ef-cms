const Petition = require('./Petition');

describe('Petition', () => {
  describe('for Minor without Guardian Contacts', () => {
    it('should not validate without contacts', () => {
      const petition = new Petition({
        caseType: 'other',
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType:
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        petitionFile: {},
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
      });
      expect(petition.isValid()).toEqual(false);
    });

    it('can validate contacts', () => {
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
          'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
        petitionFile: {},
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
        signature: true,
      });
      expect(petition.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
