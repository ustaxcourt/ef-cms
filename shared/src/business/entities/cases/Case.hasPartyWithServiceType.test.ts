import {
  CONTACT_TYPES,
  PARTY_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../EntityConstants';
import { Case, getContactPrimary } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('hasPartyWithServiceType', () => {
  it('should return true if contactPrimary service indicator is paper', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      },
      { applicationContext },
    );

    const hasPartyWithPaperService = myCase.hasPartyWithServiceType(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );

    expect(hasPartyWithPaperService).toBeTruthy();
  });

  it('should return true if contactSecondary service indicator is paper', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.petitionerSpouse,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          },
          {
            ...getContactPrimary(MOCK_CASE),
            contactType: CONTACT_TYPES.secondary,
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      },
      { applicationContext },
    );

    const hasPartyWithPaperService = myCase.hasPartyWithServiceType(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );

    expect(hasPartyWithPaperService).toBeTruthy();
  });

  it('should return true if any privatePractitioner has paper service indicator', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        privatePractitioners: [
          {
            name: 'Bob Barker',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
            userId: '919b8ead-d8ec-487d-a0c0-4e136a566f74',
          },
        ],
      },
      { applicationContext },
    );

    const hasPartyWithPaperService = myCase.hasPartyWithServiceType(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );

    expect(hasPartyWithPaperService).toBeTruthy();
  });

  it('should return true if any irsPractitioner has paper service indicator', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        irsPractitioners: [
          {
            name: 'Bob Barker',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
            userId: '919b8ead-d8ec-487d-a0c0-4e136a566f74',
          },
        ],
      },
      { applicationContext },
    );

    const hasPartyWithPaperService = myCase.hasPartyWithServiceType(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );

    expect(hasPartyWithPaperService).toBeTruthy();
  });

  it('should return false if no contacts or practitioners have paper service indicator', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          },
        ],
      },
      { applicationContext },
    );

    const hasPartyWithPaperService = myCase.hasPartyWithServiceType(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );

    expect(hasPartyWithPaperService).toBeFalsy();
  });
});
