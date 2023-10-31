import {
  CONTACT_TYPES,
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../entities/EntityConstants';
import { Contact } from '../entities/contacts/Contact';
import { Petitioner } from '../entities/contacts/Petitioner';
import { applicationContext } from '../test/createTestApplicationContext';
import { validatePetitionerInteractor } from './validatePetitionerInteractor';

describe('validatePetitionerInteractor', () => {
  let mockContact;

  beforeEach(() => {
    mockContact = {
      address1: '100 Main St.',
      address2: 'Grand View Apartments',
      address3: 'Apt. #104',
      city: 'Jordan',
      confirmEmail: 'night@example.com',
      contactId: '9ec8bf37-678a-489d-be6d-13121331768b',
      contactType: CONTACT_TYPES.primary,
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Wilbur Rayou',
      phone: '1111111111',
      postalCode: '55352',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
      state: 'MN',
      updatedEmail: 'night@example.com',
    } as any;
  });

  it('runs validation on a contact with no invalid properties', () => {
    const errors = validatePetitionerInteractor(applicationContext, {
      contactInfo: mockContact,
    } as any);

    expect(errors).toBeFalsy();
  });

  it('should not return validation errors when contact is valid and updatedEmail and confirmEmail are not present', () => {
    mockContact = {
      ...mockContact,
      confirmEmail: undefined,
      updatedEmail: undefined,
    };

    const errors = validatePetitionerInteractor(applicationContext, {
      contactInfo: mockContact,
    } as any);

    expect(errors).toBeFalsy();
  });

  it('runs validation on a contact with invalid properties', () => {
    mockContact = {
      ...mockContact,
      confirmEmail: undefined, // required when updatedEmail is present
      postalCode: 'what is love', // invalid postal code
      serviceIndicator: undefined, // required
    };

    const errors = validatePetitionerInteractor(applicationContext, {
      contactInfo: mockContact,
    } as any);

    expect(errors).toEqual({
      confirmEmail: 'Enter a valid email address',
      postalCode: Contact.DOMESTIC_VALIDATION_MESSAGES.postalCode[0].message,
      serviceIndicator: Petitioner.VALIDATION_ERROR_MESSAGES.serviceIndicator,
    });
  });

  it('runs validation on a secondary contact with invalid properties', () => {
    const contact = {
      ...mockContact,
      confirmEmail: undefined,
      postalCode: 'what is love',
    };

    const errors = validatePetitionerInteractor(applicationContext, {
      contactInfo: contact,
    } as any);

    expect(errors).toEqual({
      confirmEmail: 'Enter a valid email address',
      postalCode: Contact.DOMESTIC_VALIDATION_MESSAGES.postalCode[0].message,
    });
  });

  it('returns a validation error when confirmEmail is present without updatedEmail', () => {
    const contact = {
      ...mockContact,
      confirmEmail: 'night@example.com',
      postalCode: '',
      updatedEmail: undefined,
    };

    const errors = validatePetitionerInteractor(applicationContext, {
      contactInfo: contact,
    } as any);

    expect(errors).toEqual({
      confirmEmail: 'Email addresses do not match',
      email: 'Enter a valid email address',
      postalCode: Contact.DOMESTIC_VALIDATION_MESSAGES.postalCode[0].message,
    });
  });

  it('should return an error when second intervenor is added', () => {
    const contact = {
      ...mockContact,
      contactType: CONTACT_TYPES.intervenor,
    };
    const mockExistingPetitioners = [
      {
        contactId: 'bbe5de3e-81b7-4354-bd9b-270717164a5f',
        contactType: CONTACT_TYPES.intervenor,
      },
    ];

    const errors = validatePetitionerInteractor(applicationContext, {
      contactInfo: contact,
      existingPetitioners: mockExistingPetitioners,
    } as any);

    expect(errors).toEqual({
      contactType:
        Petitioner.VALIDATION_ERROR_MESSAGES.contactTypeSecondIntervenor,
    });
  });

  it('should not return an error when first intervenor is edited', () => {
    const contact = {
      ...mockContact,
      contactType: CONTACT_TYPES.intervenor,
    };
    const mockExistingPetitioners = [
      {
        ...contact,
      },
    ];

    const errors = validatePetitionerInteractor(applicationContext, {
      contactInfo: contact,
      existingPetitioners: mockExistingPetitioners,
    });

    expect(errors).toBeFalsy();
  });

  it('should not edit the first intervenor when the contactType is not intervenor', () => {
    const contact = {
      ...mockContact,
      contactType: CONTACT_TYPES.otherFiler,
    };
    const mockExistingPetitioners = [
      {
        ...contact,
      },
    ];

    const errors = validatePetitionerInteractor(applicationContext, {
      contactInfo: contact,
      existingPetitioners: mockExistingPetitioners,
    });

    expect(errors).toBeFalsy();
  });
});
