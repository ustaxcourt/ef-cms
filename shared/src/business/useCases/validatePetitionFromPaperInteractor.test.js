const {
  validatePetitionFromPaperInteractor,
} = require('./validatePetitionFromPaperInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { Case } = require('../entities/cases/Case');

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
        caseType: 'testing',
        mailingDate: 'testing',
        orderDesignatingPlaceOfTrial: true,
        partyType: 'testing',
        petitionFile: {},
        petitionFileSize: 100,
        petitionPaymentStatus: Case.PAYMENT_STATUS.UNPAID,
        procedureType: 'testing',
        receivedAt: new Date().toISOString(),
      },
    });

    expect(errors).toBeNull();
  });
});
