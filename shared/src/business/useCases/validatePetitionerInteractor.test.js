const {
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
} = require('../entities/EntityConstants');
const {
  validatePetitionerInteractor,
} = require('./validatePetitionerInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { ContactFactory } = require('../entities/contacts/ContactFactory');

describe('validatePetitionerInteractor', () => {
  it('runs validation on a contact with no invalid properties', async () => {
    const contact = {
      address1: '100 Main St.',
      address2: 'Grand View Apartments',
      address3: 'Apt. #104',
      city: 'Jordan',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'night@theroxbury.com',
      name: 'Wilbur Rayou',
      phone: '1111111111',
      postalCode: '55352',
      state: 'MN',
    };

    const partyType = PARTY_TYPES.petitioner;

    const petitioners = [
      {
        ...contact,
        contactType: CONTACT_TYPES.primary,
      },
    ];

    const errors = validatePetitionerInteractor({
      applicationContext,
      contactInfo: contact,
      partyType,
      petitioners,
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
      email: 'night@theroxbury.com',
      name: 'Wilbur Rayou',
      phone: '1111111111',
      postalCode: 'what is love',
      state: 'MN',
    };

    const partyType = PARTY_TYPES.petitioner;

    const petitioners = [
      {
        ...contact,
        contactType: CONTACT_TYPES.primary,
      },
    ];

    const errors = validatePetitionerInteractor({
      applicationContext,
      contactInfo: contact,
      partyType,
      petitioners,
    });

    expect(errors).toEqual({
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
      email: 'night@theroxbury.com',
      name: 'Wilbur Rayou',
      phone: '1111111111',
      postalCode: 'what is love',
      state: 'MN',
    };

    const partyType = PARTY_TYPES.petitionerSpouse;

    const petitioners = [
      {
        contactType: CONTACT_TYPES.primary,
      },
      {
        ...contact,
        contactType: CONTACT_TYPES.secondary,
      },
    ];

    const errors = validatePetitionerInteractor({
      applicationContext,
      contactInfo: contact,
      partyType,
      petitioners,
    });

    expect(errors).toEqual({
      postalCode:
        ContactFactory.DOMESTIC_VALIDATION_ERROR_MESSAGES.postalCode[0].message,
    });
  });
});
