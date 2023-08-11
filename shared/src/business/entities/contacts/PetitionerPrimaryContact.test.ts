import { CONTACT_TYPES, COUNTRY_TYPES } from '../EntityConstants';
import { PetitionerPrimaryContact } from './PetitionerPrimaryContact';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('Petition', () => {
  describe('for Petitioner Primary contact', () => {
    it('can validate primary contact name', () => {
      const petition = new PetitionerPrimaryContact(
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
