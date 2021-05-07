const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  OTHER_FILER_TYPES,
  SERVICE_INDICATOR_TYPES,
  UNIQUE_OTHER_FILER_TYPE,
} = require('../EntityConstants');
const { Case, getContactPrimary } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getOtherFilers', () => {
  it('sets a valid value of otherFilers on the case', () => {
    const mockOtherFilers = [
      {
        address1: '42 Lamb Sauce Blvd',
        city: 'Nashville',
        contactType: CONTACT_TYPES.otherFiler,
        country: 'USA',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'gordon@example.com',
        name: 'Gordon Ramsay',
        otherFilerType: UNIQUE_OTHER_FILER_TYPE,
        phone: '1234567890',
        postalCode: '05198',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        state: 'AK',
      },
      {
        address1: '1337 12th Ave',
        city: 'Flavortown',
        contactType: CONTACT_TYPES.otherFiler,
        country: 'USA',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'mayor@example.com',
        name: 'Guy Fieri',
        otherFilerType: OTHER_FILER_TYPES[1],
        phone: '1234567890',
        postalCode: '05198',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        state: 'AK',
      },
    ];

    const myCase = new Case(
      {
        ...MOCK_CASE,
        petitioners: [getContactPrimary(MOCK_CASE), ...mockOtherFilers],
        status: CASE_STATUS_TYPES.generalDocket,
      },
      {
        applicationContext,
      },
    );

    expect(myCase.getOtherFilers()).toMatchObject(mockOtherFilers);
  });
});
