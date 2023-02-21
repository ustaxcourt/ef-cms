const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { CONTACT_TYPES, COUNTRY_TYPES } = require('../EntityConstants');
const { getPetitionerPrimaryContact } = require('./PetitionerPrimaryContact');

describe('Petition', () => {
  describe('for Petitioner Primary contact', () => {
    it('can validate primary contact name', () => {
      const entityConstructor = getPetitionerPrimaryContact({
        countryType: COUNTRY_TYPES.DOMESTIC,
      });
      const petition = new entityConstructor(
        {
          address1: '123 Deming Way',
          city: 'Los Angeles',
          contactType: CONTACT_TYPES.primary,
          country: 'USA',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner@example.com',
          name: 'Eric',
          phone: '555-555-1212',
          postalCode: '90210',
          state: 'TN',
        },
        { applicationContext },
      );
      expect(petition.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
