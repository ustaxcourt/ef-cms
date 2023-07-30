import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { MOCK_USERS } from '../../../../../shared/src/test/mockUsers';
import { marshallPractitioner } from './marshallPractitioner';
const MOCK_PRACTITIONER = MOCK_USERS['330d4b65-620a-489d-8414-6623653ebc4f'];
import { SERVICE_INDICATOR_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { getContactPrimary } from '../../../../../shared/src/business/entities/cases/Case';

describe('marshallPractitioner', () => {
  const MOCK_CONTACT = getContactPrimary(MOCK_CASE);

  it('returns a practitioner object with the expected properties', () => {
    expect(Object.keys(marshallPractitioner(MOCK_PRACTITIONER)).sort()).toEqual(
      ['barNumber', 'contact', 'email', 'firmName', 'name', 'serviceIndicator'],
    );
  });

  it('marshalls from the current practitioner format', () => {
    const mock = Object.assign({}, MOCK_PRACTITIONER, {
      contact: MOCK_CONTACT,
      email: MOCK_CONTACT.email,
      firmName: 'A Firm Example',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    });

    expect(mock.barNumber).toBeDefined();
    expect(mock.contact).toBeDefined();
    expect(mock.email).toBeDefined();
    expect(mock.name).toBeDefined();
    expect(mock.firmName).toBeDefined();
    expect(mock.serviceIndicator).toBeDefined();

    const marshalled = marshallPractitioner(mock);

    expect(marshalled.barNumber).toEqual(mock.barNumber);
    expect(marshalled.email).toEqual(mock.email);
    expect(marshalled.name).toEqual(mock.name);
    expect(marshalled.firmName).toBeDefined();
    expect(marshalled.serviceIndicator).toEqual(mock.serviceIndicator);

    // Exact format asserted in other tests.
    expect(marshalled.contact).toBeDefined();
  });
});
