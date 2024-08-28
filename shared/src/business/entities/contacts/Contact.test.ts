import { Contact } from './Contact';
import { MOCK_CONTACT_PRIMARY } from '../../../test/mockContact';

describe('Contact', () => {
  describe('hasEAccess validation', () => {
    it('should be invalid when an email is not provided and the contact has eAccess', () => {
      const contact = new Contact(
        {
          ...MOCK_CONTACT_PRIMARY,
          email: undefined,
          hasEAccess: true,
        },
        'PetitionerPrimaryContact',
      );

      expect(contact.getFormattedValidationErrors()!.email).toEqual(
        '"email" is required',
      );
    });

    it('should be valid when email is not provided and the contact does not have eAccess', () => {
      const contact = new Contact(
        {
          ...MOCK_CONTACT_PRIMARY,
          email: undefined,
          hasEAccess: false,
        },
        'PetitionerPrimaryContact',
      );

      expect(contact.getFormattedValidationErrors()?.email).toEqual(undefined);
    });
  });
});
