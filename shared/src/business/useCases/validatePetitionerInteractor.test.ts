import {
  CONTACT_TYPES,
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../entities/EntityConstants';
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
    };
  });

  it('should not return any validation errors when the updated petitioner is valid', () => {
    const errors = validatePetitionerInteractor(applicationContext, {
      contactInfo: mockContact,
      existingPetitioners: [],
    });

    expect(errors).toBeUndefined();
  });

  it('should not return validation errors when contact is valid and updatedEmail and confirmEmail are not present', () => {
    mockContact = {
      ...mockContact,
      confirmEmail: undefined,
      updatedEmail: undefined,
    };

    const errors = validatePetitionerInteractor(applicationContext, {
      contactInfo: mockContact,
      existingPetitioners: [],
    });

    expect(errors).toBeUndefined();
  });

  it('should return validation errors when the updated petitioner is valid', () => {
    mockContact = {
      ...mockContact,
      confirmEmail: undefined, // required when updatedEmail is present
      postalCode: 'what is love', // invalid postal code
      serviceIndicator: undefined, // required
    };

    const errors = validatePetitionerInteractor(applicationContext, {
      contactInfo: mockContact,
      existingPetitioners: [],
    });

    expect(errors).toEqual({
      confirmEmail: 'Enter a valid email address',
      postalCode: 'Enter ZIP code',
      serviceIndicator: 'Select a service indicator',
    });
  });

  it('should return validation errors when the secondary contact is invalid', () => {
    const contact = {
      ...mockContact,
      confirmEmail: undefined,
      postalCode: 'what is love',
    };

    const errors = validatePetitionerInteractor(applicationContext, {
      contactInfo: contact,
      existingPetitioners: [],
    });

    expect(errors).toEqual({
      confirmEmail: 'Enter a valid email address',
      postalCode: 'Enter ZIP code',
    });
  });

  it('should return validation errors when confirmEmail is present without updatedEmail', () => {
    const contact = {
      ...mockContact,
      confirmEmail: 'night@example.com',
      postalCode: '',
      updatedEmail: undefined,
    };

    const errors = validatePetitionerInteractor(applicationContext, {
      contactInfo: contact,
      existingPetitioners: [],
    });

    expect(errors).toEqual({
      confirmEmail: 'Email addresses do not match',
      email: 'Enter a valid email address',
      postalCode: 'Enter ZIP code',
    });
  });

  it('should return validation errors when second intervenor is added', () => {
    const contact = {
      ...mockContact,
      contactType: CONTACT_TYPES.intervenor,
    };

    const errors = validatePetitionerInteractor(applicationContext, {
      contactInfo: contact,
      existingPetitioners: [
        {
          ...contact,
          contactId: 'bbe5de3e-81b7-4354-bd9b-270717164a5f',
          contactType: CONTACT_TYPES.intervenor,
        },
      ],
    });

    expect(errors).toEqual({
      contactType:
        'Only one (1) Intervenor is allowed per case. Please select a different Role.',
    });
  });

  it('should NOT return a validation error when first intervenor is edited', () => {
    const mockExistingPetitioners = [
      {
        ...mockContact,
        contactType: CONTACT_TYPES.intervenor,
      },
    ];

    const errors = validatePetitionerInteractor(applicationContext, {
      contactInfo: {
        ...mockContact,
        address1: '9820 Another Street Place', // Updated address
        contactType: CONTACT_TYPES.intervenor,
      },
      existingPetitioners: mockExistingPetitioners,
    });

    expect(errors).toBeUndefined();
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

    expect(errors).toBeUndefined();
  });
});
