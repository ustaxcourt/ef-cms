const {
  COUNTRY_TYPES,
  UNIQUE_OTHER_FILER_TYPE,
} = require('../EntityConstants');
const { getOtherFilerContact } = require('./OtherFilerContact');

describe('OtherFilerContact', () => {
  it('creates a valid other filer contact', () => {
    const entityConstructor = getOtherFilerContact({
      countryType: COUNTRY_TYPES.DOMESTIC,
    });

    const contact = new entityConstructor({
      address1: '123 Deming Way',
      city: 'Los Angeles',
      country: 'USA',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      name: 'Eric',
      otherFilerType: UNIQUE_OTHER_FILER_TYPE,
      phone: '555-555-1212',
      postalCode: '90210',
      state: 'TN',
    });

    expect(contact.getFormattedValidationErrors()).toEqual(null);
  });

  it('creates an invalid other filer contact', () => {
    const entityConstructor = getOtherFilerContact({
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
      otherFilerType: 'Select a filer type',
    });
  });
});
