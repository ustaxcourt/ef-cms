const PetitionForPetitioner = require('./PetitionForPetitioner');

describe('Petition', () => {
  describe('for Petitioner', () => {
    it('can validate primary contact name', () => {
      const petition = new PetitionForPetitioner({
        contactPrimary: {
          name: 'Betty Crocker',
          address1: '1599 Pennsylvania Ave',
          city: 'Walla Walla',
          state: 'WA',
          zip: '78774',
          country: 'USA',
          phone: '555-555-9823',
          email: 'betty.crocker@example.com',
        },
      });
      expect(petition.isValid()).toEqual(true);
    });
  });
});
