import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { getContactPrimary } from '../../../../../shared/src/business/entities/cases/Case';
import { marshallContact } from './marshallContact';
const MOCK_CONTACT = Object.assign({}, getContactPrimary(MOCK_CASE), {
  serviceIndicator: 'Electronic',
});

const MOCK_CONTACT_INTERNATIONAL = Object.assign({}, MOCK_CONTACT, {
  country: 'Brazil',
  serviceIndicator: 'Electronic',
});

describe('marshallContact', () => {
  it('returns a contact object with the expected properties', () => {
    expect(Object.keys(marshallContact(MOCK_CONTACT)).sort()).toEqual([
      'address1',
      'address2',
      'address3',
      'city',
      'country',
      'email',
      'name',
      'phone',
      'postalCode',
      'serviceIndicator',
      'state',
    ]);

    expect(
      Object.keys(marshallContact(MOCK_CONTACT_INTERNATIONAL)).sort(),
    ).toEqual([
      'address1',
      'address2',
      'address3',
      'city',
      'country',
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
    expect(mock.country).toBeUndefined(); // undefined

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
    expect(marshalled.country).toEqual(mock.country);
  });

  it('marshalls from the current contact format for users with a country', () => {
    const mock = Object.assign({}, MOCK_CONTACT_INTERNATIONAL, {
      address2: 'address2',
      address3: 'address3',
    });

    expect(mock.address1).toBeDefined();
    expect(mock.address2).toBeDefined();
    expect(mock.address3).toBeDefined();
    expect(mock.city).toBeDefined();
    expect(mock.country).toBeDefined();
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
    expect(marshalled.country).toEqual(mock.country);
    expect(marshalled.email).toEqual(mock.email);
    expect(marshalled.name).toEqual(mock.name);
    expect(marshalled.phone).toEqual(mock.phone);
    expect(marshalled.postalCode).toEqual(mock.postalCode);
    expect(marshalled.serviceIndicator).toEqual(mock.serviceIndicator);
    expect(marshalled.state).toEqual(mock.state);
  });
});
