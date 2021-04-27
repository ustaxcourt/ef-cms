const {
  validateAddPetitionerInteractor,
} = require('./validateAddPetitionerInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { Case } = require('../entities/cases/Case');
const { CONTACT_TYPES, COUNTRY_TYPES } = require('../entities/EntityConstants');
const { ContactFactory } = require('../entities/contacts/ContactFactory');

describe('validateAddPetitionerInteractor', () => {
  it('should not return validation errors when contact is valid and a case caption is present', async () => {
    const contact = {
      address1: '100 Main St.',
      address2: 'Grand View Apartments',
      address3: 'Apt. #104',
      caseCaption: 'Caption this',
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
      address1: ContactFactory.DOMESTIC_VALIDATION_ERROR_MESSAGES.address1,
      caseCaption: Case.VALIDATION_ERROR_MESSAGES.caseCaption,
    });
  });
});
