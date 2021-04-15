const {
  validateAddPetitionerInteractor,
} = require('./validateAddPetitionerInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { CONTACT_TYPES, COUNTRY_TYPES } = require('../entities/EntityConstants');

describe('validateAddPetitionerInteractor', () => {
  it('should not return validation errors when contact is valid', async () => {
    const contact = {
      address1: '100 Main St.',
      address2: 'Grand View Apartments',
      address3: 'Apt. #104',
      city: 'Jordan',
      contactType: CONTACT_TYPES.otherPetitioner,
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Wilbur Rayou',
      phone: '1111111111',
      postalCode: '55352',
      state: 'MN',
    };

    const errors = validateAddPetitionerInteractor({
      applicationContext,
      contact,
    });

    expect(errors).toBeFalsy();
  });

  it('should return errors when the contact is invalid', async () => {
    const contact = {
      address1: undefined,
      address2: 'Grand View Apartments',
      address3: 'Apt. #104',
      city: 'Jordan',
      contactType: CONTACT_TYPES.otherPetitioner,
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Wilbur Rayou',
      phone: '1111111111',
      postalCode: '55352',
      state: 'MN',
    };

    const errors = validateAddPetitionerInteractor({
      applicationContext,
      contact,
    });

    expect(errors).toEqual({
      address1: 'Enter mailing address',
    });
  });
});
