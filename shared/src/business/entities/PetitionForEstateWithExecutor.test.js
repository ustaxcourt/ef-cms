const PetitionForEstateWithExecutor = require('./PetitionForEstateWithExecutor');

describe('Petition', () => {
  describe('for Petitioner', () => {
    it('can validate primary contact name', () => {
      const petition = new PetitionForEstateWithExecutor({
        contactPrimary: {
          nameOfExecutor: 'Betty Crocker',
          title: 'Attorney at Law',
          address1: '1599 Pennsylvania Ave',
          city: 'Walla Walla',
          state: 'WA',
          zip: '78774',
          country: 'USA',
          email: 'betty.crocker@example.com',
          phone: '555-555-9823',
        },
        contactSecondary: {
          nameOfDecedent: 'Jimmy Dean',
          address1: '876 12th Ave',
          city: 'Nashville',
          state: 'AK',
          zip: '05198',
          country: 'USA',
        },
      });

      expect(petition.isValid()).toEqual(true);
    });
  });
});
