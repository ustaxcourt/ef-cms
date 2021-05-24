const {
  CONTACT_TYPES,
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} = require('../entities/EntityConstants');
const {
  validatePetitionerInteractor,
} = require('./validatePetitionerInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { Petitioner } = require('../entities/contacts/Petitioner');
const { UpdateUserEmail } = require('../entities/UpdateUserEmail');

describe('validatePetitionerInteractor', () => {
  let mockContact;

  beforeEach(() => {
    mockContact = {
      address1: '100 Main St.',
      address2: 'Grand View Apartments',
      address3: 'Apt. #104',
      city: 'Jordan',
      confirmEmail: 'night@example.com',
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

  it('runs validation on a contact with no invalid properties', async () => {
    const errors = validatePetitionerInteractor(applicationContext, {
      contactInfo: mockContact,
    });

    expect(errors).toBeFalsy();
  });

  it('should not return validation errors when contact is valid and updatedEmail and confirmEmail are not present', async () => {
    mockContact = {
      ...mockContact,
      confirmEmail: undefined,
      updatedEmail: undefined,
    };

    const errors = validatePetitionerInteractor(applicationContext, {
      contactInfo: mockContact,
    });

    expect(errors).toBeFalsy();
  });

  it('runs validation on a contact with invalid properties', async () => {
    mockContact = {
      ...mockContact,
      confirmEmail: undefined, // required when updatedEmail is present
      postalCode: 'what is love', // invalid postal code
      serviceIndicator: undefined, // required
    };

    const errors = validatePetitionerInteractor(applicationContext, {
      contactInfo: mockContact,
    });

    expect(errors).toEqual({
      confirmEmail:
        UpdateUserEmail.VALIDATION_ERROR_MESSAGES.confirmEmail[1].message,
      postalCode:
        ContactFactory.DOMESTIC_VALIDATION_ERROR_MESSAGES.postalCode[0].message,
      serviceIndicator: Petitioner.VALIDATION_ERROR_MESSAGES.serviceIndicator,
    });
  });

  it('runs validation on a secondary contact with invalid properties', async () => {
    const contact = {
      ...mockContact,
      confirmEmail: undefined,
      postalCode: 'what is love',
    };

    const errors = validatePetitionerInteractor(applicationContext, {
      contactInfo: contact,
    });

    expect(errors).toEqual({
      confirmEmail:
        UpdateUserEmail.VALIDATION_ERROR_MESSAGES.confirmEmail[1].message,
      postalCode:
        ContactFactory.DOMESTIC_VALIDATION_ERROR_MESSAGES.postalCode[0].message,
    });
  });

  it('returns a validation error when confirmEmail is present without updatedEmail', async () => {
    const contact = {
      ...mockContact,
      confirmEmail: 'night@example.com',
      postalCode: '',
      updatedEmail: undefined,
    };

    const errors = validatePetitionerInteractor(applicationContext, {
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
