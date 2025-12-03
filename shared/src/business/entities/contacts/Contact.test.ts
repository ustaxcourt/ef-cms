import { Contact } from './Contact';
import { MOCK_CONTACT_PRIMARY } from '../../../test/mockContact';

describe('Contact', () => {
  describe('hasElectronicAccess validation', () => {
    it('should be invalid when an email is not provided and the contact has eAccess', () => {
      const contact = new Contact(
        {
          ...MOCK_CONTACT_PRIMARY,
          email: undefined,
          hasElectronicAccess: true,
        },
        'PetitionerPrimaryContact',
      );

      expect(contact.getFormattedValidationErrors()!.email).toEqual(
        'Enter a valid email address',
      );
    });

    it('should be valid when email is not provided and the contact does not have eAccess', () => {
      const contact = new Contact(
        {
          ...MOCK_CONTACT_PRIMARY,
          email: undefined,
          hasElectronicAccess: false,
        },
        'PetitionerPrimaryContact',
      );

      expect(contact.getFormattedValidationErrors()?.email).toEqual(undefined);
    });
  });

  describe('preferredLanguage', () => {
    it('should populate preferredLanguage field', () => {
      const contact = new Contact(
        {
          ...MOCK_CONTACT_PRIMARY,
          preferredLanguage: 'Spanish',
        },
        'PetitionerPrimaryContact',
      );

      expect(contact.preferredLanguage).toEqual('Spanish');
    });
  });

  describe('preferredCommunicationMethod', () => {
    it('should populate preferredCommunicationMethod field', () => {
      const contact = new Contact(
        {
          ...MOCK_CONTACT_PRIMARY,
          preferredCommunicationMethod: 'ASL',
        },
        'PetitionerPrimaryContact',
      );

      expect(contact.preferredCommunicationMethod).toEqual('ASL');
    });
  });
});
