const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} = require('../EntityConstants');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getOtherPetitioners', () => {
  it('sets the value of otherPetitioners on the case', () => {
    const mockOtherPetitioners = [
      {
        additionalName: 'First Other Petitioner',
        address1: '876 12th Ave',
        city: 'Nashville',
        contactType: CONTACT_TYPES.otherPetitioner,
        country: 'USA',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'someone@example.com',
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        state: 'AK',
      },
      {
        additionalName: 'First Other Petitioner',
        address1: '876 12th Ave',
        city: 'Nashville',
        contactType: CONTACT_TYPES.otherPetitioner,
        country: 'USA',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'someone@example.com',
        name: 'Jimmy Dean',
        phone: '1234567890',
        postalCode: '05198',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        state: 'AK',
      },
    ];

    const myCase = new Case(
      {
        ...MOCK_CASE,
        petitioners: [...MOCK_CASE.petitioners, ...mockOtherPetitioners],
        status: CASE_STATUS_TYPES.generalDocket,
      },
      {
        applicationContext,
      },
    );

    expect(myCase.getOtherPetitioners()).toMatchObject(mockOtherPetitioners);
  });
});
