const { getOtherFilerContact } = require('./OtherFilerContact');
const { UNIQUE_OTHER_FILER_TYPE } = require('../EntityConstants');

describe('OtherFilerContact', () => {
  it('creates a valid other filer contact', () => {
    const entityConstructor = getOtherFilerContact({
      countryType: 'domestic',
    });

    const contact = new entityConstructor({
      address1: '123 Deming Way',
      city: 'Los Angeles',
      country: 'USA',
      countryType: 'domestic',
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
      otherFilerType: 'Select a filer type',
    });
  });
});
