const {
  validatePetitionForPetitionerAndDeceasedSpouse,
} = require('./validatePetitionForPetitionerAndDeceasedSpouse.interactor');
const PetitionForPetitionerAndDeceasedSpouse = require('../entities/PetitionForPetitionerAndDeceasedSpouse');
const PetitionerPrimaryContact = require('../entities/Contacts/PetitionerPrimaryContact');
const PetitionerDeceasedSpouseContact = require('../entities/Contacts/PetitionerDeceasedSpouseContact');

describe('validatePetitionForPetitionerAndDeceasedSpouse', () => {
  it('returns the expected errors object on an empty petition', () => {
    const errors = validatePetitionForPetitionerAndDeceasedSpouse({
      petitionForPetitionerAndDeceasedSpouse: {},
      applicationContext: {
        getEntityConstructors: () => ({
          PetitionForPetitionerAndDeceasedSpouse,
        }),
      },
    });
    expect(errors).toBeTruthy();
    expect(errors.contactPrimary).toEqual(
      PetitionerPrimaryContact.errorToMessageMap,
    );
    expect(errors.contactSecondary).toEqual(
      PetitionerDeceasedSpouseContact.errorToMessageMap,
    );
  });

  it('returns null on a valid petition contacts', () => {
    const errors = validatePetitionForPetitionerAndDeceasedSpouse({
      petitionForPetitionerAndDeceasedSpouse: {
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
        },
      },
      applicationContext: {
        getEntityConstructors: () => ({
          PetitionForPetitionerAndDeceasedSpouse,
        }),
      },
    });
    expect(errors).toBeNull();
  });
});
