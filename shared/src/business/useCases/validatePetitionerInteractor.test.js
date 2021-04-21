const {
  validatePetitionerInteractor,
} = require('./validatePetitionerInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { COUNTRY_TYPES } = require('../entities/EntityConstants');
const { UpdateUserEmail } = require('../entities/UpdateUserEmail');

describe('validatePetitionerInteractor', () => {
  it('runs validation on a contact with no invalid properties', async () => {
    const contact = {
      address1: '100 Main St.',
      address2: 'Grand View Apartments',
      address3: 'Apt. #104',
      city: 'Jordan',
      confirmEmail: 'night@example.com',
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Wilbur Rayou',
      phone: '1111111111',
      postalCode: '55352',
      state: 'MN',
      updatedEmail: 'night@example.com',
    };

    const errors = validatePetitionerInteractor({
      applicationContext,
      contactInfo: contact,
    });

    expect(errors).toBeFalsy();
  });

  it('should not return validation errors when contact is valid and email and confirmEmail are not present', async () => {
    const contact = {
      address1: '100 Main St.',
      address2: 'Grand View Apartments',
      address3: 'Apt. #104',
      city: 'Jordan',
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Wilbur Rayou',
      phone: '1111111111',
      postalCode: '55352',
      state: 'MN',
    };

    const errors = validatePetitionerInteractor({
      applicationContext,
      contactInfo: contact,
    });

    expect(errors).toBeFalsy();
  });

  it('runs validation on a contact with invalid properties', async () => {
    const contact = {
      address1: '100 Main St.',
      address2: 'Grand View Apartments',
      address3: 'Apt. #104',
      city: 'Jordan',
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Wilbur Rayou',
      phone: '1111111111',
      postalCode: 'what is love',
      state: 'MN',
      updatedEmail: 'night@example.com',
    };

    const errors = validatePetitionerInteractor({
      applicationContext,
      contactInfo: contact,
    });

    expect(errors).toEqual({
      confirmEmail:
        UpdateUserEmail.VALIDATION_ERROR_MESSAGES.confirmEmail[1].message,
      postalCode:
        ContactFactory.DOMESTIC_VALIDATION_ERROR_MESSAGES.postalCode[0].message,
    });
  });

  it('runs validation on a secondary contact with invalid properties', async () => {
    const contact = {
      address1: '100 Main St.',
      address2: 'Grand View Apartments',
      address3: 'Apt. #104',
      city: 'Jordan',
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Wilbur Rayou',
      phone: '1111111111',
      postalCode: 'what is love',
      state: 'MN',
      updatedEmail: 'night@example.com',
    };

    const errors = validatePetitionerInteractor({
      applicationContext,
      contactInfo: contact,
    });

    expect(errors).toEqual({
      confirmEmail:
        UpdateUserEmail.VALIDATION_ERROR_MESSAGES.confirmEmail[1].message,
      postalCode:
        ContactFactory.DOMESTIC_VALIDATION_ERROR_MESSAGES.postalCode[0].message,
    });
  });

  it('returns a validation error when confirmEmail is present without email', async () => {
    const contact = {
      address1: '100 Main St.',
      address2: 'Grand View Apartments',
      address3: 'Apt. #104',
      city: 'Jordan',
      confirmEmail: 'night@example.com',
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Wilbur Rayou',
      phone: '1111111111',
      postalCode: 'what is love',
      state: 'MN',
    };

    const errors = validatePetitionerInteractor({
      applicationContext,
      contactInfo: contact,
    });

    expect(errors).toEqual({
      confirmEmail:
        UpdateUserEmail.VALIDATION_ERROR_MESSAGES.confirmEmail[0].message,
      email: UpdateUserEmail.VALIDATION_ERROR_MESSAGES.email,
      postalCode:
        ContactFactory.DOMESTIC_VALIDATION_ERROR_MESSAGES.postalCode[0].message,
    });
  });
});
