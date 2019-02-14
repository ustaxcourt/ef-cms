const {
  validatePetitionForPetitionerAndSpouse,
} = require('./validatePetitionForPetitionerAndSpouse.interactor');
const PetitionForPetitionerAndSpouse = require('../entities/PetitionForPetitionerAndSpouse');
const PetitionerPrimaryContact = require('../entities/Contacts/PetitionerPrimaryContact');
const PetitionerSpouseContact = require('../entities/Contacts/PetitionerSpouseContact');

describe('validatePetitionForPetitionerAndSpouse', () => {
  it('returns the expected errors object on an empty petition', () => {
    const errors = validatePetitionForPetitionerAndSpouse({
      petitionForPetitionerAndSpouse: {},
      applicationContext: {
        getEntityConstructors: () => ({
          PetitionForPetitionerAndSpouse,
        }),
      },
    });
    expect(errors).toBeTruthy();
    expect(errors.contactPrimary).toEqual(
      PetitionerPrimaryContact.errorToMessageMap,
    );
    expect(errors.contactSecondary).toEqual(
      PetitionerSpouseContact.errorToMessageMap,
    );
  });
  it('returns null on a valid petition contacts', () => {
    const errors = validatePetitionForPetitionerAndSpouse({
      petitionForPetitionerAndSpouse: {
        contactPrimary: {
          name: 'Jimmy Dean',
          address1: '876 12th Ave',
          city: 'Nashville',
          state: 'AK',
          zip: '05198',
          country: 'USA',
          phone: '1234567890',
          email: 'someone@example.com',
        },
        contactSecondary: {
          name: 'Betty Crocker',
          address1: '1599 Pennsylvania Ave',
          city: 'Walla Walla',
          state: 'WA',
          zip: '78774',
          phone: '1234567890',
          email: 'someone@example.com',
        },
      },
      applicationContext: {
        getEntityConstructors: () => ({
          PetitionForPetitionerAndSpouse,
        }),
      },
    });
    expect(errors).toBeNull();
  });
});
