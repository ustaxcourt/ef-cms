const { COUNTRY_TYPES } = require('../EntityConstants');
const { getOtherPetitionerContact } = require('./OtherPetitionerContact');

describe('OtherFilerContact', () => {
  it('creates a valid other petitioner contact', () => {
    const entityConstructor = getOtherPetitionerContact({
      countryType: COUNTRY_TYPES.DOMESTIC,
    });

    const contact = new entityConstructor({
      additionalName: 'First Petitioner',
      address1: '123 Deming Way',
      city: 'Los Angeles',
      country: 'USA',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      name: 'Eric',
      phone: '555-555-1212',
      postalCode: '90210',
      state: 'TN',
    });

    expect(contact.getFormattedValidationErrors()).toEqual(null);
  });

  it('creates an invalid other petitioner contact', () => {
    const entityConstructor = getOtherPetitionerContact({
      countryType: COUNTRY_TYPES.DOMESTIC,
    });

    const contact = new entityConstructor({
      address1: '123 Deming Way',
      city: 'Los Angeles',
      country: 'USA',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      name: 'Eric',
      phone: '555-555-1212',
      postalCode: '90210',
      state: 'TN',
    });

    expect(contact.getFormattedValidationErrors()).toEqual({
      additionalName: 'Enter name of other petitioner',
    });
  });
});
