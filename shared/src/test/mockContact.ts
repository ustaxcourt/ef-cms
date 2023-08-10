import {
  CONTACT_TYPES,
  COUNTRY_TYPES,
} from '../business/entities/EntityConstants';
import { RawContact } from '../business/entities/contacts/Contact';

export const MOCK_CONTACT_PRIMARY: RawContact = {
  address1: '876 12th Ave',
  address2: 'Suite 123',
  address3: 'Room 13',
  city: 'Nashville',
  contactId: '6f527aec-3a73-4e1e-ab76-6ba7af7478ee',
  contactType: CONTACT_TYPES.primary,
  country: 'USA',
  countryType: COUNTRY_TYPES.DOMESTIC,
  email: 'primary_contact@example.com',
  entityName: 'Contact',
  inCareOf: 'USTC',
  isAddressSealed: false,
  name: 'Jimmy Dean',
  phone: '1234567890',
  postalCode: '05198',
  secondaryName: 'Jimmy Dean',
  state: 'AK',
};

export const MOCK_CONTACT_SECONDARY: RawContact = {
  address1: 'Test Address',
  city: 'Testville',
  contactId: '09ecdf10-359c-4694-a5a8-d15d56796ce1',
  contactType: CONTACT_TYPES.secondary,
  country: 'USA',
  countryType: COUNTRY_TYPES.DOMESTIC,
  email: 'secondary_contact@example.com',
  entityName: 'Contact',
  inCareOf: 'USTC',
  isAddressSealed: false,
  name: 'Contact Secondary',
  phone: '1234567890',
  postalCode: '05198',
  secondaryName: 'Jimmy Dean',
  state: 'CA',
};
