const { getPetitionerPrimaryContact } = require('./PetitionerPrimaryContact');

describe('Petition', () => {
  describe('for Petitioner Primary contact', () => {
    it('can validate primary contact name', () => {
      const entityConstructor = getPetitionerPrimaryContact({
        countryType: 'domestic',
      });
      const petition = new entityConstructor({
        address1: '123 Deming Way',
        city: 'Los Angeles',
        country: 'USA',
        countryType: 'domestic',
        email: 'petitioner@example.com',
        name: 'Eric',
        phone: '555-555-1212',
        postalCode: '90210',
        state: 'TN',
      });
      expect(petition.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
