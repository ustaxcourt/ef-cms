const {
  validatePetitionFromPaperInteractor,
} = require('./validatePetitionFromPaperInteractor');
const { CaseInternal } = require('../entities/cases/CaseInternal');

describe('validatePetition', () => {
  it('returns the expected errors object on an empty petition', () => {
    const errors = validatePetitionFromPaperInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          CaseInternal,
        }),
      },
      petition: {},
    });

    expect(Object.keys(errors)).toEqual([
      'caseCaption',
      'caseType',
      'partyType',
      'petitionFile',
      'procedureType',
      'receivedAt',
    ]);
  });

  it('returns null if no errors exist', () => {
    const errors = validatePetitionFromPaperInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          CaseInternal,
        }),
      },
      petition: {
        caseCaption: 'testing',
        caseType: 'testing',
        partyType: 'testing',
        petitionFile: {},
        petitionFileSize: 100,
        procedureType: 'testing',
        receivedAt: new Date().toISOString(),
      },
    });

    expect(errors).toBeNull();
  });
});
