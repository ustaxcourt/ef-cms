const Petition = require('./Petition');

describe('Petition', () => {
  describe('for Petitioner And Deceased Spouse Contacts', () => {
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
        partyType: 'Petitioner & Deceased Spouse',
      });
      expect(petition.isValid()).toEqual(false);
    });

    it('can validate primary contact name', () => {
      const petition = new Petition({
        caseType: 'other',
        procedureType: 'Small',
        filingType: 'Myself',
        preferredTrialCity: 'Chattanooga, TN',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        petitionFile: {},
        signature: true,
        partyType: 'Petitioner & Deceased Spouse',
        contactPrimary: {
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
          name: 'Betty Crocker',
          address1: '1599 Pennsylvania Ave',
          city: 'Walla Walla',
          state: 'WA',
          zip: '78774',
        },
      });
      expect(petition.isValid()).toEqual(true);
    });
  });
});
