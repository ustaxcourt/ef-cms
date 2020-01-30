const {
  validatePetitionerInformationFormInteractor,
} = require('./validatePetitionerInformationFormInteractor');
const { ContactFactory } = require('../entities/contacts/ContactFactory');

describe('validatePetition', () => {
  it('returns the expected errors object when contactPrimary is missing fields', () => {
    const errors = validatePetitionerInformationFormInteractor({
      contactPrimary: {},
      partyType: ContactFactory.PARTY_TYPES.petitioner,
    });

    expect(Object.keys(errors)).toEqual(['contactPrimary', 'contactSecondary']);
    expect(errors.contactPrimary.name).toBeDefined();
    expect(errors.contactSecondary).toEqual({});
  });

  it('returns null if no errors exist for only a contactPrimary', () => {
    const errors = validatePetitionerInformationFormInteractor({
      contactPrimary: {
        address1: '123 Main St',
        city: 'Somewhere',
        countryType: 'domestic',
        email: 'petitioner@example.com',
        name: 'Test Petitioner',
        phone: '1234567',
        postalCode: '12345',
        state: 'TN',
        title: 'Executor',
      },
      partyType: ContactFactory.PARTY_TYPES.petitioner,
    });

    expect(errors.contactPrimary).toBeNull();
  });

  it('returns null if no errors exist for a contactPrimary and contactSecondary', () => {
    const errors = validatePetitionerInformationFormInteractor({
      contactPrimary: {
        address1: '123 Main St',
        city: 'Somewhere',
        countryType: 'domestic',
        email: 'petitioner@example.com',
        name: 'Test Petitioner',
        phone: '1234567',
        postalCode: '12345',
        state: 'TN',
        title: 'Executor',
      },
      contactSecondary: {
        address1: '123 Main St',
        city: 'Somewhere',
        countryType: 'domestic',
        email: 'petitioner@example.com',
        name: 'Test Petitioner',
        phone: '1234567',
        postalCode: '12345',
        state: 'TN',
        title: 'Executor',
      },
      partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
    });

    expect(errors.contactPrimary).toBeNull();
    expect(errors.contactSecondary).toBeNull();
  });
});
