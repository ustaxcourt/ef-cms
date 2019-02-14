const PetitionForPetitionerAndSpouse = require('./PetitionForPetitionerAndSpouse');

describe('Petition', () => {
  describe('for Petitioner And Deceased Spouse', () => {
    it('can validate primary contact name', () => {
      const petition = new PetitionForPetitionerAndSpouse({
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
          phone: '1238675309',
          email: 'someone.else@example.com',
        },
      });
      expect(petition.isValid()).toEqual(true);
    });
  });
});
