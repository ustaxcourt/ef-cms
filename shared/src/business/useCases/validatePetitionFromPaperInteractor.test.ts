import {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
} from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { validatePetitionFromPaperInteractor } from './validatePetitionFromPaperInteractor';

describe('validate petition from paper', () => {
  it('returns the expected errors object on an empty petition', () => {
    const errors = validatePetitionFromPaperInteractor(applicationContext, {
      petition: {},
    });

    expect(Object.keys(errors)).toEqual([
      'caseCaption',
      'caseType',
      'mailingDate',
      'partyType',
      'petitionFile',
      'petitionPaymentStatus',
      'procedureType',
      'receivedAt',
      'object.missing',
    ]);
  });

  it('returns null if no errors exist', () => {
    const errors = validatePetitionFromPaperInteractor(applicationContext, {
      petition: {
        archivedDocketEntries: [],
        caseCaption: 'testing',
        caseType: CASE_TYPES_MAP.cdp,
        mailingDate: 'testing',
        orderDesignatingPlaceOfTrial: true,
        partyType: PARTY_TYPES.petitioner,
        petitionFile: {},
        petitionFileSize: 100,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
        petitioners: [
          {
            address1: '876 12th Ave',
            city: 'Nashville',
            contactType: CONTACT_TYPES.primary,
            country: 'USA',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'someone@example.com',
            name: 'Jimmy Dean',
            phone: '1234567890',
            postalCode: '05198',
            state: 'AK',
          },
        ],
        procedureType: 'Regular',
        receivedAt: applicationContext.getUtilities().createISODateString(),
      },
    });

    expect(errors).toBeNull();
  });
});
