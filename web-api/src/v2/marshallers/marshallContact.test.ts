const {
  getContactPrimary,
} = require('../../../../shared/src/business/entities/cases/Case');
const { marshallContact } = require('./marshallContact');
const { MOCK_CASE } = require('../../../../shared/src/test/mockCase');
const MOCK_CONTACT = Object.assign({}, getContactPrimary(MOCK_CASE), {
  serviceIndicator: 'Electronic',
});

describe('marshallContact', () => {
  it('returns a contact object with the expected properties', () => {
    expect(Object.keys(marshallContact(MOCK_CONTACT)).sort()).toEqual([
      'address1',
      'address2',
      'address3',
      'city',
      'email',
      'name',
      'phone',
      'postalCode',
      'serviceIndicator',
      'state',
    ]);
  });

  it('marshalls from the current contact format', () => {
    const mock = Object.assign({}, MOCK_CONTACT, {
      address2: 'address2',
      address3: 'address3',
    });

    expect(mock.address1).toBeDefined();
    expect(mock.address2).toBeDefined();
    expect(mock.address3).toBeDefined();
    expect(mock.city).toBeDefined();
    expect(mock.email).toBeDefined();
    expect(mock.name).toBeDefined();
    expect(mock.phone).toBeDefined();
    expect(mock.postalCode).toBeDefined();
    expect(mock.serviceIndicator).toBeDefined();
    expect(mock.state).toBeDefined();

    const marshalled = marshallContact(mock);

    expect(marshalled.address1).toEqual(mock.address1);
    expect(marshalled.address2).toEqual(mock.address2);
    expect(marshalled.address3).toEqual(mock.address3);
    expect(marshalled.city).toEqual(mock.city);
    expect(marshalled.email).toEqual(mock.email);
    expect(marshalled.name).toEqual(mock.name);
    expect(marshalled.phone).toEqual(mock.phone);
    expect(marshalled.postalCode).toEqual(mock.postalCode);
    expect(marshalled.serviceIndicator).toEqual(mock.serviceIndicator);
    expect(marshalled.state).toEqual(mock.state);
  });
});
