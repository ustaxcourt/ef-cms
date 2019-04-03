const {
  validatePetitionFromPaper,
} = require('./validatePetitionFromPaperInteractor');
const { PetitionFromPaper } = require('../entities/PetitionFromPaper');
const { omit } = require('lodash');

describe('validatePetition', () => {
  it('returns the expected errors object on an empty petition', () => {
    const errors = validatePetitionFromPaper({
      applicationContext: {
        getEntityConstructors: () => ({
          PetitionFromPaper,
        }),
      },
      petition: {},
    });

    expect(Object.keys(errors)).toEqual(
      Object.keys(
        omit(PetitionFromPaper.errorToMessageMap, [
          'caseType',
          'irsNoticeDate',
          'ownershipDisclosureFile',
        ]),
      ),
    );
  });
});
