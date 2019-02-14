const PetitionForEstateWithoutExecutor = require('./PetitionForEstateWithoutExecutor');

describe('Petition', () => {
  describe('for Petitioner', () => {
    it('can validate primary contact name', () => {
      const petition = new PetitionForEstateWithoutExecutor({
        contactPrimary: {
          nameOfDecedent: 'Jimmy Dean',
          address1: '876 12th Ave',
          city: 'Nashville',
          state: 'AK',
          zip: '05198',
          country: 'USA',
          phone: '555-555-1138',
          email: 'jdtasty@example.com',
          inCareOf: 'Mr. H. Ungry',
        },
      });
      expect(petition.isValid()).toEqual(true);
    });
  });
});
