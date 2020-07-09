const {
  validatePetitionFromPaperInteractor,
} = require('./validatePetitionFromPaperInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { PARTY_TYPES, PAYMENT_STATUS } = require('../entities/EntityConstants');

describe('validate petition from paper', () => {
  it('returns the expected errors object on an empty petition', () => {
    const errors = validatePetitionFromPaperInteractor({
      applicationContext,
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
      'chooseAtLeastOneValue',
    ]);
  });

  it('returns null if no errors exist', () => {
    const errors = validatePetitionFromPaperInteractor({
      applicationContext,
      petition: {
        caseCaption: 'testing',
        caseType: 'CDP (Lien/Levy)',
        contactPrimary: {
          address1: '876 12th Ave',
          city: 'Nashville',
          country: 'USA',
          countryType: 'domestic',
          email: 'someone@example.com',
          name: 'Jimmy Dean',
          phone: '1234567890',
          postalCode: '05198',
          state: 'AK',
        },
        mailingDate: 'testing',
        orderDesignatingPlaceOfTrial: true,
        partyType: PARTY_TYPES.petitioner,
        petitionFile: {},
        petitionFileSize: 100,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
        procedureType: 'Regular',
        receivedAt: new Date().toISOString(),
      },
    });

    expect(errors).toBeNull();
  });
});
