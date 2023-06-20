import {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../EntityConstants';
import { Case, getContactPrimary } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('getOtherFilers', () => {
  it('sets a valid value of otherFilers on the case', () => {
    const mockOtherFilers = [
      {
        address1: '42 Lamb Sauce Blvd',
        city: 'Nashville',
        contactType: CONTACT_TYPES.intervenor,
        country: 'USA',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'gordon@example.com',
        name: 'Gordon Ramsay',
        phone: '123-456-7890',
        postalCode: '05198',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        state: 'AK',
      },
      {
        address1: '1337 12th Ave',
        city: 'Flavortown',
        contactType: CONTACT_TYPES.participant,
        country: 'USA',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'mayor@example.com',
        name: 'Guy Fieri',
        phone: '123-456-7890',
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
