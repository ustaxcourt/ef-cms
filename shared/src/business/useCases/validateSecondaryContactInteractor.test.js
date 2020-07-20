const {
  validateSecondaryContactInteractor,
} = require('./validateSecondaryContactInteractor');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { COUNTRY_TYPES, PARTY_TYPES } = require('../entities/EntityConstants');

describe('validateSecondaryContactInteractor', () => {
  it('runs validation on a contact with no invalid properties', async () => {
    const contactSecondary = {
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

    const partyType = PARTY_TYPES.petitionerSpouse;

    const errors = validateSecondaryContactInteractor({
      contactInfo: contactSecondary,
      partyType,
    });

    expect(errors).toBeFalsy();
  });

  it('runs validation on a contact with invalid properties', async () => {
    const contactSecondary = {
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

    const errors = validateSecondaryContactInteractor({
      contactInfo: contactSecondary,
      partyType,
    });

    expect(errors).toEqual({
      postalCode:
        ContactFactory.DOMESTIC_VALIDATION_ERROR_MESSAGES.postalCode[0].message,
    });
  });
});
