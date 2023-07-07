import { CONTACT_TYPES, COUNTRY_TYPES } from '../EntityConstants';
import { Contact, RawContact } from './Contact';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('Contact', () => {
  const mockContact: RawContact = {
    address1: '876 12th Ave',
    address2: 'Suite 123',
    address3: 'Room 13',
    city: 'Nashville',
    contactId: '6f527aec-3a73-4e1e-ab76-6ba7af7478ee',
    contactType: CONTACT_TYPES.primary,
    country: 'USA',
    countryType: COUNTRY_TYPES.DOMESTIC,
    email: 'someone@example.com',
    entityName: 'Contact',
    inCareOf: 'USTC',
    isAddressSealed: false,
    name: 'Jimmy Dean',
    phone: '1234567890',
    postalCode: '05198',
    secondaryName: 'Jimmy Dean',
    state: 'AK',
  };

  describe('hasEAccess validation', () => {
    it('should be invalid when an email is not provided and the contact has eAccess', () => {
      const contact = new Contact(
        {
          ...mockContact,
          email: undefined,
          hasEAccess: true,
        },
        'PetitionerPrimaryContact',
        { applicationContext },
      );

      expect(contact.getFormattedValidationErrors()!.email).toEqual(
        '"email" is required',
      );
    });

    it('should be valid when email is not provided and the contact does not have eAccess', () => {
      const contact = new Contact(
        {
          ...mockContact,
          email: undefined,
          hasEAccess: false,
        },
        'PetitionerPrimaryContact',
        { applicationContext },
      );

      expect(contact.getFormattedValidationErrors()?.email).toEqual(undefined);
    });
  });
});
