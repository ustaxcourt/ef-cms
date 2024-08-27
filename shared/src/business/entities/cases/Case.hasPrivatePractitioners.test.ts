import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('hasPrivatePractitioners', () => {
  it('returns true when there are privatePractitioners on the case', () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        privatePractitioners: [
          {
            barNumber: 'OK0063',
            contact: {
              address1: '5943 Joseph Summit',
              address2: 'Suite 334',
              address3: null,
              city: 'Millermouth',
              country: 'U.S.A.',
              countryType: 'domestic',
              phone: '348-858-8312',
              postalCode: '99517',
              state: 'AK',
            },
            email: 'thomastorres@example.com',
            entityName: 'PrivatePractitioner',
            name: 'Brandon Choi',
            role: 'privatePractitioner',
            serviceIndicator: 'Electronic',
            userId: '3bcd5fb7-434e-4354-aa08-1d10846c1867',
          },
        ],
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    expect(caseEntity.hasPrivatePractitioners()).toEqual(true);
  });

  it('returns false when there are NO privatePractitioners on the case', () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        privatePractitioners: [],
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );

    expect(caseEntity.hasPrivatePractitioners()).toEqual(false);
  });
});
