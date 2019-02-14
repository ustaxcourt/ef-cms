const PetitionForPetitionerAndDeceasedSpouse = require('./PetitionForPetitionerAndDeceasedSpouse');

describe('Petition', () => {
  describe('for Petitioner And Deceased Spouse', () => {
    it('can validate primary contact name', () => {
      const petition = new PetitionForPetitionerAndDeceasedSpouse({
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
