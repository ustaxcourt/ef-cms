import {
  ADMISSIONS_STATUS_OPTIONS,
  CONTACT_TYPES,
  PRACTICE_TYPE_OPTIONS,
  PRACTITIONER_TYPE_OPTIONS,
} from '../EntityConstants';
import { PublicContact } from './PublicContact';

describe('PublicContact', () => {
  const validUUID = 'f99205ce-fd41-4e41-9fc2-0510692b1db4';

  describe('validation', () => {
    it('passes validation with required fields only', () => {
      const contact = new PublicContact({
        contactId: validUUID,
      });

      expect(contact.getFormattedValidationErrors()).toBeNull();
    });

    it('passes validation with all fields populated', () => {
      const contact = new PublicContact({
        admissionsDate: '2020-01-15',
        admissionsStatus: ADMISSIONS_STATUS_OPTIONS[0],
        barNumber: 'BAR123456',
        contactId: validUUID,
        contactType: CONTACT_TYPES.primary,
        name: 'John Smith',
        originalBarState: 'CA',
        practiceType: PRACTICE_TYPE_OPTIONS[0],
        practitionerType: PRACTITIONER_TYPE_OPTIONS[0],
        state: 'California',
      });

      expect(contact.getFormattedValidationErrors()).toBeNull();
    });

    it('passes validation for any state value', () => {
      const contact = new PublicContact({
        contactId: validUUID,
        name: 'Price Cole',
        state: 'Assam',
      });

      expect(contact.getFormattedValidationErrors()).toBeNull();
    });

    it('initializes all properties correctly', () => {
      const rawProps = {
        admissionsDate: '2020-01-15',
        admissionsStatus: ADMISSIONS_STATUS_OPTIONS[0],
        barNumber: 'BAR123',
        contactId: validUUID,
        contactType: CONTACT_TYPES.primary,
        name: 'Test Contact',
        originalBarState: 'TX',
        practiceType: PRACTICE_TYPE_OPTIONS[0],
        practitionerType: PRACTITIONER_TYPE_OPTIONS[0],
        state: 'Texas',
      };

      const contact = new PublicContact(rawProps);

      expect(contact.admissionsDate).toBe(rawProps.admissionsDate);
      expect(contact.admissionsStatus).toBe(rawProps.admissionsStatus);
      expect(contact.barNumber).toBe(rawProps.barNumber);
      expect(contact.contactId).toBe(rawProps.contactId);
      expect(contact.contactType).toBe(rawProps.contactType);
      expect(contact.name).toBe(rawProps.name);
      expect(contact.originalBarState).toBe(rawProps.originalBarState);
      expect(contact.practiceType).toBe(rawProps.practiceType);
      expect(contact.practitionerType).toBe(rawProps.practitionerType);
      expect(contact.state).toBe(rawProps.state);
    });

    it('accepts userId as an alias for contactId', () => {
      const userId = 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6';
      const contact = new PublicContact({
        userId,
      });

      expect(contact.contactId).toBe(userId);
    });

    it('prefers contactId over userId when both are provided', () => {
      const contactId = 'f99205ce-fd41-4e41-9fc2-0510692b1db4';
      const userId = 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6';

      const contact = new PublicContact({
        contactId,
        userId,
      });

      expect(contact.contactId).toBe(contactId);
    });
  });
});
