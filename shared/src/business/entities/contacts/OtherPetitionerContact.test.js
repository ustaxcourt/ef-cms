const { getOtherPetitionerContact } = require('./OtherPetitionerContact');

describe('OtherFilerContact', () => {
  it('creates a valid other petitioner contact', () => {
    const entityConstructor = getOtherPetitionerContact({
      countryType: 'domestic',
    });

    const contact = new entityConstructor({
      additionalName: 'First Petitioner',
      address1: '123 Deming Way',
      city: 'Los Angeles',
      country: 'USA',
      countryType: 'domestic',
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
      countryType: 'domestic',
    });

    const contact = new entityConstructor({
      address1: '123 Deming Way',
      city: 'Los Angeles',
      country: 'USA',
      countryType: 'domestic',
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
